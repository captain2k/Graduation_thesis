import { BadRequestError } from "../../core/error.response";
const { Op, where } = require("sequelize");
import db, { sequelize } from "../index";

const validateMarkdown = async (payload) => {
  console.log('payload>>>>', payload);
  const newMarkdown = await db.Markdowns.build({
    ...payload,
  });

  return await newMarkdown.validateMarkdown();
};

const createNewMarkdown = async (payload) => {
  const markdown_valid = await validateMarkdown(payload);

  if (markdown_valid.status === false) {
    throw new BadRequestError(markdown_valid.message);
  }

  const filter = {};
  if (payload.markdown_id && !isNaN(payload.markdown_id))
    filter.id = payload.markdown_id;
  const update = { ...payload };
  const options = { upsert: true };

  return await db.Markdowns.findOneAndUpdate({
    filter: filter,
    values: update,
    options: options,
  });
};

module.exports = {
  createNewMarkdown,
};
