'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  const apiRouter = app.router.namespace('/api'); // api作为前缀

  const auth = app.middleware.auth(app);

  apiRouter.post('/signIn', controller.login.signIn); // 登入
  apiRouter.post('/home', auth, controller.home.index); // 测试
  apiRouter.post('/isSignIn', controller.login.isSignIn); // 判断是都登录
  apiRouter.post('/getUserId', controller.login.getUserId); // 获取用户id
  apiRouter.post('/signOut', controller.login.signOut); // 登出
  apiRouter.post('/getMenuList', controller.login.getMenuList); // 获取登录之后获取权限菜单

  apiRouter.post('/authMenu/list', controller.authMenu.list); // 权限菜单-列表
  apiRouter.post('/authMenu/create', controller.authMenu.create); // 权限菜单-新增
  apiRouter.post('/authMenu/update', controller.authMenu.update); // 权限菜单-更新
  apiRouter.post('/authMenu/delete', controller.authMenu.delete); // 权限菜单-删除

  apiRouter.post('/authUser/list', controller.authUser.list); // 用户-列表
  apiRouter.post('/authUser/create', controller.authUser.create); // 用户-新增
  apiRouter.post('/authUser/update', controller.authUser.update); // 用户-更新
  apiRouter.post('/authUser/delete', controller.authUser.delete); // 用户-删除

  apiRouter.post('/authUser/setRolesList', controller.authUser.setRolesList); // 用户-角色 user_role
  apiRouter.post('/authUser/setRoles', controller.authUser.setRoles); // 用户-角色 user_role 设置角色


  apiRouter.post('/authRole/list', controller.authRole.index); // 角色-列表
  apiRouter.post('/authRole/create', controller.authRole.create); // 角色-新增
  apiRouter.post('/authRole/update', controller.authRole.update); // 角色-更新
  apiRouter.post('/authRole/delete', controller.authRole.delete); // 角色-删除

  apiRouter.post('/authRole/setAccessList', controller.authRole.setAccessList); // 角色-权限 role_access
  apiRouter.post('/authRole/setAccess', controller.authRole.setAccess); // 角色-权限 设置权限
};
