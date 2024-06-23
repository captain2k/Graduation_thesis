'use strict'

const StaticService = require("../services/static.service");
const { OK, CREATED, SuccessResponse, UPDATED, DELETED } = require('../core/succes.response');

class StaticController {
    setStatic = async (req, res, next) => {
        new SuccessResponse({
            message: 'set static success!',
            metadata: await StaticService.setStatic(req.body),
        }).send(res)
    }

    getStatic = async (req, res, next) => {
        new SuccessResponse({
            message: 'get static success!',
            metadata: await StaticService.getStatic(req.body),
        }).send(res)
    }

    getStaticPage = async (req, res, next) => {
        new SuccessResponse({
            message: 'get static page success!',
            metadata: await StaticService.getStaticPage(req.query),
        }).send(res)
    }
}

module.exports = new StaticController