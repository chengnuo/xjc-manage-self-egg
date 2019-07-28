'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const  newConceptOne = fs.readdirSync('./app/public/mp3/newConceptOne');
    const  newConceptTwo = fs.readdirSync('./app/public/mp3/newConceptTwo');
    const  newConceptThree = fs.readdirSync('./app/public/mp3/newConceptThree');
    const  newConceptFour = fs.readdirSync('./app/public/mp3/newConceptFour');
    ctx.body = {
      name: 'hi, egg',
      newConceptOne: newConceptOne,
      newConceptTwo: newConceptTwo,
      newConceptThree: newConceptThree,
      newConceptFour: newConceptFour,
    };
  }
}

module.exports = HomeController;
