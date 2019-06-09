const fs = require("fs");
const path = require('path');


var fn_uploadfile = async (ctx, next) => {
    let fileName = ctx.request.body.name;
    const index = ctx.request.body.index;
    const i = fileName.lastIndexOf('.');


    const file = ctx.request.files.file;
    // console.log('index', file);
    let body;
    if (file === undefined) {
        const mergedbPath = `/largefile/${fileName}`;
        let mergefilePath = path.join(__dirname, `../public${mergedbPath}`);
        fs.writeFileSync(mergefilePath, '');

        for (let j = 0; j < index; j++) {

            let copyName = `${fileName.slice(0, i)}_${j}.${fileName.slice(i + 1)}`;
            const dbPath = `/largefile/${copyName}`;
            let filePath = path.join(__dirname, `../public${dbPath}`);
            var contentText = fs.readFileSync(filePath);
            fs.appendFileSync(mergefilePath, contentText);
            console.log(contentText);
        }
        body = {
            "uid": 'cc',
            "name": 'fileName',
            "status": "done",
        }
        return ctx.body = JSON.stringify(body);
}

if (file) {
    fileName = `${fileName.slice(0, i)}_${index}.${fileName.slice(i + 1)}`;

    const reader = fs.createReadStream(file.path);
    const dbPath = `/largefile/${fileName}`;
    let filePath = path.join(__dirname, `../public${dbPath}`);
    console.log('filePath', filePath);
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    let num = Math.floor(Math.random() * 10)
    // if (num < 2) {
    //     ctx.throw(500);
    // } else {
        body = {
            "uid": 'cc',
            "name": 'fileName',
            "status": "done",
        }
        return ctx.body = JSON.stringify(body);
    // }

}

}


module.exports = {
    'POST /uploadlargefile/': fn_uploadfile
};