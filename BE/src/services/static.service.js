("use strict");
import db from "../models";
import {
    createNewStatic,
} from "../models/repository/static.repo";
import {
  getTopProductById
} from '../models/repository/product.repo';
import { BadRequestError } from "../core/error.response";
const { Op } = require("sequelize");


class CategoryService {
  static setStatic = async (data) => {
    return await createNewStatic(data);
  };

  static getStatic = async ({type}) => {
    const optionQuery = {
      where: {},
      raw: true,
      attributes: { exclude: ["createdAt", 'updatedAt'] },
    }

    if(type) {
      optionQuery.where.type =  type;
    }
    
    const res = await db.Static.findAll();
    console.log('res>>>>>>', res);


    return res
  }

  static getStaticPage = async (payload) => {
    if(!payload.type) {
      throw new BadRequestError('Type is required!')
    }

    const staticPg = await CategoryService.getStatic(payload).then(async (response) => {
      console.log('response>>>>>', response);
      const [ static_page ] = response;
      if(!static_page) {
        return {
          type: payload.type,
          Images: null,
          ImageSP: null,
          productShow: {
            top1: {
              category_name: '',
              data: [],
            },
            top2: {
              category_name: '',
              data: [],
            },
            top3: {
              category_name: '',
              data: [],
            }
          }
        }
      }

      const { productShow } = static_page;

      const ids = productShow ? JSON.parse(productShow) : [];
      const limitProduct = payload.limitProduct ? payload.limitProduct : 8;
  
      const productEnabled = await getTopProductById({ids: ids, limitProduct: limitProduct})
      return {
        ...static_page,
        productShow: productEnabled,
      };
    });


    return staticPg;
  }
}

module.exports = CategoryService;
