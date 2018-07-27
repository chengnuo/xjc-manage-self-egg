/**
 * sms
 * 短信
 * 对接信息：https://help.aliyun.com/document_detail/57458.html?spm=5176.10629532.106.4.727b1cbeKXiw9q
 */

'use strict';

const Controller = require('egg').Controller;
const SMSClient = require('@alicloud/sms-sdk')

class SmsController extends Controller {
  // async show() {
  //   await this.ctx.render('page/ajax.html');
  // }

  async index() {
    /**
     * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
     * Created on 2017-07-31
     */
    // ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
    const accessKeyId = 'LTAIVOI7QObxMFS9'
    const secretAccessKey = '0fWLht6DeKhD6Fk2IwniI8FutdP5x4'
    // 初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    // 发送短信
    smsClient.sendSMS({
      PhoneNumbers: '18813363888', // 要发送的手机号码
      SignName: '许俊超',
      TemplateCode: 'SMS_140625129',
      TemplateParam: '{"code":"12345"}',
    }).then(function (res) {
      let {Code}=res
      if (Code === 'OK') {
        //处理返回参数
        console.log(res)
      }
    }, function (err) {
      console.log(err)
    })
  }
}

module.exports = SmsController;
