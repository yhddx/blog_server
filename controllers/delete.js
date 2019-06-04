var mysql = require('mysql');

var fn_delete = async(ctx, next) => {
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
    deleteArticle = (deleteNum) => {
        let _sql =`delete from article where id=${deleteNum}`;
        return query(_sql)
    }
    var data = {
        status: 0,
        message: "",
        articles: [],
    };
    const deleteNum = ctx.request.body.number;
    console.log(deleteNum);
    await deleteArticle(deleteNum)
    .then(result => {
        data.message = '删除成功';
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(data);
    })       
    return;
}

module.exports = {
    'POST /delete/': fn_delete
};