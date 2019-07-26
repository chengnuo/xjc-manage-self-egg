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

class TopicsController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {
      accesstoken: 'string',
      title: 'string',
      tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
      content: 'string',
    };
  }

  // 详情
  async show() {
    const { ctx } = this;
    const result = await ctx.service.plan.show({
      id: ctx.params.id,
    });

    if (result) {
      ctx.body = {
        status: 200,
        message: '计划-详情',
        data: result,
      };
    } else {
      ctx.body = {
        status: 500,
        message: '计划-详情不存在',
      };
    }
  }
  // 列表
  async index() {
    const { ctx } = this;

    // console.log(ctx.params);
    // console.log(ctx.query);

    const whereData = ctx.helper.filterIndexWhereData(Object.assign({}, ctx.query, {
      // uid: ctx.session.user.id, // 从sesstion 里面获取 TODO:
    })); // 搜索关键词

    console.log('whereData', whereData);

    const pageSize = Number(ctx.query.pageSize) || 10; // 第几页
    const pageCurrent = Number(ctx.query.pageCurrent - 1) * Number(ctx.query.pageSize) || 0; // 每页几个

    console.log('pageSize', pageSize);
    console.log('pageCurrent', pageCurrent);
    console.log('whereData', whereData)
    console.log('ctx', ctx)
    // 列表搜索数据
    const listData = {
      columns: [
        'id',
        'type_id',
        'title',
        'avatar',
        'description',
        'url',
      ],
      limit: pageSize, // 返回数据量
      offset: pageCurrent, // 数据偏移量
      where: whereData,
    };
    const list = await ctx.service.plan.list(whereData, pageCurrent, pageSize); // 列表
    const total = await ctx.service.plan.total(whereData); // 条数

    // console.log('list', list);

    if (list) {
      ctx.body = {
        status: 200,
        message: '获取列表',
        data: {
          list,
          total,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '计划-列表不存在',
      };
    }


  }

  // 新增
  async create() {
    const { ctx } = this;
    const result = await this.app.mysql.get('plan', { title: ctx.request.body.title });
    if (result && result.title === ctx.request.body.title) {
      ctx.body = {
        status: 201,
        message: '计划标题已存在，请使用其他计划标题',
      };
    } else {
      const id = await ctx.service.plan.create(Object.assign({}, ctx.request.body, {
        // uid: ctx.session.user.id, // 从sesstion 里面获取
        plan_state_id: ctx.request.body.plan_state_id,
      }));
      ctx.body = {
        status: 200,
        message: '计划-新增',
        data: id,
      };
    }
  }

  // 更新
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await ctx.service.plan.update(Object.assign({ id }, ctx.request.body));

    console.log('result', result);

    if (result.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '计划-编辑成功',
        data: {
          id,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '计划-编辑失败',
      };
    }

  }

  // 删除
  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await ctx.service.plan.destroy({
      id,
    });
    if (result.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '计划-删除成功',
        data: {
          id,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '计划-删除失败',
      };
    }
  }
}

module.exports = TopicsController;
