'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    console.log('首页', this.ctx.user);
    this.ctx.body = {
      status: 200,
      message: '首页',
    };
  }
}

module.exports = HomeController;
