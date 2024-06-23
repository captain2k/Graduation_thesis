"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const tokenService = require("./token.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
import { findById } from "../models/repository/user.repo";
import db from "../models";
import { validateUser, createNewUser } from "../models/repository/user.repo";
import { deleteFIleUpload, getInfoData } from "../utils";
import { deleteFileS3, uploadFileS3 } from "../utils/aws";
import moment from "moment";
import { sendMailSingUP } from "../utils/sendMail";
import { TYPE_LOGIN_PROVIDER } from "../constants";
const fs = require("fs").promises;

class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await tokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      //decode user nào đang sử dụng lại refresh token
      const { user_id, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await tokenService.deleteKeyById(user_id);

      throw new ForbiddenError("Something wrong happened !!! Pls re-login");
    }

    const holderToken = await tokenService.findByRefreshTokenByUser(
      refreshToken
    );

    if (!holderToken) throw new AuthFailureError("User not registered");
    const { user_id, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    const foundUser = await findById(user_id);
    if (!foundUser) throw new AuthFailureError("Shop not registered");

    const tokens = await createTokenPair(
      { user_id: foundUser.id, email, role_user: foundUser.role_user },
      holderToken.publicKey,
      holderToken.privateKey
    );
    //update refreshToken and refreshToken used
    const tokenUsed = JSON.parse(holderToken.refreshTokenUsed);

    holderToken.refreshToken = tokens.refreshToken;
    holderToken.refreshTokenUsed = JSON.stringify([...tokenUsed, refreshToken]);
    holderToken.save();

    return {
      user: { id: user_id, email },
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await tokenService.removeKeyById(keyStore.id);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    //check exits email
    const foundUser = await db.User.findOne({ where: { email, provider: TYPE_LOGIN_PROVIDER.LOCAL }, raw: true });
    if (!foundUser || foundUser.deleteFlg !== 0)
      throw new BadRequestError("User not registered");

    // //check match password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Password not match to email!");

    if (foundUser && foundUser.is_active === "0") {
      throw new BadRequestError("Please verify email. Before login!");
    }


    // //create privateKey, public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    console.log("email, password,>>>>>>>",publicKey);
    // // generator tokens
    const tokens = await createTokenPair(
      { user_id: foundUser.id, email, role_user: foundUser.role_user },
      publicKey,
      privateKey
    );


    await tokenService.createKeyToken({
      userId: foundUser.id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });



    return {
      user: getInfoData({
        field: ["id", "fullName", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static loginProvider = async (data) => {
    if (!data.provider || !data.uid) throw new BadRequestError("provider, uid is required!");

    const filter = {uid: data.uid, provider: data.provider};

    const update = { ...data, password: data.uid};
    const options = { upsert: true };

    const userProvider = await db.User.findOneAndUpdate({
      filter: filter,
      values: update,
      options: options,
    });

    // //create privateKey, public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // // generator tokens
    const tokens = await createTokenPair(
      { user_id: userProvider.id, email: userProvider.email, role_user: userProvider.role_user },
      publicKey,
      privateKey
    );

    await tokenService.createKeyToken({
      userId: userProvider.id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({
        field: ["id", "fullName", "email"],
        object: userProvider,
      }),
      tokens,
    };
  };

  static handleVerifyEmail = async (data, user_exits) => {
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // // generator tokens
    const tokens = await createTokenPair(
      { user_id: user_exits.id, email: user_exits.email, is_active: "0" },
      publicKey,
      privateKey
    );

    await tokenService.createKeyToken({
      userId: user_exits.id,
      publicKey: publicKey,
      privateKey: publicKey,
      refreshToken: tokens.accessToken,
    });

    sendMailSingUP({ data, token: tokens.accessToken });
  };

  static signUp = async (data) => {
    const active = data.is_active ? data.is_active : "1";
    //step1: check email exists
    const validateField = await validateUser({ ...data });
    if (!validateField.status) {
      throw new Error(validateField.message);
    }

    const { email, password } = data;
    //step2: check email exists and active
    const holderUser = await db.User.findOne({ raw: true, where: { email, provider: TYPE_LOGIN_PROVIDER.LOCAL } });

    if (holderUser && holderUser.is_active === "1") {
      throw new BadRequestError("Error: Email already registered");
    }

    if (holderUser && holderUser.is_active === "0") {
      const is_expired = moment(holderUser.time_expired).diff(
        moment(),
        "hours"
      );

      if (is_expired > 0)
        throw new BadRequestError(
          "Email is created. You need to verify email to login!"
        );

      await AccessService.handleVerifyEmail(data, newUser);
      throw new BadRequestError(
        "Please verify the most recent email sent to you!"
      );
    }

    //step3: encode password
    const passwordHash = await bcrypt.hash(password, 10);

    //step4: create user
    const newUser = await createNewUser({
      ...data,
      password: passwordHash,
      is_active: active,
      time_expired: moment().add(1, "day").format(),
    });

    //step5: verify email if not active
    if (active === "0") {
      await AccessService.handleVerifyEmail(data, newUser);
    }

    //step6: response data
    return {
      code: 201,
      metadata: {
        user: getInfoData({
          field: [
            "id",
            "fullName",
            "email",
            "phoneNumber",
            "address",
            "dateOfBirth",
            "sex",
          ],
          object: newUser,
        }),
      },
    };
  };

  static uploadFileServiceS3 = async (file, data) => {
    if (!file || !data.nameFile) {
      throw new BadRequestError("File and nameFile is required!");
    }

    const pathImage = file.path;
    const nameImage = data.nameFile;

    try {
      const fileData = await fs.readFile(pathImage);

      const fileS3 = await uploadFileS3(fileData, nameImage);

      //delete file in folder upload
      deleteFIleUpload(pathImage);

      return fileS3;
    } catch (err) {
      throw err;
    }
  };

  static deleteFileServiceS3 = async (key) => {
    if (!key) {
      throw new BadRequestError("key is required!");
    }

    return await deleteFileS3(key);
  };

  static activeUser = async ({ token }) => {
    const holderToken = await tokenService.findByRefreshTokenByUser(token);

    if (!holderToken) throw new AuthFailureError("User not registered");
    const { user_id } = await verifyJWT(token, holderToken.privateKey);

    const foundUser = await await db.User.findOne({ where: { id: user_id } });
    if (!foundUser) throw new AuthFailureError("Shop not registered");

    //active user
    foundUser.is_active = "1";
    await foundUser.save();

    //refresh token
    holderToken.refreshToken = "";
    holderToken.publicKey = "";
    holderToken.privateKey = "";
    await holderToken.save();

    return {
      user_active: true,
      user_id: user_id,
    };
  };
}

module.exports = AccessService;
