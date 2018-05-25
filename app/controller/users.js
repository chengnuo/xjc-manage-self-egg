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
    const result = await ctx.service.users.show({
      id: ctx.params.id,
    });
    ctx.body = {
      status: 200,
      message: '用户-详情',
      data: result,
    };
  }

  // 列表
  async index() {
    const { ctx } = this;
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

  // 新增
  async create() {
    const { ctx } = this;
    const result = await this.app.mysql.get('user', { username: ctx.request.body.username });
    console.log('result',result)
    if (result && result.username === ctx.request.body.username) {
      ctx.body = {
        status: 201,
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

  // 更新
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result =  await ctx.service.users.update(Object.assign({ id }, ctx.request.body));

    console.log('result',result)

    if(result.affectedRows === 1){
      ctx.body = {
        status: 200,
        message: '用户-编辑成功',
        data: {
          id: id,
        },
      };
    }else{
      ctx.body = {
        status: 201,
        message: '用户-编辑失败',
      };
    }

  }

  // 删除
  async destroy(){
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await ctx.service.users.destroy({
      id,
    });
    if(result.affectedRows === 1){
      ctx.body = {
        status: 200,
        message: '用户-删除成功',
        data: {
          id,
        },
      };
    }else{
      ctx.body = {
        status: 201,
        message: '用户-删除失败',
      };
    }
  }
}

module.exports = TopicsController;
