var mysql = require('mysql');



var fn_list = async (ctx, next) => {
    const numPerPage = 4;
    const page = (ctx.query.page !== undefined) ? ctx.query.page : 0;
    var data = {
        count: 0,
        status: 0,
        message: "",
        articles: [],
    };

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
    findNumPerPage = (page, numPerPage) => {
        let _sql = `select * from article limit ${numPerPage} offset ${page * numPerPage}`;
        return query(_sql)
    }

    // 查找用户
    findArticleList = () => {
        let _sql = 'select count(*) as cnt from article ;';
        return query(_sql)
    }
    let array = [];

    await findNumPerPage(page, numPerPage)
        .then(result => {
            array = result;
        })
    await findArticleList()
        .then(result => {
            data.count = result[0].cnt;   //文章总数量
            data.articles = array.map(element => {
                return {
                    number: element.id,
                    title: element.title,
                    content: element.content,
                }
            });
            ctx.response.status = 200;
            ctx.response.body = JSON.stringify(data);
        })
    return;
}

module.exports = {
    'GET /list/': fn_list
};