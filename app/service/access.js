'use strict';

const Service = require('egg').Service;

class TopicService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  // 详情
  async show(params) {
    const result = await this.app.mysql.get('access', { id: params.id });

    return result;
  }

  // 列表
  async list(params) {
    const list = this.app.mysql.select('access', params);
    // const total = this.app.mysql.count('access', params);
    // this.checkSuccess(result);
    return list;
  }
  // 条数
  async total(params) {
    const total = this.app.mysql.count('access', params);
    // this.checkSuccess(result);
    return total;
  }

  // 新增
  async create(params) {
    const result = await this.app.mysql.insert('access', params);
    return result;
  }

  // 更新
  async update(params) {
    const result = await this.app.mysql.update('access', params);
    return result;
  }

  // 删除
  async destroy(params) {
    const result = await this.app.mysql.delete('access', {
      id: params.id,
    });
    return result;
  }
}

module.exports = TopicService;