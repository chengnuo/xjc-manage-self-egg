'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // app/router.js
  app.router.delete('topics', '/api/v2/topics', app.controller.topics.delete); // 拓展多个删除
  app.router.resources('topics', '/api/v2/topics', app.controller.topics); // restful
};
