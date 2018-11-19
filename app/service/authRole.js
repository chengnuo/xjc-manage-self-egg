'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class TopicService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  // 详情
  async show(params) {
    const result = await this.app.mysql.get('role', { id: params.id });
    return result;
  }

  // 列表
  async list(params) {
    const list = this.app.mysql.select('role', params);
    return list;
  }
  // 条数
  async total(params) {
    const total = this.app.mysql.count('role', params);
    return total;
  }

  // 新增
  async create(params) {
    const result = await this.app.mysql.insert('role', params);
    return result;
  }

  // 更新
  async update(params) {
    const result = await this.app.mysql.update('role',
      Object.assign({}, params, {
        updated_time : moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      })
    );
    return result;
  }

  // 删除
  async delete(params) {
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