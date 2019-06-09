var mysql = require('mysql');
const fs = require('fs');

/*前端传来表单数据+cookie
cookie中获取userid
用当前时间+userid生成文件名；




*/


var fn_pictureDel = async (ctx, next) => {
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

    let deleteNum = ctx.request.body.uid;
    let deleteUrl = ctx.request.body.url;
    console.log(deleteNum,deleteUrl);
    const index1 = deleteUrl.lastIndexOf('/');
    const index2 = deleteUrl.lastIndexOf('.');
    const fileName = deleteUrl.slice(index1 + 1,index2);
    const dbPath = `/upload/${fileName}.${deleteUrl.slice(index2+1)}`;
    console.log(fileName,dbPath);


    deleteImg = (deleteNum) => {
        let _sql = `delete from imagefile where id=${deleteNum}`;
        return query(_sql)
    }

    console.log(`${__dirname}/../public${dbPath}`);

    await deleteImg(deleteNum)
        .then(result => {
            
            fs.unlink(`${__dirname}/../public${dbPath}`, (err) => {
                if (err) throw err;
                console.log(`successfully deleted ../public${dbPath}`);
            });    
            const body = {
                status: 0,
                message: "删除成功",
            }       
            return ctx.body = JSON.stringify(body);
        })
}

module.exports = {
    'POST /picture/del': fn_pictureDel
};