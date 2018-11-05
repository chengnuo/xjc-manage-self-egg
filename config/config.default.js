'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1540866871776_2325';

  // add your config here
  config.middleware = [];

  // 单数据库信息配置
  config.mysql = {
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'root',
      // 数据库名
      database: 'x-myself',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // jwt 用户
  config.jwt = {
    secret: "123456",
  };

  // token 去掉csrf验证
  config.security = {
    csrf: {
      enable: false,
      // headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      // ignoreJSON: true,
    },
    // 白名单
    // domainWhiteList: [ 'http://auth.vquery.com:7001', 'http://a.vquery.com:7001' ],
    // withCredentials: true,
    domainWhiteList: ['.vquery.com', 'blog.vquery.com'],  // security whitelist, starts with '.'
  }

  return config;
};
