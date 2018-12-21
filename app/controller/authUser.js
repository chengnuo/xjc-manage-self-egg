'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class TestController extends Controller {
  filterIndexWhereData(ctxQuery) {
    const whereData = {};
    let i = 0;
    for (i in ctxQuery) {
      if (i === 'pageCurrent') {
        continue;
      } else if (i === 'pageSize') {
        continue;
      } else {
        whereData[i] = ctxQuery[i];
      }
    }
    return whereData;
  }
  /**
   * 需求：用户-列表
   * 版本号：v1.0.0
   */
  async list() {
    const { ctx } = this;

    const whereData = this.filterIndexWhereData(ctx.request.body); // 搜索关键词
    const pageSize = Number(ctx.request.body.pageSize) || 10; // 第几页
    const pageCurrent = Number(ctx.request.body.pageCurrent - 1) * Number(ctx.request.body.pageSize) || 0; // 每页几个


    console.log('pageSize', pageSize)

    // const list = await this.app.mysql.select('user', {
    //   where: {
    //     ...whereData,
    //     status: 1, // 是否可用
    //   },
    //   columns: [
    //     'id',
    //     'name',
    //     'email',
    //     'is_admin',
    //     'status',
    //     'updated_time',
    //     'created_time',
    //     'username',
    //   ],
    //   limit: pageSize, // 返回数据量
    //   offset: pageCurrent, // 数据偏移量
    // });


    // const total = await this.app.mysql.count('user', whereData);
    const list = await ctx.service.authUser.list(whereData);
    const total = await ctx.service.authUser.total(whereData);


    console.log('total', total)

    // 时间输出有点问题，进行格式化
    const listFormat = list.map((item)=>{
      return {
        ...item,
        updated_time: moment(item.updated_time).format('YYYY-MM-DD hh:mm:ss'),
        created_time: moment(item.created_time).format('YYYY-MM-DD hh:mm:ss'),
      };
    });
    ctx.body = {
      status: 200,
      message: '用户-列表',
      data: {
        list: listFormat,
        total: total,
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


  // 角色列表
  async setRolesList() {
    const { ctx } = this;

    // 列表搜索数据
    const listData = {
      columns: [
        'id',
        'name',
        'status',
        // 'email',
        // 'is_admin',
        // 'status',
        'updated_time',
        'created_time',
        // 'username',
      ],
    };
    const list = await ctx.service.users.setRolesList(listData); // 列表
    const userRoleList = await this.app.mysql.select('user_role', {
      where: {
        // uid: ctx.query.uid,
        uid: ctx.request.body.uid,
      },
    });

    console.log('userRoleList', userRoleList);
    if (list) {
      ctx.body = {
        status: 200,
        message: '获取列表',
        data: {
          list,
          userRoleList,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '角色-列表不存在',
      };
    }
  }
  // 设置角色
  async setRoles() {

    const { ctx } = this;

    console.log('ctx.request.body', ctx.request.body);


    const result = await this.app.mysql.delete('user_role', {
      uid: ctx.request.body[0].uid,
    });

    const list = await ctx.service.users.setRoles(ctx.request.body); // 列表
    if (list) {
      ctx.body = {
        status: 200,
        message: '角色设置成功',
        data: {
          list,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '角色不存在',
      };
    }
  }

}

module.exports = TestController;