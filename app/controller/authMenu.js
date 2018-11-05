'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

function fn(data, pid) {
  var result = [], temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].pid == pid) {
      var obj = {
        name: data[i].cate_name,
        id: data[i].id
      };
      temp = fn(data, data[i].id);
      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}


class TestController extends Controller {
  /**
   * 需求：权限菜单
   * 版本号：v1.0.0
   */
  async list() {
    const { ctx } = this;

    const list = await this.app.mysql.select('deep_cate', {
      // where: {
      //   pid: 0,
      // },
      columns: [ 'id', 'pid', 'cate_name' ],
    });


    let fnList = fn(list, 0)

    ctx.body = {
      status: 200,
      message: '权限菜单',
      data: {
        list: list,
        fnList,
      },
    };
  }
}

module.exports = TestController;