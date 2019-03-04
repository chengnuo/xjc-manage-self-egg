/**
 * Method	Path	Route Name	Controller.Action
 * GET	/posts	posts	app.controllers.posts.index
 * GET	/posts/new	new_post	app.controllers.posts.new
 * GET	/posts/:id	post	app.controllers.posts.show
 * GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
 * POST	/posts	posts	app.controllers.posts.create
 * PUT	/posts/:id	post	app.controllers.posts.update
 * DELETE	/posts/:id	post	app.controllers.posts.destroy
 */
'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class TopicsController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  // 详情
  async show() {
    const { ctx } = this;
    const result = await ctx.service.role.show({
      id: ctx.params.id,
    });

    if (result) {
      ctx.body = {
        status: 200,
        message: '角色-详情',
        data: result,
      };
    } else {
      ctx.body = {
        status: 500,
        message: '角色-详情不存在',
      };
    }
  }
  // 列表
  async index() {
    const { ctx } = this;
    const whereData = ctx.helper.filterIndexWhereData(ctx.query); // 搜索关键词
    const pageSize = Number(ctx.query.pageSize) || 10; // 第几页
    const pageCurrent = Number(ctx.query.pageCurrent - 1) * Number(ctx.query.pageSize) || 0; // 每页几个
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
      limit: pageSize, // 返回数据量
      offset: pageCurrent, // 数据偏移量
      where: whereData,
    };
    const list = await ctx.service.role.list(listData); // 列表
    const total = await ctx.service.role.total(whereData); // 条数

    console.log('list', list);

    if (list) {
      const listFormat = list.map((item)=>{
        return {
          ...item,
          updated_time: moment(item.updated_time).format('YYYY-MM-DD hh:mm:ss'),
          created_time: moment(item.created_time).format('YYYY-MM-DD hh:mm:ss'),
        };
      });
      ctx.body = {
        status: 200,
        message: '获取列表',
        data: {
          list: listFormat,
          total,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '角色-列表不存在',
      };
    }


  }

  // 新增
  async create() {
    const { ctx } = this;
    const result = await this.app.mysql.get('role', { name: ctx.request.body.name });
    if (result && result.name === ctx.request.body.name) {
      ctx.body = {
        status: 201,
        message: '角色名已存在，请使用其他角色名',
      };
    } else {
      const id = await ctx.service.role.create(ctx.request.body);
      ctx.body = {
        status: 200,
        message: '角色-新增',
        data: id,
      };
    }
  }

  // 更新
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await ctx.service.role.update(Object.assign({ id }, ctx.request.body));
    if (result.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '角色-编辑成功',
        data: {
          id,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '角色-编辑失败',
      };
    }

  }

  // 删除
  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await ctx.service.role.destroy({
      id,
    });
    if (result.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '角色-删除成功',
        data: {
          id,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '角色-删除失败',
      };
    }
  }

  // 批量删除
  async delete() {
    const { ctx } = this;
    ctx.body = {
      status: 200,
      message: '批量删除',
    };
  }


  // 权限列表
  async setAccessList() {
    const { ctx } = this;
    // 列表搜索数据
    const listData = {
      columns: [
        'id',
        'title',
        'urls',
        'status',
        // 'email',
        // 'is_admin',
        // 'status',
        'updated_time',
        'created_time',
        // 'username',
      ],
    };
    const list = await ctx.service.role.setAccessList(listData); // 列表
    const userAccessList = await this.app.mysql.select('role_access', {
      where: {
        role_id: ctx.query.role_id,
      },
    });
    if (list) {
      ctx.body = {
        status: 200,
        message: '获取列表',
        data: {
          list,
          userAccessList,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '权限-列表不存在',
      };
    }
  }
  // 设置权限
  async setAccess() {
    const { ctx } = this;
    const result = await this.app.mysql.delete('role_access', {
      role_id: ctx.request.body[0].role_id,
    });

    const list = await ctx.service.role.setAccess(ctx.request.body); // 列表
    if (list) {
      ctx.body = {
        status: 200,
        message: '权限设置成功',
        data: {
          list,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '权限不存在',
      };
    }
  }
}

module.exports = TopicsController;