'use strict';

// had enabled by egg
// exports.static = true;

// config/plugin.js passport 校验
exports.passport = {
  enable: true,
  package: 'egg-passport',
};
// https://github.com/eggjs/egg-passport-local#configuration
// https://github.com/JZLeung/egg-issue-demo demo
exports.passportLocal = {
  enable: true,
  package: 'egg-passport-local',
};
// 数据库配置
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};