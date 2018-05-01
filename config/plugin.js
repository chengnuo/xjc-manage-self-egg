'use strict';

// had enabled by egg
// exports.static = true;

// config/plugin.js passport 校验
module.exports.passport = {
  enable: true,
  package: 'egg-passport',
};
// 数据库配置
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};