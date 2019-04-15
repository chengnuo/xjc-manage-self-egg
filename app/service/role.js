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

  // 详情
  async show(params) {
    const result = await this.app.mysql.get('role', { id: params.id });

    return result;
  }

  // 列表
  async list(params) {
    const list = this.app.mysql.select('role', params);
    // const total = this.app.mysql.count('role', params);
    // this.checkSuccess(result);
    return list;
  }
  // 条数
  async total(params) {
    const total = this.app.mysql.count('role', params);
    // this.checkSuccess(result);
    return total;
  }

  // 新增
  async create(params) {
    const result = await this.app.mysql.insert('role', params);
    return result;
  }

  // 更新
  async update(params) {
    const result = await this.app.mysql.update('role', params);
    return result;
  }

  // 删除
  async destroy(params) {
    const result = await this.app.mysql.update('role', {
      id: params.id,
      status: 0,
    });
    return result;
  }


  // 设置权限
  async setAccess(params) {
    const result = await this.app.mysql.insert('role_access', params);
    return result;
  }

  // 设置权限列表
  async setAccessList(params) {
    const list = this.app.mysql.select('access', params);
    return list;
  }
}

module.exports = TopicService;
