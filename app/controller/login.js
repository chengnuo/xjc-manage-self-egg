'use strict';

const Controller = require('egg').Controller;
// const md5 = require('md5');
// const LocalStrategy = require('passport-local').Strategy;
const moment = require('moment');


function accessMenuFn(data, pid) {
  let result = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].pid == pid) {
      let obj = {
        ...data[i],
        name: data[i].name,
        id: data[i].id,
      };
      temp = accessMenuFn(data, data[i].id);

      console.log('temp', temp)

      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}

class TestController extends Controller {
  /**
   * 需求：用户登录
   * 版本号：v1.0.0
   * 思路：获取客户端用户名，返回数据库{用户名, 密码}，服务端密码和客户端密码进行校验。
   * https://github.com/eggjs/egg/issues/2355
   */
  async signIn() {
    // const ctx = this.ctx;
    // ctx.body = {
    //   status: 200,
    //   message: '登录成功',
    // };
    const { ctx } = this;
    // 设置token
    // this.ctx.set('x-access-token', this.ctx.app.config.token);

    // # 获取用户信息
    const user = await this.app.mysql.get('user', {
      username: ctx.request.body.username,
      // password: ctx.request.body.password,
    });

    if (user) {
      if (ctx.request.body.password === user.password) {
        // # 用户名和密码进行查找
        const uersResult = await this.app.mysql.get('user', {
          username: ctx.request.body.username,
          password: user.password,
        });
        // # 生成token
        const dayUnix = moment(new Date().getTime()).unix();
        const token = this.app.jwt.sign({
          id: uersResult.id,
          iat: dayUnix,
          exp: Math.floor(Date.now() / 1000) + (60 * 60) * 5, // 5个小时
        }, this.app.config.jwt.secret);
        // # 存入数据库
        const resultToken = await this.app.mysql.update('user', {
          id: uersResult.id,
          token,
        });
        // # 判断是否录入成功
        if (resultToken.affectedRows === 1) {
          ctx.cookies.set('jwt', `${token}`, {
            maxAge: Math.floor(Date.now() / 1000) + (60 * 60) * 5,
            domain: '.vquery.com',
            // httponly: true,
          });
          ctx.session.uersResult = uersResult; // 缓存用户信息
          ctx.body = {
            message: '登录成功',
            status: 200,
            token,
          };
        } else {
          ctx.body = {
            message: '登录失败，服务器错误',
            status: 413,
            token,
          };
        }
      } else {
        ctx.body = {
          message: '密码错误',
          status: 412,
        };
      }
    } else {
      ctx.body = {
        message: '用户不存在',
        status: 403,
      };
    }
  }

  /**
   * 需求： 判断是否登录
   * 版本号：v1.0.0
   * @return {Promise.<void>}
   */
  async isSignIn() {
    const ctx = this.ctx;
    const token = await this.app.mysql.get('user', {
      token: ctx.request.body.token,
    });
    if (token) {
      ctx.body = {
        status: 200,
        message: '已登录',
      };
    } else {
      ctx.body = {
        status: 501,
        message: '已退出登录',
      };
    }
  }
  /**
   * 需求： 获取id
   * 版本号：v1.0.0
   * @return {Promise.<void>}
   */
  async getUserId() {
    const ctx = this.ctx;
    const token = await this.app.mysql.get('user', {
      token: ctx.request.body.token,
    });
    if (token) {
      ctx.body = {
        status: 200,
        message: '系统提示，获取成功',
        data: {
          id: token.id,
        },
      };
    } else {
      ctx.body = {
        status: 501,
        message: '系统提示，获取失败',
      };
    }
  }
  /**
   * 需求：用户登出
   * 版本号：v1.0.0
   */
  async signOut() {
    const ctx = this.ctx;

    if (ctx.request.body.token) {
      const token = await this.app.mysql.get('user', {
        token: ctx.request.body.token,
      });

      if (token) {
        const result = await this.app.mysql.delete('user', {
          token: token.token,
        });
        if (result.affectedRows === 1) {
          ctx.body = {
            status: 200,
            message: '登出成功',
          };
        } else {
          ctx.body = {
            status: 501,
            message: '服务器错误',
          };
        }

      } else {
        ctx.body = {
          status: 501,
          message: '错误的token',
        };
      }
    } else {
      ctx.body = {
        status: 501,
        message: '没有token',
      };
    }


    // ctx.logout();

  }

  // 登录之后获取权限菜单
  async getMenuList() {
    const ctx = this.ctx;
    // 角色
    const resultUserRole = await this.app.mysql.select('user_role', {
      where: {
        uid: ctx.request.body.id,
      },
    });


    // 过滤
    const filterUserRole = resultUserRole.map((item, index) => {
      return `${item.role_id}`;
    });


    // 5,权限
    const resultRoleAccess = await this.app.mysql.select('role_access', {
      where: {
        role_id: filterUserRole,
      },
    });

    const filterRoleAccess = resultRoleAccess.map((item, index) => {
      if (resultRoleAccess.length - 1 === index) {
        return `access.id=${item.access_id}`;
      }
      return `access.id=${item.access_id} || `;

    });

    console.log('filterRoleAccess', filterRoleAccess);

    let accessMenu = [];
    let farmatAccessMenu = [];


    if (filterRoleAccess.length > 0) {
      // 7，权限Menu
      accessMenu = await this.app.mysql.query(`SELECT access.id, access.path, access.menuname, access.name, access.pid FROM access LEFT JOIN role_access ON access.id=role_access.role_id WHERE (${filterRoleAccess.join('')}) group by id`);

      farmatAccessMenu = accessMenuFn(accessMenu, 0)

      ctx.body = {
        status: 200,
        message: '登录菜单',
        accessMenu,
        farmatAccessMenu,
      };
    } else {
      ctx.body = {
        status: 200,
        message: '登录菜单',
        accessMenu,
        farmatAccessMenu,
      };
    }


  }
}

module.exports = TestController;
