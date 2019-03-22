/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1550745880059_4149';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'printReqRes' ];
  config.errorHandler = {
    match: '/api',
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

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
    secret: '123456',
  };

  // token 去掉csrf验证
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
      // headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      // ignoreJSON: true,
    },
    // 白名单
    // domainWhiteList: [ 'http://auth.vquery.com:7001', 'http://a.vquery.com:7001' ],
    // withCredentials: true,
    domainWhiteList: [
      'http://localhost:8000',
      '.vquery.com',
      'blog.vquery.com',
      'http://139.199.221.174:8000',
    ], // security whitelist, starts with '.'
  };

  // # 黑白名单 {app_root}/config/config.default.js
  config.cors = {
    // 'origin': 'http://auth.vquery.com:7001',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    // 'allowHeaders': 'Origin, X-Requested-With, Content-Type, Accept',
    // 'withCredentials': true,
  };


  return {
    ...config,
    ...userConfig,
  };
};
