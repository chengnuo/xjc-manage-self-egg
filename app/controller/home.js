'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      status: 200,
      message: '首页',
    };
  }
}

module.exports = HomeController;
