'use strict';

const Service = require('egg').Service;

class TopicService extends Service {
  constructor(ctx) {
    super(ctx);
    this.root = 'https://cnodejs.org/api/v1';
  }

  async request(url, opts) {
    url = `${this.root}${url}`;
    opts = Object.assign({
      timeout: [ '30s', '30s' ],
      dataType: 'json',
    }, opts);
    return this.ctx.curl(url, opts);
  }

  async show(params) {
    // const result = await this.request(`/topic/${params.id}`, {
    //   data: {
    //     mdrender: params.mdrender,
    //     accesstoken: params.accesstoken,
    //   },
    // });
    // this.checkSuccess(result);
    //
    // return result.data.data;

    const result = await this.app.mysql.get('user', { id: params.id });

    return result;

  }

  async list(params) {
    // const result = await this.request('/topics', {
    //   data: params,
    // });
    //
    // this.checkSuccess(result);
    // return result.data.data;

    const result = this.app.mysql.select('user', params);
    // this.checkSuccess(result);
    return result;
  }

  async create(params) {
    // const result = await this.request('/topics', {
    //   method: 'post',
    //   data: params,
    //   contentType: 'json',
    // });
    //
    // this.checkSuccess(result);
    // return result.data.topic_id;
    const result = await this.app.mysql.insert('user', params);
    return result;
  }

  async update(params) {
    // const result = await this.request('/topics/update', {
    //   method: 'post',
    //   data: params,
    //   contentType: 'json',
    // });
    //
    // this.checkSuccess(result);
    const result = await this.app.mysql.update('user', params);
    return result
  }


  async destroy(params){
    const result = await this.app.mysql.delete('user', {
      id: params.id,
    });
    return result;
  }

  checkSuccess(result) {
    if (result.status !== 200) {
      const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
      this.ctx.throw(result.status, errorMsg);
    }
    if (!result.data.success) {
      this.ctx.throw(500, 'remote response error', { data: result.data });
    }
  }
}

module.exports = TopicService;
