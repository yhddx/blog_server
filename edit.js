var mysql = require('mysql');


var fn_edit = async(ctx, next) => {
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
    updataArticle = (title, content, number) => {
        let _sql = `update article set title='${title}', content='${content}' where id=${number}`;
        return query(_sql)
    }
    var data = {
        status: 0,
        message: "",
        articles: [],
    };
    const editArticle = ctx.request.body; 
    await updataArticle(editArticle.title, editArticle.content, editArticle.number)
    .then(results =>{
        data.message = "update success";
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(data);
    })
    return;
}

module.exports = {
    'POST /edit/:number': fn_edit
};