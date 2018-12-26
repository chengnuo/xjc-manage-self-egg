'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

function fn(data, pid) {
  let result = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].pid == pid) {
      let obj = {
        ...data[i],
        name: data[i].name,
        id: data[i].id,
      };
      temp = fn(data, data[i].id);

      console.log('temp', temp)

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
   * 需求：权限菜单-列表
   * 版本号：v1.0.0
   */
  async list() {
    const { ctx } = this;
    const list = await this.app.mysql.select('access', {
      where: {
        status: 1, // 是否可用
      },
      columns: [ 'id', 'pid', 'name', 'path' ],
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
  /**
   * 需求：权限菜单-新增
   * 1，判断名字是否存在。
   * 2，判断pid是否存在。
   * 3，新增
   */
  async create() {
    const { ctx } = this;

    if (!ctx.request.body.name) {
      ctx.body = {
        status: 501,
        message: '请输入菜单名称',
      };
      return false;
    }
    if (!ctx.request.body.pid && ctx.request.body.pid !=0) {
      ctx.body = {
        status: 501,
        message: 'pid不存在',
      };
      return false;
    }

    const list = await this.app.mysql.get('access', {
      status: 1, // 是否可用
      name: ctx.request.body.name,
    });
    if (list) {
      ctx.body = {
        status: 501,
        message: '菜单名称已经存在，请重新选择菜单名称',
      };
    } else {
      const result = await this.app.mysql.insert('access', {
        name: ctx.request.body.name,
        path: ctx.request.body.path,
        pid: ctx.request.body.pid,
      });
      if (result) {
        ctx.body = {
          status: 200,
          message: '菜单-新增成功',
        };
      } else {
        ctx.body = {
          status: 501,
          message: '数据库错误',
        };
      }

    }
  }
  /**
   * 需求：权限菜单-编辑菜单
   * 版本号：v1.0.0
   */
  async update() {
    const { ctx } = this;

    if (!ctx.request.body.id) {
      ctx.body = {
        status: 501,
        message: 'id不存在',
      };
      return false;
    }

    if (!ctx.request.body.name) {
      ctx.body = {
        status: 501,
        message: '菜单名称不存在',
      };
      return false;
    }

    const list = await this.app.mysql.update('access', {
      name: ctx.request.body.name,
      path: ctx.request.body.path,
      id: ctx.request.body.id,
    });

    if (list.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '更新成功',
      };
    } else {
      ctx.body = {
        status: 501,
        message: '数据库错误',
      };
    }
  }

  /**
   * 需求：权限菜单-删除菜单
   * 版本号：v1.0.0
   * 逻辑删除
   * 1，判断id是不是存在，存在让status变成0
   */
  async delete() {
    const { ctx } = this;

    if (!ctx.request.body.id) {
      ctx.body = {
        status: 501,
        message: 'id不存在',
      };
      return false;
    }
    const list = await this.app.mysql.update('access', {
      status: 0, // 是否可用
      id: ctx.request.body.id,
    });

    if (list.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '删除成功',
      };
    } else {
      ctx.body = {
        status: 501,
        message: '数据库错误',
      };
    }


  }

}

module.exports = TestController;