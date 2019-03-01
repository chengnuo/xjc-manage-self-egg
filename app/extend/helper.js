// app/extend/helper.js

module.exports = {
  // 过滤 whereData
  filterIndexWhereData(ctxQuery) {
    const whereData = {};
    let i = 0;
    for (i in ctxQuery) {
      if (i === 'pageCurrent') {
        continue;
      } else if (i === 'pageSize') {
        continue;
      } else {
        whereData[i] = ctxQuery[i];
      }
    }
    return whereData;
  },
};
