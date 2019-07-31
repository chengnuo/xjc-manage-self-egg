'use strict';
module.exports = app => {
  class QueryAdminConf extends app.Service {
    async queryLoanFlag() {
      const result = await app.curl('http://127.0.0.1:7001/api/v1/message?pageCurrent=1&pageSize=10&title=', {
        dataType: 'json',
      });
      console.log('消息', result.data.data)
      return result.data.data;
    }
  }
  return QueryAdminConf;
};
