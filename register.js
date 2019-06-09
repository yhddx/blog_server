var mysql = require('mysql');


var fn_register = async(ctx, next) =>{
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
    registerUser = (username, password) => {
        let _sql = `insert into userinfo set username='${username}', password='${password}', create_time=now(), modify_time=now()`;
        return query(_sql)
    }
    var data = {
        status: 0,
        message: "",
        regData: {},
    };
    const regData = ctx.request.body;   
    await registerUser(regData.regUsername, regData.regPassword)
    .then(results => {
        data.message = "register success";
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(data);
    })
}

module.exports = {
    'POST /register/': fn_register
};