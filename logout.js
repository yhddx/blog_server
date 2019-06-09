var fn_logout = async (ctx, next) => {
    var data = {
        status: 0,
        message: "",
        userData: {},
    };
    ctx.cookies.set('userid', '', {
        domain: '127.0.0.1',
        path: '/',   //cookie写入的路径
        maxAge: 0,
        httpOnly: false,
        overwrite: false
    });
    ctx.set('Content-Type', 'application/json;charset=UTF-8');
    ctx.set('Access-Control-Allow-Origin', ctx.headers['origin']);
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Headers', 'content-type');
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(data);
}

module.exports = {
    'POST /logout/': fn_logout
};