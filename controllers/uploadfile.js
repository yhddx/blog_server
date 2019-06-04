const koaBody = require('koa-body');

const fs = require("fs");
const util = require('../util');
const _srvKey = Buffer.from('11111111111111111111111111111111', 'utf8').toString('hex');
const path = require('path');

var crypto = require('crypto');
var mysql = require('mysql');

/*前端传来表单数据+cookie
cookie中获取userid
用当前时间+userid生成文件名；

*/

var fn_uploadfile = async (ctx, next) => {
    let date = new Date();
    let userid = util.decypt(ctx.cookies.get('userid'), 'base64', _srvKey, 'hex', true);
    var md5 = crypto.createHash('md5');
    var fileName = md5.update(`${date}${userid}`).digest('hex');
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    const index = file.name.lastIndexOf('.');
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    const dbPath = `/upload/${fileName}.${file.name.slice(index + 1)}`;
    let filePath = path.join(__dirname, `../public${dbPath}`);
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);


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
    insertImg = (path, userid) => {
        let _sql = `insert into imagefile set path='${path}', userid='${userid}', create_time=now(), modify_time=now()`;
        return query(_sql)
    }

    await insertImg(dbPath, userid)
    .then(result => {
        console.log(result);
        const body = {
            "uid":result.insertId,
            "name": fileName,
            "status": "done",
            "url": `http://127.0.0.1:8888${dbPath}`,
            "thumbUrl": `http://127.0.0.1:8888${dbPath}`
        }
        return ctx.body =JSON.stringify(body);
    })
}

module.exports = {
    'POST /picture/upload/': fn_uploadfile
};