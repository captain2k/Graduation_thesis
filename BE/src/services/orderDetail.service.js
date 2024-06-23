("use strict");
import { BadRequestError, ForbiddenError } from "../core/error.response";
import db, { sequelize } from "../models";
import { createNewOrderDetail } from "../models/repository/orderDetail.repo";
import { ORDER_STATUS } from "./../constants/index";
const { Op } = require("sequelize");
import moment from "moment";

class OrderService {
  static deleteOrderDetail = async (orderId) => {
    return await db.OrderDetail.destroy({
      where: {
        id: orderId,
      },
    });
  };

  static getOrderDetailById = async (query) => {
    if (!query.user_id || !query.id) {
      throw new BadRequestError("user_id and id is not empty!");
    }
    const order = await db.Orders.findByPk(query.id);
    if (+order.user_id !== +query.user_id) {
      throw new ForbiddenError("User don't have a permission!");
    }
    
    const orderDetail = await db.OrderDetail.findAll({
      where: {
        order_id: query.id,
      },
      include: [{ model: db.Products, as: "product_data" }],
    });
    
    return orderDetail;
  };

  static createOrderDetail = async (data) => {
    return await createNewOrderDetail(data);
  };

  static getOrderDetailExcludePending = async (query, user_id) => {
    const offset = +query.page || 1;
    const limit = query?.limit ? +query.limit : null;

    let querySql = `SELECT 
      O.*, 
      Od.*, 
      JSON_OBJECT(
        'id', P.id, 
        'name', P.name, 
        'description', P.description,
        'price', P.price,
        'images', P.images,
        'updatedAt', P.updatedAt
      ) AS product_data
      FROM Orders AS O 
      INNER JOIN Order_detail AS Od ON O.id = Od.order_id
      INNER JOIN Products AS P ON Od.productId = P.id
      WHERE O.order_status = '${ORDER_STATUS.DELIVERED}'
      AND O.user_id = ${user_id}`;

    if (limit) {
      querySql += ` LIMIT ${limit}`;
    }

    if (offset && limit) {
      querySql += ` OFFSET ${offset}`;
    }

    const listOrderDetail = await sequelize
      .query(querySql, { type: sequelize.QueryTypes.SELECT })
      .then((results) => {
        return results;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return listOrderDetail;
  };

  static updateOrderDetail = async (data) => {
    if (!data?.id || !data.evaluate_id) {
      throw new BadRequestError("id and evaluate_id  is required!");
    }

    return await db.OrderDetail.update(
      { evaluate_id: data.evaluate_id },
      {
        where: {
          id: data.id,
        },
      }
    );
  };

  static getOrderDetailToStatistical = async (query) => {
    if (!query.date_from || !query.date_to) {
      throw new BadRequestError("date_form and date_to is required!");
    }

    const dateFrom = moment(query.date_from);
    const dateTo = moment(query.date_to);

    const months = [];
    let currentMonth = dateFrom.clone();

    while (currentMonth.isSameOrBefore(dateTo)) {
      months.push({
        statistical_year: currentMonth.year(),
        statistical_month: currentMonth.format('YYYY-MM'),
        statistical_count: 0,
      });
      currentMonth.add(1, "month");
    }

    if (dateFrom.isSameOrAfter(dateTo)) {
      throw new BadRequestError("date_form can't not be larger than date to!");
    }

    const statistical_product = await db.OrderDetail.findAll({
      attributes: [
        "productId",
        [sequelize.literal("product_data.name"), "product_name"],
        [sequelize.literal("product_data.price"), "product_price"],
        [sequelize.fn("COUNT", "*"), "statistical_count"],
      ],
      where: {
        createdAt: {
          [Op.and]: [{ [Op.gte]: query.date_from }, { [Op.lt]: query.date_to }],
        },
      },
      group: ["productId"],
      include: [
        {
          model: db.Orders,
          as: "order_detail",
          attributes: [],
          where: {
            order_status: "delivered",
          },
        },
        {
          model: db.Products,
          as: "product_data",
          attributes: [],
        },
      ],
      order: [["productId", "ASC"]],
    });

    console.log("check order detail::::::::::::::::::::::")

    let statistical_order = await db.OrderDetail.findAll({
      attributes: [
        [
          sequelize.fn("YEAR", sequelize.col("OrderDetail.createdAt")),
          "statistical_year",
        ],
        [
          sequelize.literal(`DATE_FORMAT(OrderDetail.createdAt, '%Y-%m')`),
          "statistical_month",
        ],
        [sequelize.fn("COUNT", "*"), "statistical_count"],
      ],
      where: {
        createdAt: {
          [Op.and]: [{ [Op.gte]: query.date_from }, { [Op.lt]: query.date_to }],
        },
      },
      group: [
        sequelize.fn("YEAR", sequelize.col("createdAt")),
        sequelize.literal(`DATE_FORMAT(OrderDetail.createdAt, '%Y-%m')`),
      ],
      include: [
        {
          model: db.Orders,
          as: "order_detail",
          attributes: [],
          where: {
            order_status: "delivered",
          },
        },
      ],
      order: [
        ["statistical_year", "ASC"],
        ["statistical_month", "ASC"],
      ],
      raw: true,
    });

    console.log('qua ko::::::::::::::::::::::::')

    statistical_order = months.map((item) => {
      const orderItem = statistical_order.find((order) => {
       
        return order.statistical_month === item.statistical_month
      })

      if(orderItem) {
        item.statistical_count = orderItem.statistical_count;
      }

      return item;
    })
   
    return {
      statistical_order: statistical_order,
      statistical_product: statistical_product,
    };
  };
}

module.exports = OrderService;
