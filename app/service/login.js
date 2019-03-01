// app/service/topics.js
const Service = require('egg').Service;

class TopicService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async signIn(params) {
    const user = this.app.mysql.get('user', params);
    return user;
  }
}

module.exports = TopicService;