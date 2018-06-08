'use strict';

const Controller = require('egg').Controller;
// const md5 = require('md5');
const LocalStrategy = require('passport-local').Strategy;

class TestController extends Controller {
  /**
   * 需求：用户登录
   * 版本号：v1.0.0
   * 思路：获取客户端用户名，返回数据库{用户名, 密码}，服务端密码和客户端密码进行校验。
   * https://github.com/eggjs/egg/issues/2355
   */
  // async signIn() {
  //   const requestBody = this.ctx.request.body;
  //   const commitRequestBody = {
  //     username: requestBody.username,
  //   };
  //   const userInfo = await this.service.user.find(commitRequestBody);
  //   let response = {};
  //   if (userInfo) {
  //     // admin 888888
  //     if (userInfo.password === md5(requestBody.password)) {
  //       // response.message = "登录成功";
  //       // response.success = true;
  //       // response.data = userInfo;
  //       response = {
  //         message: '登录成功',
  //         status: 200,
  //         currentAuthority: 'admin', // 这是权限，暂时写死
  //       };
  //     } else {
  //       response = {
  //         message: '密码不正确',
  //         status: 500,
  //       };
  //     }
  //   } else {
  //     response = {
  //       message: '用户不存在',
  //       status: 500,
  //     };
  //   }
  //   this.ctx.body = response;
  //
  // }
  async signIn() {
    const ctx = this.ctx;

    if (ctx.isAuthenticated()) {
      // ctx.body = `<div>
      //   <h2>${ctx.path}</h2>
      //   <hr>
      //   Logined user: <img src="${ctx.user.photo}"> ${ctx.user.displayName} / ${ctx.user.id} | <a href="/logout">Logout</a>
      //   <pre><code>${JSON.stringify(ctx.user, null, 2)}</code></pre>
      //   <hr>
      //   <a href="/">Home</a> | <a href="/user">User</a>
      // </div>`;
      if (ctx.user.err) { // 登录失败逻辑判断
        ctx.body = {
          status: ctx.user.status,
          message: ctx.user.message,
        };
      } else { // 正常返回信息

        // 用户
        const resultUser = await this.app.mysql.get('user', {
          username: ctx.user.data.username,
          password: ctx.user.data.password,
        });

        // 角色
        const resultUserRole = await this.app.mysql.select('user_role', {
          where: {
            uid: resultUser.id,
          },
        });

        // console.log('cookie-1', ctx.cookies.get(this.app.config.auth_cookie_name) );

        let filterUserRole = resultUserRole.map((item,index)=>{
          if(resultUserRole.length-1 === index){
            return `role_id=${item.role_id}`;
          }else {
            return `role_id=${item.role_id} || `;
          }
        });

        console.log('filterUserRole', filterUserRole.join(''));
        console.log('resultUserRole', resultUserRole.length);

        // 权限
        // const resultAccess = await this.app.mysql.query('SELECT role.*, access.* FROM role,access,role_access WHERE role.id=role_access.role_id AND access.id=role_access.access_id');
        const resultAccess = await this.app.mysql.query(`SELECT role.name, role_access.role_id, role_access.access_id FROM role LEFT JOIN role_access ON role.id=role_access.access_id WHERE ${filterUserRole.join('')}`);
        // select *
        // from
        // (select id,sum(money) as mm from a表 group by id)  aaa,
        //   (select id,sum(money) as nn  from b表 group by id)  bbb
        // where aaa.id=bbb.id and aaa.mm=bbb.nn;

        console.log('resultAccess', resultAccess);

        ctx.body = {
          status: 200,
          message: '登录成功',
          data: {
            userId: resultUser.id, // 用户ID
            userRole: resultUserRole, // 角色
            userAccess: resultAccess,
            filterUserRole: filterUserRole,
          },
        };
      }

    } else {
      ctx.session.returnTo = ctx.path;
      // ctx.body = `
      //   <div>
      //     <h2>${ctx.path}</h2>
      //     <hr>
      //     Login with
      //     <a href="/passport/weibo">Weibo</a> | <a href="/passport/github">Github</a> |
      //     <a href="/passport/bitbucket">Bitbucket</a> | <a href="/passport/twitter">Twitter</a>
      //     <hr>
      //     <a href="/">Home</a> | <a href="/user">User</a>
      //   </div>
      // `;
      ctx.body = {
        status: 402,
        message: '参数错误',
      };
    }
  }
  /**
   * 需求：用户登出
   * 版本号：v1.0.0
   */
  // signOut() {
  //   const response = {
  //     message: '登出成功',
  //     status: 200,
  //   };
  //   this.ctx.body = response;
  // }
  async signOut() {
    const ctx = this.ctx;

    ctx.logout();
    // ctx.redirect(ctx.get('referer') || '/api/signIn');
    ctx.body = {
      status: 200,
      message: '退出登录成功',
    };
  }
}

module.exports = TestController;
