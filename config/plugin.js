'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };

// 验证数据格式
exports.mysql = {
  enable: true,
  package: 'egg-validate',
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