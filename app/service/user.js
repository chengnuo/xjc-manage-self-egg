'use strict';

const Service = require('egg').Service;

class TopicService extends Service {
  constructor(ctx) {
    super(ctx);
  }
  // 详情
  async show(params) {
    const result = await this.app.mysql.get('user', { id: params.id });

    return result;
  }
  // 列表
  async list(params) {
    const list = this.app.mysql.select('user', params);
    // const total = this.app.mysql.count('user', params);
    // this.checkSuccess(result);
    return list
  }
  // 条数
  async total(params) {
    const total = this.app.mysql.count('user', params);
    // this.checkSuccess(result);
    return total
  }

  // 新增
  async create(params) {
    const result = await this.app.mysql.insert('user', params);
    return result;
  }

  // 更新
  async update(params) {
    const result = await this.app.mysql.update('user', params);
    return result;
  }

  // 删除
  async destroy(params) {
    const result = await this.app.mysql.update('user', {
      id: params.id,
      status: 0,
    });
    return result;
  }

  // 删除多个
  async delete(params) {
    const ids = params.ids;
    const filterIds = ids.map((item) => {
      return `WHEN ${item} THEN 0 `;
    });
    const result = await this.app.mysql.query(`
      UPDATE user
          SET status = CASE id
              ${filterIds.join('')}
          END
      WHERE id IN (${ids})
    `);
    return result;
  }

  // 设置角色
  async setRoles(params) {
    const result = await this.app.mysql.insert('user_role', params);
    return result;
  }

  // 设置角色列表
  async setRolesList(params) {
    const list = this.app.mysql.select('role', params);
    return list;
  }
}

module.exports = TopicService;