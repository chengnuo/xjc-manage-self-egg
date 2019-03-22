const jwt = require('jsonwebtoken');
// app/middleware/checktoken.js
module.exports = () => {

  // console.log('jwt', jwt);
  // let jwt = app.jwt;
  return async function(ctx, next) {
    // console.log('ctx', ctx);
    // console.log('ctx', ctx.url);
    // console.log('ctx', ctx.method);
    // console.log('ctx', await ctx.service.login.getMenuList())

    if (ctx.request.header.authorization) {
      const token = ctx.request.header.authorization.split(' ')[1];
      // console.log('token', token);
      let decoded;
      // 解码token
      try {
        decoded = jwt.verify(token, ctx.app.config.jwt.secret);

        // console.log('decoded', decoded);

        if (decoded) {
          const getMenuList = await ctx.service.login.getMenuList();
          let result = null;
          let ctxUrl = ctx.url ? ctx.url.split('?')[0] : ''; // /api/v1/role?pageCurrent=1&pageSize=10
          // console.log('ctxUrl', ctxUrl)
          result = (getMenuList.accessMenu || []).filter(item => {
            if ((ctxUrl.includes(item.url)) && (item.method === ctx.method)) {
              return true;
            }
            return false;
          });

          if (result.length > 0) {

          } else {
            // console.log('result1', result);
            ctx.status = 401;
            ctx.body = {
              message: '没有权限',
              status: 401,
            };
            return
          }
        }

      } catch (error) {
        // console.log('error', error);
        if (error.name === 'TokenExpiredError') {
          // console.log('时间到期');
          // 重新发放令牌
          // token = await jwt.sign({
          //   user_id: 1,
          //   user_name: '张三',
          // }, ctx.app.config.jwt.secret, {
          //   expiresIn: '60s', // 过期时间设置为60妙。那么decode这个token的时候得到的过期时间为 : 创建token的时间 +　设置的值
          // });
          // ctx.cookies.set('token', token, {
          //   maxAge: 60 * 1000,
          //   httpOnly: false,
          //   overwrite: true,
          //   signed: false,
          // });
          ctx.status = 401;
          ctx.body = {
            message: 'token过期，请重新登录',
            status: 401,
          };
          return;
        }
        ctx.status = 401;
        ctx.body = {
          message: 'token失效',
          status: 401,
        };
        return;

      }
      // 重置cookie时间
      // ctx.cookies.set('token', token, {
      //   maxAge: 60 * 1000,
      //   httpOnly: false,
      //   overwrite: true,
      //   signed: false,
      // });
      await next();
    } else {
      // await next(); // 测试阶段，直接通过
      ctx.status = 401;
      ctx.body = {
        message: '没有token',
        status: 401,
      };
      return;
    }
  };
};
