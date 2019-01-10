
function accessMenuFn(data, pid) {
  let result = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].pid == pid) {
      let obj = {
        ...data[i],
        name: data[i].name,
        id: data[i].id,
      };
      temp = accessMenuFn(data, data[i].id);

      console.log('temp', temp)

      if (temp.length > 0) {
        obj.children = temp;
      }
      result.push(obj);
    }
  }
  return result;
}

module.exports = (app) => {

  return async function auth(ctx, next) {
    await next();
    // console.log(`options`, options);
    // console.log('ctx', ctx);
    // console.log('next', next);
    //
    // console.log('ctx.headers', ctx.headers);
    // console.log('ctx.headers', ctx.headers.authorization);

    if (ctx.request.body.token) { // 如果token不存在
      const token = await app.mysql.get('user', {
        token: ctx.request.body.token,
      });



      if(token){
        // 角色
        const resultUserRole = await app.mysql.select('user_role', {
          where: {
            uid: token.id,
          },
        });

        console.log('resultUserRole', resultUserRole)
        // 过滤
        const filterUserRole = resultUserRole.map((item, index) => {
          return `${item.role_id}`;
        });


        // 5,权限
        const resultRoleAccess = await app.mysql.select('role_access', {
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
          accessMenu = await app.mysql.query(`SELECT access.id, access.path, access.menuname, access.name, access.pid FROM access LEFT JOIN role_access ON access.id=role_access.role_id WHERE (${filterRoleAccess.join('')}) group by id`);

          farmatAccessMenu = accessMenuFn(accessMenu, 0);

          let accessMenuFilter = accessMenu.filter((item)=>{
            if(item.name=='system'){ // 这里需要做判断
              return true
            }
          })

          if(accessMenuFilter.length>0){

          }else{
            ctx.body = {
              status: 401,
              message: '没有权限',
            };
          }

          // ctx.body = {
          //   status: 200,
          //   message: '登录菜单',
          //   accessMenu,
          //   farmatAccessMenu,
          // };
        } else {
          ctx.body = {
            status: 200,
            message: '登录菜单',
            accessMenu,
            farmatAccessMenu,
          };
        }
      }else if(token===null){
        ctx.body = {
          status: 401,
          message: 'token，不可用',
        };
      }



    } else {
      ctx.body = {
        status: 401,
        message: 'token不存在',
      };
    }


  };
};
