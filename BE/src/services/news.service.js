("use strict");
import {
    createNewsRepo,
    updateNewsRepo
} from "../models/repository/news.repo";
import db, { sequelize } from "../models";
import { BadRequestError } from "../core/error.response";
const { Op } = require("sequelize");

class NewsService {
  static UpdateNews = async (payload) => {
    return await updateNewsRepo(payload);
  };

  static deleteNews = async (news_id) => {
    return await db.News.destroy({
      where: {
        id: news_id,
      },
    });
  };

  static searchNews = async (query) => {
    const page = +query.page || 1;
    const limit = query.limit ? +query.limit : null;
    const valueSearch = query.name;

    const queryWhere = {
      [Op.or]: [{ name: { [Op.like]: `%${valueSearch}%` } }],
    };

    const queryOptions = {
      where: {
        ...queryWhere,
      },
      attributes: [
        "id",
        "name",
        "image",
        "id",
        "markdown_id",
        "name",
        "createdAt",
        "updatedAt",
        // [sequelize.literal("Markdown_data.contentHTML"), "contentHTML"],
        // [sequelize.literal("Markdown_data.contentMarkdown"), "contentMarkdown"],
      ],
      offset: (page - 1) * limit,
      include: [
        { model: db.Markdowns, as: "Markdown_data", attributes: [] },
      ],
      order: [["createdAt", "DESC"]],
    };

    if (limit !== null) {
      queryOptions.limit = limit;
    }

    return await db.News.findAndCountAll(queryOptions);
  };

  static getNewsById = async (id) => {
    return await db.News.findOne({
      where: {id: id},
      attributes: [
        "id",
        "name",
        "image",
        "id",
        "markdown_id",
        "name",
        "createdAt",
        "updatedAt",
        [sequelize.literal("Markdown_data.contentHTML"), "contentHTML"],
        [sequelize.literal("Markdown_data.contentMarkdown"), "contentMarkdown"],
      ],
      include: [
        { model: db.Markdowns, as: "Markdown_data", attributes: [] },
      ],
    });
  }

  static createNews = async (data) => {
    return await createNewsRepo(data);
  };
}

module.exports = NewsService;
