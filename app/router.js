'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  const localStrategy = app.passport.authenticate('local', { // 鉴权
    successRedirect: '/api/signIn',
    failureRedirect: '/notAuthorized',
  });
  const apiRouter = app.router.namespace('/api');
  apiRouter.get('/signIn', controller.login.signIn); // 登入
  apiRouter.post('/signIn', localStrategy); // 登入
  apiRouter.get('/signOut', controller.login.signOut); // 登出
  router.get('/notAuthorized', controller.notAuthorized.index); // 权限
};
