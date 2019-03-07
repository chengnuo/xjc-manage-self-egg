// app/service/topics.js
const Service = require('egg').Service;

function accessMenuFn(data, pid) {
  const result = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].pid === pid) {
      const obj = {
        ...data[i],
        name: data[i].name,
        id: data[i].id,
        path: data[i].menuname,
      };
      temp = accessMenuFn(data, data[i].id);

      // console.log('temp', temp);

      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}

class TopicService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async signIn(params) {
    const user = this.app.mysql.get('user', params);
    return user;
  }
  async getMenuList(params) {
    const ctx = this.ctx;


    const userToken = await this.app.mysql.get('user', {
      token: ctx.request.header.authorization.split(' ')[1] || '',
    });

    console.log('ctx.request.header.authorization.split', ctx.request.header.authorization.split(' ')[1])


    // 角色
    const resultUserRole = await this.app.mysql.select('user_role', {
      where: {
        uid: userToken.id,
      },
    });


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


    let accessMenu = [];
    let farmatAccessMenu = [];


    if (filterRoleAccess.length > 0) {
      // 7，权限Menu
      accessMenu = await this.app.mysql.query(`SELECT access.id, access.url, access.method, access.menuname, access.name, access.pid FROM access LEFT JOIN role_access ON access.id=role_access.role_id WHERE (${filterRoleAccess.join('')}) group by id`);
      farmatAccessMenu = accessMenuFn(accessMenu, 0);

      return {
        status: 200,
        message: '登录菜单',
        accessMenu,
        farmatAccessMenu,
      };
    } else {
      return {
        status: 201,
        message: '获取菜单失败',
        accessMenu: [],
        farmatAccessMenu: [],
      };
    }
  }
}

module.exports = TopicService;