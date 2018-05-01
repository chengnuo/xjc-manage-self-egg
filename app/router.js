'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // const localStrategy = app.passport.authenticate('local');
  router.get('/', controller.home.index);
  // 鉴权
  const localStrategy = app.passport.authenticate('local');
  router.get('/api/signIn', controller.user.signIn); // 登入
  router.post('/api/signIn', localStrategy); // 登入
};
