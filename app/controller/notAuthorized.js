'use strict';

const Controller = require('egg').Controller;

class NotAuthorized extends Controller {
  async index() {
    this.ctx.body = {
      status: 401,
      message: '没有权限,请联系管理员',
    };
  }
}

module.exports = NotAuthorized;
