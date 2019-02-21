// app/controller/topics.js
/**
 * restful 风格
 * url https://eggjs.org/zh-cn/basics/router.html
 * Method	Path	Route Name	Controller.Action
 * GET	/posts	posts	app.controllers.posts.index
 * GET	/posts/new	new_post	app.controllers.posts.new
 * GET	/posts/:id	post	app.controllers.posts.show
 * GET	/posts/:id/edit	edit_post	app.controllers.posts.edit
 * POST	/posts	posts	app.controllers.posts.create
 * PUT	/posts/:id	post	app.controllers.posts.update
 * DELETE	/posts/:id	post	app.controllers.posts.destroy
 */
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  accesstoken: 'string',
  title: 'string',
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  content: 'string',
};

class TopicController extends Controller {

  // GET	/posts	posts
  async index() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'index',
      status: 200,
    };
  }

  // GET	/posts/new	new_post
  async new() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'new',
      status: 200,
    };
  }

  // GET	/posts/:id	post
  // async create() {
  //   const ctx = this.ctx;
  //   // 校验 `ctx.request.body` 是否符合我们预期的格式
  //   // 如果参数校验未通过，将会抛出一个 status = 422 的异常
  //   ctx.validate(createRule, ctx.request.body);
  //   // 调用 service 创建一个 topic
  //   const id = await ctx.service.topics.create(ctx.request.body);
  //   // 设置响应体和状态码
  //   ctx.body = {
  //     topic_id: id,
  //   };
  //   ctx.status = 201;
  // }
  async create() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'create',
      status: 200,
    };
  }

  // GET	/posts/:id/edit	edit_post
  async show() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'show',
      status: 200,
    };
  }

  // POST	/posts	posts
  async edit() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'edit',
      status: 200,
    };
  }

  // PUT	/posts/:id	post
  async update() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'update',
      status: 200,
    };
  }

  // DELETE	/posts/:id	post
  async destroy() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'destroy',
      status: 200,
    };
  }

  // DELETE	/posts/:id	post deletes
  async delete() {
    const ctx = this.ctx;
    ctx.body = {
      message: 'delete',
      status: 200,
    };
  }
}
module.exports = TopicController;