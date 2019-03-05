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
    const result = await ctx.service.authRole.show({
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

    // console.log(ctx.params);
    // console.log(ctx.query);

    const whereData = Object.assign({}, this.filterIndexWhereData(ctx.request.body), {
      status: 1,
    }); // 搜索关键词
    const pageSize = Number(ctx.request.body.pageSize) || 10; // 第几页
    const pageCurrent = Number(ctx.request.body.pageCurrent - 1) * Number(ctx.request.body.pageSize) || 0; // 每页几个

    console.log('pageCurrent', pageCurrent);
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

    // 时间输出有点问题，进行格式化
    const listFormat = list.map((item)=>{
      return {
        ...item,
        updated_time: moment(item.updated_time).format('YYYY-MM-DD hh:mm:ss'),
        created_time: moment(item.created_time).format('YYYY-MM-DD hh:mm:ss'),
      };
    });

    if (list) {
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
    console.log('result', result);
    console.log('ctx.request.body.name', ctx.request.body.name);
    if (result && result.name === ctx.request.body.name) {
      ctx.body = {
        status: 201,
        message: '角色名已存在，请使用其他角色名',
      };
    } else {
      const id = await ctx.service.authRole.create(ctx.request.body);
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
    const result = await ctx.service.authRole.update(Object.assign({ id }, ctx.request.body));

    console.log('result', result);

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
  async delete() {
    const { ctx } = this;
    // const id = ctx.params.id;
    const id = ctx.request.body.id;

    const result = await ctx.service.authRole.delete({
      id,
    });

    console.log('result', result)

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


  // 权限列表
  async setAccessList() {
    const { ctx } = this;

    // 列表搜索数据
    const listData = {
      columns: [
        'id',
        'name',
        'pid',
        'status',
        'url',
        // 'email',
        // 'is_admin',
        // 'status',
        // 'updated_time',
        // 'created_time',
        // 'username',
      ],
    };
    const list = await ctx.service.role.setAccessList(listData); // 列表
    const userAccessList = await this.app.mysql.select('role_access', {
      where: {
        // role_id: ctx.query.role_id,
        role_id: ctx.request.body.role_id,
      },
    });
    const listFormat = list.map((item)=>{
      return {
        ...item,
        // updated_time: moment(item.updated_time).format('YYYY-MM-DD hh:mm:ss'),
        // created_time: moment(item.created_time).format('YYYY-MM-DD hh:mm:ss'),
      };
    });

    console.log('userAccessList', userAccessList);
    if (list) {
      ctx.body = {
        status: 200,
        message: '获取列表',
        data: {
          list: listFormat,
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

    console.log('ctx.request.body', ctx.request.body);


    const result = await this.app.mysql.delete('role_access', {
      role_id: ctx.request.body[0].role_id,
    });

    const list = await ctx.service.role.setAccess(ctx.request.body); // 列表


    if (list) {
      ctx.body = {
        status: 200,
        message: '权限设置成功',
        data: {
          list: list,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '权限不存在',
      };
    }

    // ctx.body = {
    //   status: 200,
    //   message: '角色不存在',
    //   data : ctx.request.body,
    // }
  }

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
}

module.exports = TopicsController;