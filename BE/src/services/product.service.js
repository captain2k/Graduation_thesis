("use strict");
import {
  createNewProduct,
  updateProduct,
} from "../models/repository/product.repo";
import db, { sequelize } from "../models";
import { BadRequestError } from "../core/error.response";
const { Op } = require("sequelize");

class ProductService {
  static UpdateProduct = async (payload) => {
    return await updateProduct(payload);
  };

  static deleteProduct = async (ProductId) => {
    return await db.Products.destroy({
      where: {
        id: ProductId,
      },
    });
  };

  static searchProduct = async (query) => {
    const page = +query.page || 1;
    const limit = query.limit ? +query.limit : null;
    const valueSearch = query.name;

    
    const queryWhere = {
      [Op.or]: [{ name: { [Op.like]: `%${valueSearch}%` } }],
    };
    
    if (query.category_id) {
      queryWhere.category_id = query.category_id;
    }
    
    if (query.minPrice && query.maxPrice) {
      queryWhere.price = {
        [Op.between]: [query.minPrice, query.maxPrice],
      };
    }

    console.log(`sequelize.literal("category_data.name"), "category_name">>>>>`, sequelize.literal("markdown_data.contentHTML"), "category_name");

    const queryOptions = {
      where: {
        ...queryWhere,
      },
      attributes: [
        "category_id",
        "createdAt",
        "description",
        "id",
        "images",
        "name",
        "price",
        "stock_quantity",
        "updatedAt",
        "markdown_id",
        [sequelize.literal("category_data.name"), "category_name"],
        // [sequelize.literal("markdown_data.contentHTML"), "contenthtml"],
        // [sequelize.literal("markdown_data.contentMarkdown"), "contentMarkdown"],
      ],
      offset: (page - 1) * limit,
      include: [
        { model: db.Categories, as: "category_data", attributes: [] },
        { model: db.Markdowns, as: "markdown_data", attributes: [] },
      ],
    };


    if (limit !== null) {
      queryOptions.limit = limit;
    }

    const res = await db.Products.findAndCountAll(queryOptions);
    return res
  };

  static createProduct = async (data) => {
    return await createNewProduct(data);
  };

  static getTopProduct = async ({ top = 3 }) => {
    //get all product has top category_id
    const categories = await db.Products.findAll({
      attributes: [
        "category_id",
        [sequelize.fn("COUNT", sequelize.col("*")), "total"],
        [sequelize.literal("category_data.name"), "category_name"],
      ],
      include: [{ model: db.Categories, as: "category_data", attributes: [] }],
      raw: true,
      group: ["category_id"],
      order: [[sequelize.literal("total"), "DESC"]],
      limit: top,
    }).then(async (category) => {
      const idTop = category.map((category) => category.category_id);
      const productInTop = await db.Products.findAll({
        where: {
          category_id: {
            [Op.in]: idTop,
          },
        },
        raw: true,
      });

      const initialValue = Array.from(new Array(top)).reduce(
        (current, next, index) => {
          const productTop = category[index]
            ? { ...category[index], data: [] }
            : { category_id: null, total: 0, category_name: null, data: [] };
          current[`top${index + 1}`] = productTop;

          return current;
        },
        {}
      );

      const orderProduct = productInTop.reduce((current, next) => {
        for (const property in initialValue) {
          if (next.category_id === initialValue[property].category_id) {
            current[property].data.push(next);

            return current;
          }
        }
        return current;
      }, initialValue);

      return orderProduct;
    });

    return categories;
  };

  static getRangePrice = async ({}) => {
    const minPrice = await db.Products.min("price");
    const maxPrice = await db.Products.max("price");

    return {
      minPrice,
      maxPrice,
    };
  };

  static getProductById = async (id) => {
    return await db.Products.findOne({
      where: { id: id },
      attributes: [
        "category_id",
        "createdAt",
        "description",
        "id",
        "images",
        "name",
        "price",
        "stock_quantity",
        "updatedAt",
        "markdown_id",
        [sequelize.literal("category_data.name"), "category_name"],
        // [sequelize.literal("markdown_data.contentHTML"), "contentHTML"],
        // [sequelize.literal("markdown_data.contentMarkdown"), "contentMarkdown"],
      ],
      include: [
        { model: db.Categories, as: "category_data", attributes: [] },
        { model: db.Markdowns, as: "markdown_data", attributes: [] },
      ],
    });
  };

  static getListProductDifferent = async (query) => {
    const page = +query.page || 1;
    const limit = query.limit ? +query.limit : null;

    
    if (!query.id || !query.category_id) {
      throw new BadRequestError("id and category_id is required!");
    }

    const queryWhere = {
      id: {
        [Op.not]: query.id, // Loại trừ sản phẩm có ID cụ thể
      },
      category_id: query.category_id,
    };

    const queryOptions = {
      where: {
        ...queryWhere,
      },
      attributes: [
        "category_id",
        "createdAt",
        "description",
        "id",
        "images",
        "name",
        "price",
        "stock_quantity",
        "updatedAt",
        [sequelize.literal("category_data.name"), "category_name"],
      ],
      offset: (page - 1) * limit,
      include: [{ model: db.Categories, as: "category_data", attributes: [] }],
      order: [["createdAt", "DESC"]],
    };

    if (limit !== null) {
      queryOptions.limit = limit;
    }

    return await db.Products.findAndCountAll(queryOptions);
  };
}

module.exports = ProductService;
