'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class TestController extends Controller {
  /**
   * 需求：用户-列表
   * 版本号：v1.0.0
   */
  async list() {
    const { ctx } = this;
    const list = await this.app.mysql.select('user', {
      where: {
        status: 1, // 是否可用
      },
      columns: [
        'id',
        'name',
        'email',
        'is_admin',
        'status',
        'updated_time',
        'created_time',
        'username',
      ],
    });

    ctx.body = {
      status: 200,
      message: '用户-列表',
      data: {
        list: list,
      },
    };
  }
  /**
   * 需求：用户-新增
   * 1，判断名字是否存在。
   * 2，判断pid是否存在。
   * 3，新增
   */
  async create() {
    const { ctx } = this;

    if (!ctx.request.body.username) {
      ctx.body = {
        status: 501,
        message: '请输入用户名称',
      };
      return false;
    }
    if (!ctx.request.body.password) {
      ctx.body = {
        status: 501,
        message: '请输入用户密码',
      };
      return false;
    }
    const list = await this.app.mysql.get('user', {
      status: 1, // 是否可用
      username: ctx.request.body.username,
    });
    if (list) {
      ctx.body = {
        status: 501,
        message: '用户名称已经存在，请重新选择用户名称',
      };
    } else {
      const result = await this.app.mysql.insert('user', {
        ...ctx.request.body,
      });
      if (result) {
        ctx.body = {
          status: 200,
          message: '用户-新增成功',
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
   * 需求：用户-编辑用户
   * 版本号：v1.0.0
   */
  async update() {
    const { ctx } = this;

    if (!ctx.request.body.id) {
      ctx.body = {
        status: 501,
        message: '用户-id不存在',
      };
      return false;
    }

    const list = await this.app.mysql.update('user', {
      ...ctx.request.body,
    });

    if (list.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '用户-更新成功',
      };
    } else {
      ctx.body = {
        status: 501,
        message: '数据库错误',
      };
    }
  }

  /**
   * 需求：用户-删除用户
   * 版本号：v1.0.0
   * 逻辑删除
   * 1，判断id是不是存在，存在让status变成0
   */
  async delete() {
    const { ctx } = this;

    if (!ctx.request.body.id) {
      ctx.body = {
        status: 501,
        message: '用户-id不存在',
      };
      return false;
    }
    const list = await this.app.mysql.update('user', {
      status: 0, // 是否可用
      id: ctx.request.body.id,
    });

    if (list.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '用户-删除成功',
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