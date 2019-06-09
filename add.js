var mysql = require('mysql');

var fn_add = async (ctx, next) => {
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
    addArticle = (title, content) => {
        let _sql = `insert into article set title='${title}', content='${content}', author='yhddx', create_time=now(), modify_time=now()`;
        return query(_sql)
    }
    var data = {
        status: 0,
        message: "",
        articles: [],
    };
    const editArticle = ctx.request.body;
    
    await addArticle(editArticle.title, editArticle.content)
    .then(result =>{
        data.message = "update success";
        data.article = {
            number: result.insertId,
            title: '',
            content: '',
        };
        data.articles.number = result.insertId;
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(data);
    })
    return;
}

module.exports = {
    'POST /add/:number': fn_add
};