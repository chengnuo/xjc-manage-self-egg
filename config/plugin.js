'use strict';

// had enabled by egg
// exports.static = true;

// 路由插件，加上命名空间
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};

// 数据库配置
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

// 校验登录
exports.jwt = {
  enable: true,
  package: "egg-jwt",
};

// 解决 invalid csrf token
exports.security = {
  enable: true,
  package: 'egg-security',
};

// {app_root}/config/plugin.js
exports.cors = {
  enable: true,
  package: 'egg-cors',
};