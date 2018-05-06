'use strict';
const LocalStrategy = require('passport-local').Strategy;
const md5 = require('md5');
console.log('hahahahahha');
module.exports = app => {
  // 挂载 strategy
  app.passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, username, password, done) => {
    // format user
    const user = {
      provider: 'local',
      username,
      password,
    };
    console.log('%s %s get user: %j', req.method, req.url, user);
    app.passport.doVerify(req, user, done);
  }));

  // 处理用户信息
  app.passport.verify(async (ctx, user) => {
    // ctx.logger.debug('passport.verify', user);
    // console.log('处理用户信息user', user);

    // const auth = await ctx.model.Authorization.findOne({
    //   uid: user.id,
    //   provider: user.provider,
    // });

    // 写死测试
    // if (user.username === 'admin' && user.password === '888888') {
    //   return user;
    // }
    const userInfo = await ctx.service.user.find({
      username: user.username,
      password: md5(user.password),
    });
    console.log('userInfo',userInfo)
    if (userInfo) {
      return userInfo;
    }

    return null;

    // return true;
  });
  // 将用户信息序列化后存进 session 里面，一般需要精简，只保存个别字段
  app.passport.serializeUser(async (ctx, user) => {
    const auth_token = user.username + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    const opts = {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      signed: true,
      httpOnly: true,
    };
    ctx.cookies.set(app.config.auth_cookie_name, auth_token, opts);
    console.log('serializeUser', user);
    return user;
  });
  // 反序列化后把用户信息从 session 中取出来，反查数据库拿到完整信息
  app.passport.deserializeUser(async (ctx, user) => {
    console.log('deserializeUser', user);
    return user;
  });
};
