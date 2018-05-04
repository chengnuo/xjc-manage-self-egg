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

  const apiRouter = app.router.namespace('/api');
  apiRouter.get('/signIn', controller.user.signIn); // 登入
  apiRouter.post('/signIn', localStrategy); // 登入
};
