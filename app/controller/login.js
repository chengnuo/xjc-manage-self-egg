'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken');

function accessMenuFn(data, pid) {
  const result = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].pid == pid) {
      const obj = {
        ...data[i],
        name: data[i].name,
        id: data[i].id,
        path: data[i].menuname,
      };
      temp = accessMenuFn(data, data[i].id);

      console.log('temp', temp);

      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}

// 用户逻辑
const signInSingle = {
  // 登录逻辑执行
  init: (ctx, userInfo, requestBody) => {
    if (!userInfo) { // 用户不存在
      ctx.body = signInSingle.notUser();
      return false;
    }
    if (userInfo && userInfo.password === requestBody.password) { // 如果密码一样，登录成功
      ctx.body = signInSingle.onUser(ctx, userInfo);
    } else { // 密码错误
      ctx.body = signInSingle.passwordError();
    }
  },
  // 用户不存在
  notUser: () => {
    return {
      message: '用户不存在',
      status: 200,
    };
  },
  // 用户存在
  onUser: (ctx, userInfo) => {
    const expiresInTime = 60 * 60 * 1; // 过期时间设置为60妙。那么decode这个token的时候得到的过期时间为 : 创建token的时间 +　设置的值 1小时
    // 用户存在
    const token = jwt.sign({ id: userInfo.id }, ctx.app.config.jwt.secret, {
      expiresIn: expiresInTime,
    });
    const result = ctx.app.mysql.update('user',
      {
        id: userInfo.id,
        token: token,
      });

    ctx.cookies.set('token', token, {
      maxAge: expiresInTime,
      httpOnly: false,
      overwrite: true,
      signed: false,
    });
    return {
      message: '登录成功',
      status: 200,
      token,
    };
  },
  // 密码错误
  passwordError: () => {
    return {
      message: '密码错误',
      status: 201,
    };
  },

};


class HomeController extends Controller {
  /**
   * 登录
   * @return {Promise<void>}
   */
  async signIn() {
    const { ctx } = this;
    const requestBody = this.ctx.request.body;
    const params = {
      username: requestBody.username,
    };
    const userInfo = await this.service.login.signIn(params); // 获取用户信息
    signInSingle.init(ctx, userInfo, requestBody); // 登录逻辑
  }

  /**
   * 登出
   * @return {Promise<void>}
   */
  async signOut() {
    const { ctx } = this;
    ctx.cookies.set('token', null);

    ctx.body = {
      message: '登出成功',
      status: 200,
    };
  }

  // 登录之后获取权限菜单
  async getMenuList() {
    const ctx = this.ctx;


    const userToken = await this.app.mysql.get('user', {
      token: ctx.request.header.authorization.split(' ')[1] || '',
    });

    console.log('userToken', userToken)


    // 角色
    const resultUserRole = await this.app.mysql.select('user_role', {
      where: {
        uid: userToken.id,
      },
    });

    console.log('resultUserRole', resultUserRole);


    // 过滤
    const filterUserRole = resultUserRole.map((item, index) => {
      return `${item.role_id}`;
    });


    // 5,权限
    const resultRoleAccess = await this.app.mysql.select('role_access', {
      where: {
        role_id: filterUserRole,
      },
    });

    const filterRoleAccess = resultRoleAccess.map((item, index) => {
      if (resultRoleAccess.length - 1 === index) {
        return `access.id=${item.access_id}`;
      }
      return `access.id=${item.access_id} || `;

    });

    console.log('filterRoleAccess', filterRoleAccess);

    let accessMenu = [];
    let farmatAccessMenu = [];


    if (filterRoleAccess.length > 0) {
      // 7，权限Menu
      accessMenu = await this.app.mysql.query(`SELECT access.id, access.url, access.method, access.menuname, access.name, access.pid FROM access LEFT JOIN role_access ON access.id=role_access.role_id WHERE (${filterRoleAccess.join('')}) group by id`);
      farmatAccessMenu = accessMenuFn(accessMenu, 0);

      ctx.body = {
        status: 200,
        message: '登录菜单',
        accessMenu,
        farmatAccessMenu,
      };
    } else {
      ctx.body = {
        status: 201,
        message: '获取菜单失败',
        accessMenu: [],
        farmatAccessMenu: [],
      };
    }


  }
}

module.exports = HomeController;
