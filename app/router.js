'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  const localStrategy = app.passport.authenticate('local', { // 鉴权
    successRedirect: '/api/signIn',
    failureRedirect: '/api/notAuthorized',
  });
  const apiRouter = app.router.namespace('/api');
  apiRouter.get('/signIn', controller.login.signIn); // 登入
  apiRouter.post('/signIn', localStrategy);
  apiRouter.get('/signOut', controller.login.signOut); // 登出
  apiRouter.get('/notAuthorized', controller.notAuthorized.index); // 权限

  // apiRouter.get('/user', controller.user.index); // 用户模块

  // user模块 restful
  app.router.resources('users', '/api/users', app.controller.users);
  apiRouter.post('users', '/setRoles', app.controller.users.setRoles); // 设置角色
  apiRouter.get('users', '/setRolesList', app.controller.users.setRolesList); // 设置角色列表
  // 角色模块 restful
  app.router.resources('roles', '/api/roles', app.controller.roles);
  apiRouter.post('roles', '/setAccess', app.controller.roles.setAccess); // 设置权限
  apiRouter.get('roles', '/setAccessList', app.controller.roles.setAccessList); // 设置权限列表
  // 权限模块 restful
  app.router.resources('access', '/api/access', app.controller.access);
  // 博客模块 restful
  app.router.resources('blogs', '/api/blogs', app.controller.blogs);
  // 计划模块 restful
  app.router.resources('plans', '/api/plans', app.controller.plans);
  // 工具模块 restful
  app.router.resources('tools', '/api/tools', app.controller.tools);
  // 上传模块
  apiRouter.post('/upload', app.controller.upload.upload);
  // 邮箱
  apiRouter.post('/email', app.controller.email.index);
  // 发送短信
  apiRouter.post('/sms', app.controller.sms.index);
};
