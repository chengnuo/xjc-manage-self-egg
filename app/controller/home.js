'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    console.log('首页', this.ctx.user);
    if (this.ctx.user.message) {
      this.ctx.body = this.ctx.user;
    } else {
      this.ctx.body = {
        status: 200,
        message: '首页',
      };
    }
  }
}

module.exports = HomeController;
