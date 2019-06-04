const crypto = require('crypto');
const _algorithm = 'aes-256-cbc';
const _iv = '66666666666666666666666666666666';
const ivBuffer = new Buffer(_iv, 'hex');
var util = {};
/**
 * @desc: 加密
 * @param: data: 待加密的内容； dataEncoding: 内容编码; key: 秘钥； 
 *         keyEncoding: 秘钥编码； padding: 自动填充加密向量
 */
util.encrypt = function(data, dataEncoding, key, keyEncoding, padding) {
    let keyBuf = null;

    if (key instanceof Buffer) {
        keyBuf = key;
    } else {
        keyBuf = new Buffer(key, keyEncoding);
    }

    let dataBuf = null;
    if (data instanceof Buffer) {
        dataBuf = data;
    } else {
        dataBuf = new Buffer(data, dataEncoding);
    }

    let cipher = crypto.createCipheriv(_algorithm, keyBuf, ivBuffer);
    cipher.setAutoPadding(padding);
    let cipherData = cipher.update(dataBuf, 'buffer', 'base64');
    cipherData += cipher.final('base64');

    return cipherData;
};

/**
 * @desc:  解密
 * @param: data: 待解密的内容； dataEncoding: 内容编码; key: 秘钥； 
 *         keyEncoding: 秘钥编码； padding: 自动填充加密向量
 */
util.decypt = function(data, dataEncoding, key, keyEncoding, padding) {

    let keyBuf = null;
    if (key instanceof Buffer) {
        keyBuf = key;
    } else {
        keyBuf = new Buffer(key, keyEncoding);
    }

    let dataBuf = null;
    if (data instanceof Buffer) {
        dataBuf = data;
    } else {
        dataBuf = new Buffer(data, dataEncoding);
    }

    var decipher = crypto.createDecipheriv(_algorithm, keyBuf, ivBuffer);
    decipher.setAutoPadding(padding);
    var decipherData = decipher.update(dataBuf, 'binary', 'binary');
    decipherData += decipher.final('binary');
    var str3 = Buffer.from(decipherData, 'binary');

    return str3.toString('utf8');
};

module.exports = util;
