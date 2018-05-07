'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      status: 200,
    };
  }
}

module.exports = HomeController;
