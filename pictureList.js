var mysql = require('mysql');

/*前端传来表单数据+cookie
cookie中获取userid
用当前时间+userid生成文件名；

*/

var fn_pictureList = async (ctx, next) => {
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
    findImgList = () => {
        let _sql = `select * from imagefile;`;
        return query(_sql)
    }
    let array = [];

    await findImgList()
        .then(result => {
            array = result;
            const body = array.map(element => {
                return {
                    "uid":element.id,
                    "name": element.id,
                    "status": "done",
                    "url": `http://127.0.0.1:8888${element.path}`,
                    "thumbUrl": `http://127.0.0.1:8888${element.path}`,
                }
            });
            return ctx.body = JSON.stringify(body);
        })
}

module.exports = {
    'GET /picture/': fn_pictureList
};