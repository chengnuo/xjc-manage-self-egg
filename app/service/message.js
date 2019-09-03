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
    const result = await this.app.mysql.get('message', { id: params.id });

    return result;
  }

  // // 列表
  // async list(params) {
  //   const list = this.app.mysql.select('message', params);
  //   // const total = this.app.mysql.count('message', params);
  //   // this.checkSuccess(result);
  //   return list
  // }
  // 列表-模糊搜索
  async list(params, pageCurrent, pageSize) {
    const QUERY_STR = '*';
    const QUERY = `
      SELECT ${QUERY_STR}
      FROM message
      WHERE status=1 AND title 
      LIKE "%${params.title}%" 
      LIMIT ${pageCurrent},${pageSize}
    `
    const roleNames = await this.app.mysql.query(QUERY);
    console.log('QUERY', QUERY)
    return roleNames;
  }
  // 条数
  async total(params) {
    console.log('params', params)
    // const total = this.app.mysql.count('message', params);
    // // this.checkSuccess(result);
    // return total
    const TABLE_NAME = 'message';
    const sql = `
      SELECT count(*) 
      AS 'total' 
      FROM ${TABLE_NAME} 
      WHERE status=1 AND title 
      LIKE "%${params.title}%"
    `;
    const total = await this.app.mysql.query(sql);
    return total[0].total;
  }

  // 新增
  async create(params) {
    const result = await this.app.mysql.insert('message', params);
    return result;
  }

  // 更新
  async update(params) {
    const result = await this.app.mysql.update('message', params);
    return result;
  }

  // 删除
  async destroy(params) {
    // const result = await this.app.mysql.delete('message', {
    //   id: params.id,
    // });
    // return result;
    const result = await this.app.mysql.update('message', {
      id: params.id,
      status: 0,
    });
    return result;
  }

}

module.exports = TopicService;