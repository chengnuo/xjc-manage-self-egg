'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  const apiRouter = app.router.namespace('/api'); // api作为前缀
  apiRouter.post('/signIn', controller.login.signIn); // 登入
  apiRouter.post('/isSignIn', controller.login.isSignIn); // 判断是都登录
  apiRouter.post('/getUserId', controller.login.getUserId); // 获取用户id
  apiRouter.post('/signOut', controller.login.signOut); // 登出
  apiRouter.post('/authMenuList', controller.authMenu.list); // 权限菜单-列表
};
