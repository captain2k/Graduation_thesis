'use strict'

const ProductService = require("../services/product.service");
const { OK, CREATED, SuccessResponse, UPDATED, DELETED } = require('../core/succes.response');

class ProductController {
    updateProduct = async (req, res, next) => {
        new UPDATED({
            message: 'update product success!',
            metadata: await ProductService.UpdateProduct(req.body),
        }).send(res)
    }

    deleteProduct = async (req, res, next) => {
        new DELETED({
            message: 'delete product success!',
            metadata: await ProductService.deleteProduct(req.params.id),
        }).send(res)
    }

    searchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'get product list success!',
            metadata: await ProductService.searchProduct(req.query),
            options: {
                ...req.query
            }
        }).send(res)
    }

    createNewProduct = async (req, res, next) => {
        new CREATED({
            message: 'create a new product success!',
            metadata: await ProductService.createProduct(req.body),
        }).send(res)
    }

    getTopProduct = async (req, res, next) => {
      console.log('req.body>>>>>>>>', req.body)
      

        new SuccessResponse({
            message: 'get top product success!',
            metadata: await ProductService.getTopProduct(req.query),
        }).send(res)
    }

    getRangePrice = async (req, res, next) => {
        new SuccessResponse({
            message: 'get range price of product success!',
            metadata: await ProductService.getRangePrice(req.query),
        }).send(res)
    }

    getProductById = async (req, res, next) => {
        new SuccessResponse({
            message: 'get product success!',
            metadata: await ProductService.getProductById(req.params.id),
        }).send(res)
    }

    listDifferent = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list product success!',
            metadata: await ProductService.getListProductDifferent(req.query),
            options: {
                ...req.query
            }
        }).send(res)
    }
}

module.exports = new ProductController