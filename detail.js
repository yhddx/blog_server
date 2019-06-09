var mysql = require('mysql');

var fn_detail = async (ctx, next) => {
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
        let _sql = `select * from article where id=${id}`;
        return query(_sql)
    }
    var data = {
        status: 0,
        message: "",
        article: {},
    };
    const id = ctx.params.id;
    console.log(id);

    await findUserData(id)
        .then(results => {
            if (results.length == 0) {
                data.status = 1;
                data.message = '无数据';
            }
            else {
                data.article = {
                    number: results[0].id,
                    title: results[0].title,
                    content: results[0].content,
                };
            }
            ctx.response.status = 200;
            ctx.response.body = JSON.stringify(data);
        });
}
module.exports = {
    'GET /detail/:id': fn_detail
};