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
    const result = await ctx.service.blogs.show({
      id: ctx.params.id,
    });

    if (result) {
      ctx.body = {
        status: 200,
        message: '博客-详情',
        data: result,
      };
    } else {
      ctx.body = {
        status: 500,
        message: '博客-详情不存在',
      };
    }
  }
  // 列表
  async index() {
    const { ctx } = this;

    // console.log(ctx.params);
    // console.log(ctx.query);

    const whereData = this.filterIndexWhereData(ctx.query); // 搜索关键词
    const pageSize = Number(ctx.query.pageSize) || 10; // 第几页
    const pageCurrent = Number(ctx.query.pageCurrent - 1) * Number(ctx.query.pageSize) || 0; // 每页几个

    console.log('pageCurrent', pageCurrent);
    // 列表搜索数据
    const listData = {
      columns: [
        'id',
        'title',
        'content',
        'created_time',
      ],
      limit: pageSize, // 返回数据量
      offset: pageCurrent, // 数据偏移量
      where: whereData,
    };
    const list = await ctx.service.blogs.list(listData); // 列表
    const total = await ctx.service.blogs.total(whereData); // 条数

    console.log('list', list);

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
        message: '博客-列表不存在',
      };
    }


  }

  // 新增
  async create() {
    const { ctx } = this;
    const result = await this.app.mysql.get('user', { username: ctx.request.body.username });
    console.log('result', result);
    if (result && result.username === ctx.request.body.username) {
      ctx.body = {
        status: 201,
        message: '博客名已存在，请使用其他博客名',
      };
    } else {
      const id = await ctx.service.blogs.create(ctx.request.body);
      ctx.body = {
        status: 200,
        message: '博客-新增',
        data: id,
      };
    }
  }

  // 更新
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await ctx.service.blogs.update(Object.assign({ id }, ctx.request.body));

    console.log('result', result);

    if (result.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '博客-编辑成功',
        data: {
          id,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '博客-编辑失败',
      };
    }

  }

  // 删除
  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await ctx.service.blogs.destroy({
      id,
    });
    if (result.affectedRows === 1) {
      ctx.body = {
        status: 200,
        message: '博客-删除成功',
        data: {
          id,
        },
      };
    } else {
      ctx.body = {
        status: 201,
        message: '博客-删除失败',
      };
    }
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
