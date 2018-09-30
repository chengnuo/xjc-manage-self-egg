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
// {app_root}/config/plugin.js prefix https://github.com/eggjs/egg-router-plus
exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};

// 校验
exports.validate = {
  enable: true,
  package: 'egg-validate',
};




// exports.session = {
//   key: 'EGG_SESS',
//   maxAge: 24 * 3600 * 1000, // 1 天
//   httpOnly: true,
//   encrypt: true,
// };


// # 黑白名单 {app_root}/config/plugin.js
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.security = {
  enable: true,
  package: 'egg-security',
};