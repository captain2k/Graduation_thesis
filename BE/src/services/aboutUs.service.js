("use strict");
import {
  createNewAboutUs,
  updateAboutUs,
} from "../models/repository/aboutUs.repo";
import db, { sequelize } from "../models";
const { Op } = require("sequelize");

class AboutUsService {
  static UpdateAboutUs = async (payload) => {
    return await updateAboutUs(payload);
  };

  static deleteAboutUs = async (CategoryId) => {
    return await db.AboutUs.destroy({
      where: {
        id: CategoryId,
      },
    });
  };

  static searchAboutUs = async (query) => {
    const page = +query.page || 1;
    const limit = query.limit ? +query.limit : null;
    const valueSearch = query.name;

    const queryOptions = {
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${valueSearch}%` } }],
      },
      attributes: [
        "id",
        "name",
        "address",
        "address_link",
        "phone_number",
        "email",
        "logo",
        "image",
        "is_active",
        "updatedAt",
        "markdown_id",
        "createdAt",
        // [sequelize.literal("markdown_data.contentHTML"), "contentHTML"],
        // [sequelize.literal("markdown_data.contentMarkdown"), "contentMarkdown"],
      ],
      include: [{ model: db.Markdowns, as: "markdown_data", attributes: [] }],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
    };

    if (limit !== null) {
      queryOptions.limit = limit;
    }

    return await db.AboutUs.findAndCountAll(queryOptions);
  };

  static createAboutUs = async (data) => {
    return await createNewAboutUs(data);
  };

  static getActiveAbout = async (query) => {
    return await db.AboutUs.findOne({
      where: { is_active: "1" },
      attributes: [
        "id",
        "name",
        "address",
        "address_link",
        "phone_number",
        "email",
        "logo",
        "image",
        "is_active",
        "updatedAt",
        "markdown_id",
        "createdAt",
        // [sequelize.literal("markdown_data.contentHTML"), "contentHTML"],
        // [sequelize.literal("markdown_data.contentMarkdown"), "contentMarkdown"],
      ],
      include: [{ model: db.Markdowns, as: "markdown_data", attributes: [] }],
      order: [["createdAt", "DESC"]],
    });
  };
}

module.exports = AboutUsService;
