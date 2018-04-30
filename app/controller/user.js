'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5');

class TestController extends Controller {
  /**
   * 需求：用户登录
   * 版本号：v1.0.0
   * 思路：获取客户端用户名，返回数据库{用户名, 密码}，服务端密码和客户端密码进行校验。
   * @returns {Promise.<void>}
   */
  async signIn() {
    const requestBody = this.ctx.request.body;
    const commitRequestBody = {
      username: requestBody.username,
    };
    const userInfo = await this.service.user.find(commitRequestBody);
    let response = {};
    if (userInfo) {
      console.log('userInfo', userInfo);
      if (userInfo.password === md5(requestBody.password)) {
        // response.message = "登录成功";
        // response.success = true;
        // response.data = userInfo;
        response = {
          message: '登录成功',
          status: 200,
          currentAuthority: 'admin', // 这是权限，暂时写死
        };
      } else {
        response = {
          message: '密码不正确',
          status: 500,
        };
      }
    } else {
      response = {
        message: '用户不存在',
        status: 500,
      };
    }
    this.ctx.body = response;

  }

  /**
   * 登出
   */
  signOut() {
    const response = {
      message: '登出成功',
      status: 200,
    }
    this.ctx.body = response;
  }
}

module.exports = TestController;
