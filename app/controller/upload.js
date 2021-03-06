'use strict';

const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class UploadAjaxController extends Controller {
  // async show() {
  //   await this.ctx.render('page/ajax.html');
  // }

  async upload() {
    const stream = await this.ctx.getFileStream();


    // const filename = encodeURIComponent(stream.fields.name) + path.extname(stream.filename).toLowerCase();
    const filename = encodeURIComponent(stream.filename);
    console.log('stream', stream)
    console.log('filename', filename)
    const target = path.join(this.config.baseDir, 'app/public/images', filename);
    const writeStream = fs.createWriteStream(target);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }

    // this.ctx.body = { url: '/public/' + filename };
    this.ctx.body = { url: filename };
  }
}

module.exports = UploadAjaxController;
