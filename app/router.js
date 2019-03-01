'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  const checktoken = app.middleware.checktoken(); // 查看是否登录

  // app/router.js
  app.router.delete('topics', '/api/v2/topics', app.controller.topics.delete); // 拓展多个删除
  app.router.resources('topics', '/api/v2/topics', checktoken, app.controller.topics); // restful

  // 用户模块
  app.router.post('login', '/api/v1/login/signIn', app.controller.login.signIn); // 登录
  app.router.post('login', '/api/v1/login/signOut', app.controller.login.signOut); // 登出
};
