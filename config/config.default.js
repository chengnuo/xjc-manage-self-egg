'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1525093940453_2422';

  // add your config here
  config.middleware = [];

  /**
   * 原因：处理 invalid csrf token 报错
   * 参考链接：https://eggjs.org/zh-cn/faq.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E4%BC%9A%E6%9C%89-csrf-%E6%8A%A5%E9%94%99
   * @type {{csrf: {enable: boolean}}}
   */
  config.security = {
    csrf: {
      enable: false,
    },
  };
  /**
   * 设置鉴权
   * @type {{usernameField: string, passwordField: string}}
   */
  // config.passportLocal = {
  //   usernameField: 'username',
  //   passwordField: 'password',
  // };

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

  return config;
};
