const Koa = require('koa');

var url = require('url');

const util = require('./util');

// const bodyParser = require('koa-bodyparser');

const koaBody = require('koa-body');

const controller = require('./controller');

const app = new Koa();

var mysql = require('mysql');

const static = require('koa-static');
// 配置静态web服务的中间件
app.use(static(__dirname+'/public/'));


    
const numCPUs = require('os').cpus().length;
console.log(numCPUs)

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'blog',
})


// parse request body:
// app.use(bodyParser());//功能与koaBody类似
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}));

app.use(async (ctx, next) => {
    ctx.set('Content-Type', 'application/json;charset=UTF-8');
    ctx.set('Access-Control-Allow-Origin', ctx.headers['origin']);
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Headers', 'content-type,x-requested-with');
    console.log('app option', ctx.method);
    if (ctx.method == 'OPTIONS') {
        ctx.response.status = 200;
        ctx.response.body = ""
        return;
    } else {
        await next();
    }
});

app.use(async (ctx, next) => {
    const p = url.parse(ctx.url, true).path;
    const h = ctx.request.header.origin;
    console.log('netloc',ctx.request.header.origin);
    if(p == '/login/'){
        await next();
        return;
    }
    if(h === 'http://localhost:9090' || h == 'https://www.yhddx.cn'){
        await next();
        console.log('website')
        return;
    }
    if( !ctx.cookies.get('userid')) {
        ctx.cookies.get('userid')
        var data = {
            status: 9,
            message: "未登录",
            article: {},
        };
        ctx.response.status = 200
        ctx.response.body = JSON.stringify(data);
        return;
    } else {
        const _srvKey = Buffer.from('11111111111111111111111111111111', 'utf8').toString('hex');
    
        // let deId = ctx.cookies.get('userid');
        let deId = util.decypt(ctx.cookies.get('userid'), 'base64', _srvKey, 'hex', true);
        if(deId <= 0){
            ctx.response.status = 404
            ctx.response.body = '';
            return;
        }
        ctx.userid = deId;
        console.log('登录检测成功');
        await next();
    }
    
})


    

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});


// add controllers:
app.use(controller());

app.listen(8888);
console.log('app started at port 8888...');