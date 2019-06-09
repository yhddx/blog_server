var mysql = require('mysql');
const util = require('../util');
const _srvKey = Buffer.from('11111111111111111111111111111111', 'utf8').toString('hex');


var fn_userinfo = async (ctx, next) => {
    var data = {
        status: 0,
        message: "获取用户信息成功",
        userData: {},
    };

    console.log('deData', ctx.userid);
    if (ctx.userid <= 0) {
        data.status = 9;
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(data);
        return;
    }

    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'blog',
    })

    let query = (sql, values) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })

    }
    // 查找用户
    findUserData = (id) => {
        let _sql = `select * from userinfo where id=${id}`;
        return query(_sql)
    }
    await findUserData(ctx.userid)
        .then(results => {
            console.log(results[0].id);
            if (results.length == 0) {
                data.status = 9;
                data.message = '无此用户';
            } else {
                data.userData = {
                    userId: results[0].id,
                    userName: results[0].username,
                };
            }
            ctx.response.status = 200
            ctx.response.body = JSON.stringify(data);
            console.log('end');
        })
}
module.exports = {
    'POST /userinfo/': fn_userinfo
};

