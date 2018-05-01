'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/signIn', controller.user.signIn); // 登录
  router.post('/signOut', controller.user.signOut); // 登出
};
