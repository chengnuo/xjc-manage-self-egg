'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

// 用户逻辑
const signInSingle = {
  // 登录逻辑执行
  init: (ctx, userInfo, requestBody) => {
    if (!userInfo) { // 用户不存在
      ctx.body = signInSingle.notUser();
      return false;
    }
    if (userInfo && userInfo.password === requestBody.password) { // 如果密码一样，登录成功
      ctx.body = signInSingle.onUser(ctx, userInfo);
    } else { // 密码错误
      ctx.body = signInSingle.passwordError();
    }
  },
  // 用户不存在
  notUser: () => {
    return {
      message: '用户不存在',
      status: 200,
    };
  },
  // 用户存在
  onUser: (ctx, userInfo) => {
    const expiresInTime = 60 * 60 * 1; // 过期时间设置为60妙。那么decode这个token的时候得到的过期时间为 : 创建token的时间 +　设置的值 1小时
    // 用户存在
    const token = jwt.sign({ id: userInfo.id }, ctx.app.config.jwt.secret, {
      expiresIn: expiresInTime,
    });
    ctx.cookies.set('token', token, {
      maxAge: expiresInTime,
      httpOnly: false,
      overwrite: true,
      signed: false,
    });
    return {
      message: '登录成功',
      status: 200,
      token,
    };
  },
  // 密码错误
  passwordError: () => {
    return {
      message: '密码错误',
      status: 200,
    };
  },

};


class HomeController extends Controller {
  /**
   * 登录
   * @returns {Promise<void>}
   */
  async signIn() {
    const { ctx } = this;
    const requestBody = this.ctx.request.body;
    const params = {
      username: requestBody.username,
    };
    const userInfo = await this.service.login.signIn(params); // 获取用户信息
    signInSingle.init(ctx, userInfo, requestBody); // 登录逻辑
  }

  /**
   * 登出
   * @returns {Promise<void>}
   */
  async signOut() {
    const { ctx } = this;
    ctx.cookies.set('token', null);

    ctx.body = {
      message: '登出成功',
      status: 200,
    };
  }
}

module.exports = HomeController;
