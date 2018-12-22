'use strict';

const Service = require('egg').Service;
const moment = require('moment');

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
  // async list(params) {
  //   // const list = this.app.mysql.select('user', params);
  //   // return list;
  //   const TABLE_NAME = 'user';
  //   const QUERY_STR = 'id, name, email, is_admin, status, updated_time, created_time, username';
  //   let sql = `select ${QUERY_STR} from ${TABLE_NAME} where status=1 and username  like "%${params.username}%"`;
  //   const row = await this.app.mysql.query(sql);
  //   return row;
  // }
  async list(params, pageCurrent, pageSize) {

    console.log('pageCurrent, pageSize', pageCurrent, pageSize)


    const QUERY_STR = 'us.id, us.name, us.email, us.is_admin, us.status, us.updated_time, us.created_time, us.username';
    const roleNames = await this.app.mysql.query(`
      SELECT ${QUERY_STR}, GROUP_CONCAT(ro.name SEPARATOR ',') AS rolename, GROUP_CONCAT(ro.id SEPARATOR ',') AS rolenameId
      FROM user us 
      LEFT JOIN user_role ug 
      ON us.id = ug.uid 
      LEFT JOIN role ro
      ON ug.role_id = ro.id
      WHERE us.status=1 AND us.username like "%${params.username}%" 
      GROUP BY us.id
      LIMIT ${pageCurrent},${pageSize}
    `);
    return roleNames;
  }
  // 条数
  async total(params) {
    // const total = this.app.mysql.count('user', params);
    // return total;
    const TABLE_NAME = 'user';
    const QUERY_STR = 'id, name, email, is_admin, status, updated_time, created_time, username';
    let sql = `select count(*) as 'total' from ${TABLE_NAME} where status=1 and username like "%${params.username}%"`;
    const total = await this.app.mysql.query(sql);
    return total[0].total;
  }

  // 新增
  async create(params) {
    const result = await this.app.mysql.insert('user', params);
    return result;
  }

  // 更新
  async update(params) {
    const result = await this.app.mysql.update('user',
      Object.assign({}, params, {
        updated_time : moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      })
    );
    return result;
  }

  // 删除
  async delete(params) {
    const result = await this.app.mysql.update('user', {
      id: params.id,
      status: 0,
    });
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