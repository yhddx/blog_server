var mysql = require('mysql');
const util = require('../util');
const _srvKey = Buffer.from('11111111111111111111111111111111', 'utf8').toString('hex');


var fn_login = async (ctx, next) => {
    console.log('login file')
    var data = {
        status: 0,
        message: "",
        regData: {},
    };
    const regData = ctx.request.body;
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
    findUserData = (name) => {
        let _sql = `select * from userinfo where username = '${name}'`;
        return query(_sql)
    }

    await findUserData(regData.regUsername)
        .then(result => {
            console.log(result.length);
            if (result.length == 0) {
                data.status = 1;
                data.message = '无此用户';
                console.log('login mysql if')
            }
            else {
                if (result[0].password == regData.regPassword) {
                    // 加密
                    let enId = util.encrypt(`${result[0].id}`, 'utf8', _srvKey, 'hex', true);
                    // let enId = result[0].id;
                    console.log('enId', enId);
                    ctx.cookies.set('userid', `${enId}`, {
                        domain: '127.0.0.1',
                        path: '/',   //cookie写入的路径
                        // maxAge: 1000 * 60 * 60 * 1,
                        // expires: new Date('2020-07-06'),
                        httpOnly: false,
                        overwrite: false
                    });
                    data.regData = {
                        id: result[0].id,
                        username: result[0].username,
                    };
                }
                else {
                    data.status = 2;
                    data.message = '密码错误';
                }
            }
            ctx.response.status = 200;
            ctx.response.body = JSON.stringify(data);
        })
}

module.exports = {
    'POST /login/': fn_login
};
