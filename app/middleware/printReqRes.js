module.exports = () => {
  return async function printReqRes(ctx, next) {
    await next();

    ctx.logger.info('请求:%s | 回包:%s', JSON.stringify(ctx));
  };
};