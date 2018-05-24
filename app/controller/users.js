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

  async show() {
    const { ctx } = this;

    ctx.body = await ctx.service.users.show({
      id: ctx.params.id,
      mdrender: ctx.query.mdrender !== 'false',
      accesstoken: ctx.query.accesstoken || '',
    });
  }

  async index() {
    const { ctx } = this;

    // ctx.validate({
    //   page: { type: 'string', format: /\d+/, required: false },
    //   tab: { type: 'enum', values: [ 'ask', 'share', 'job', 'good' ], required: false },
    //   limit: { type: 'string', format: /\d+/, required: false },
    // }, ctx.query);
    //
    // ctx.body = await ctx.service.users.list({
    //   page: ctx.query.page,
    //   tab: ctx.query.tab,
    //   limit: ctx.query.limit,
    //   mdrender: ctx.query.mdrender !== 'false',
    // });

    const result = await ctx.service.users.list({
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
      message: '获取列表',
      data: result,
    };

  }

  async create() {
    // const { ctx } = this;
    // ctx.validate(this.createRule);
    //
    // const id = await ctx.service.users.create(ctx.request.body);
    // ctx.body = {
    //   topic_id: id,
    // };
    // ctx.status = 201;


    const { ctx } = this;
    const result = await this.app.mysql.get('user', { username: ctx.request.body.username });
    if (result.username === ctx.request.body.username) {
      ctx.body = {
        status: 200,
        message: '用户名已存在，请使用其他用户名',
      };
    } else {
      const id = await ctx.service.users.create(ctx.request.body);
      ctx.body = {
        status: 200,
        message: '用户-新增',
        data: id,
      };
    }
  }

  async update() {
    const { ctx } = this;
    const id = ctx.params.id;

    ctx.validate(this.createRule);
    await ctx.service.users.update(Object.assign({ id }, ctx.request.body));
    ctx.status = 204;
  }
}

module.exports = TopicsController;
