'use strict';

const Controller = require('egg').Controller;
const nodemailer = require('nodemailer');

class EmailController extends Controller {
  // async show() {
  //   await this.ctx.render('page/ajax.html');
  // }

  async index() {
    var transporter = nodemailer.createTransport({
      service: 'QQ',
      auth: {
        user: '2585441871@qq.com',
        // pass: 'hkcnfnlmbrefecif'
        pass: 'hkcnfnlmbrefecif'
      }
    });

    // console.log('transporter',transporter)

    var mailOptions = {
      from: '2585441871@qq.com ', // sender address
      to: '258256011@qq.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world ✔', // plaintext body
      html: '<b>Hello world ✔</b>' // html body
    };

    let resultData = {};

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
        resultData = {
          status: 500,
          message: `错误：${error}`,
        }
      }else{
        console.log('Message sent: ' + info.response);
        resultData = {
          status: 200,
          message: `错误：${info.response}`,
        }
      }
    });
    this.ctx.body = resultData;
  }
}

module.exports = EmailController;
