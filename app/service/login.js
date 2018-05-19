const Service = require('egg').Service;


class UserService extends Service {
  async find(commitRequestBody) {
    const user = this.app.mysql.get('user', commitRequestBody);
    return user;
  }
}

module.exports = UserService;
