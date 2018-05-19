'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    this.ctx.body = {
      status: 200,
      message: '用户模块',
    };
  }
}

module.exports = UserController;
