const crypto = require('crypto');
const key = 'CRYPTO|KEY'

module.exports = class Crypto {
    static encrypt(str) {
        const cipher = crypto.createCipher('aes-256-cbc', key);
        let crypted = cipher.update(str, 'utf-8', 'hex')
        crypted += cipher.final('hex');

        return crypted;
    }
    static decrypt(str){
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        let decrypted = decipher.update(str, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    }
}