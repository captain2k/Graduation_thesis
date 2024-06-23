("use strict");
import { findById } from "../models/repository/user.repo";
import db from "../models";
import { menu, menu_user, TYPE_ROLE_USER } from "../constants";
import { getInfoData, removeElement } from "../utils";
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
import { validateUser, createNewUser } from "../models/repository/user.repo";
import { BadRequestError, NotFoundError } from "../core/error.response";

class UserService {
  static findUserById = async (userId) => {
    const userInfo = await findById(userId);

    return removeElement({
      object: userInfo,
      field: ["createdAt", "updatedAt", "password", "createdAt"],
    });
  };

  static handleGetUserInfo = async (userId) => {
    const userInfo = await findById(userId);

    return removeElement({
      object: userInfo,
      field: ["createdAt", "updatedAt", "password", "createdAt"],
    });
  };
  

  static handleGetMenu = async (roleUser) => {
    return menu.reduce((current, next) => {
      if (next.role.includes(Number(roleUser))) {
        current.push(
          getInfoData({ field: ["id", "href", "icon", "label"], object: next })
        );
      }

      return current;
    }, []);
  };

  static handleGetMenuUser = async (roleUser) => {
    const role = roleUser ? roleUser : TYPE_ROLE_USER.USER;
  
    const result  = menu_user.reduce((current, next) => {
      if (next.role.includes(Number(role))) {
        current.push(
          getInfoData({ field: ["id", "href", "label"], object: next })
        );
      }

      return current;
    }, []);
    return result;
  };


  static getAllUser = async (query) => {
    const page = +query.page || 1;
    const limit = +query.limit || 10;

    return await db.User.findAndCountAll({
      where: { deleteFlg: 0 },
      attributes: { exclude: ["password"] },
      limit: limit,
      offset: (page - 1) * limit,
    });
  };

  static updateUser = async ({ userId, dataUser }) => {
    return await db.User.update(
      { ...dataUser },
      {
        where: {
          id: userId,
        },
      }
    );
  };

  static deleteUser = async (userId) => {
    return await db.User.update(
      { deleteFlg: 1 },
      {
        where: {
          id: userId,
        },
      }
    );
  };

  static changePassword = async (data) => {
    const { userId, password, re_password, current_password } = data;

    console.log('data>>>>>>>', data);

    if(!userId || !password || !re_password) {
      throw new BadRequestError('id, password, re_password is not empty');
    }
 
    const user = await db.User.findByPk(userId);
    if(!user) {
      throw new NotFoundError('user not found');
    }

    if(current_password) {
      const match = await bcrypt.compare(current_password, user.password);
      if(!match) {
        throw new BadRequestError('Password current is wrong!!!')
      }
    }
    
    if(re_password !== password) {
      throw new BadRequestError('Password and Re_password not equal');
    }

    //create password hash
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;

    return await user.save();
  };

  /**
   *
   * @param {*} valueSearch: fullName, email, telephone
   */
  static searchUser = async (query) => {
    const page = +query.page || 1;
    const limit = +query.limit || 10;
    const valueSearch = query.name;

    return await db.User.findAndCountAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${valueSearch}%` } },
          { email: { [Op.like]: `%${valueSearch}%` } },
          { phoneNumber: { [Op.like]: `%${valueSearch}%` } },
        ],
      },
      attributes: { exclude: ["password"] },
      limit: limit,
      offset: (page - 1) * limit,
    });
  };

  static createNewUser = async (data) => {
    //step1: check email exists
    const validateField = await validateUser({ ...data });
    if (!validateField.status) {
      throw new Error(validateField.message);
    }

    const { email, password } = data;
    //step2: check email exists
    const holderUser = await db.User.findOne({ raw: true, where: { email } });

    if (holderUser) {
      throw new BadRequestError("Error: Email already registered");
    }

    //step3: encode password
    const passwordHash = await bcrypt.hash(password, 10);

    //step4: create user

    const newUser = await createNewUser({ ...data, password: passwordHash });

    if (newUser) {
      const infoUser = getInfoData({
        field: [
          "id",
          "fullName",
          "email",
          "phoneNumber",
          "address",
          "dateOfBirth",
          "sex",
          "role_user",
          "deleteFlg",
          'avatar',
          'avatar_support'
        ],
        object: newUser,
      });
      //step5: response data
      return infoUser;
    }

    return null;
  };
}

module.exports = UserService;
