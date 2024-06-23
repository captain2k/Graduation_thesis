import { BadRequestError } from "../../core/error.response";
import db from "../index";

const validateStatic = async (payload) => {
  const newStatic = await db.Static.build({
    ...payload,
  });

  return await newStatic.validateStatic();
};

const createNewStatic = async (payload) => {
  const { type } = payload;
  const static_isValid = await validateStatic(payload);

  if (static_isValid.status === false) {
    throw new BadRequestError(static_isValid.message);
  }

  const filter = { type: type };
  const update = { ...payload };
  const options = { upsert: true };

  console.log('update>>>>>>', update);

  return await db.Static.create({
    filter: filter,
    values: update,
    options: options,
  });
};

module.exports = {
    createNewStatic,
};
