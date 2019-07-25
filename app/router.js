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

  // 用户登录/登出
  app.router.post('login', '/api/v1/login/signIn', app.controller.login.signIn); // 登录
  app.router.post('login', '/api/v1/login/signOut', app.controller.login.signOut); // 登出
  app.router.post('login', '/api/v1/login/getMenuList', app.controller.login.getMenuList); // 登录后获取列表

  // 用户模块
  app.router.delete('user', '/api/v1/user', app.controller.user.delete); // 拓展多个删除
  app.router.resources('user', '/api/v1/user', checktoken, app.controller.user); // restful
  app.router.post('users', '/api/v1/user/setRoles', app.controller.user.setRoles); // 设置角色
  app.router.get('users', '/api/v1/user/setRolesList', app.controller.user.setRolesList); // 设置角色列表
  // 角色模块
  // app.router.delete('role', '/api/v1/role', app.controller.role.delete); // 拓展多个删除
  app.router.resources('role', '/api/v1/role', checktoken, app.controller.role); // restful
  app.router.post('role', '/api/v1/role/setAccess', app.controller.role.setAccess); // 设置权限
  app.router.post('role', '/api/v1/role/setAccessList', app.controller.role.setAccessList); // 设置权限列表
  // 权限模块
  app.router.delete('access', '/api/v1/access', app.controller.access.delete); // 拓展多个删除
  app.router.resources('access', '/api/v1/access', checktoken, app.controller.access); // restful
  // 工具模块 restful
  app.router.resources('tool', '/api/v1/tool', checktoken, app.controller.tool);
  // 上传模块
  app.post('/api/upload', app.controller.upload.upload);
  // 计划模块 restful
  app.router.resources('plan', '/api/v1/plan', checktoken, app.controller.plan);
};
