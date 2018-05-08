'use strict';

const Controller = require('egg').Controller;

class NotAuthorized extends Controller {
  async index() {
    this.ctx.body = {
      status: 10001,
      message: '请输入账号密码',
    };
  }
}

module.exports = NotAuthorized;
