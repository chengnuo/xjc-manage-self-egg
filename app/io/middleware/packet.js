'use strict';
module.exports = app => {
  return async (ctx, next) => {
    // setTimeout(async ()=>{
    //   await ctx.socket.emit('res', 'packet received!');
    // },1000)
    ctx.socket.emit('res', 'packet received!');
    console.log('packet:', ctx.packet);
    await next();
  };
};
