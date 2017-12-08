const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/iku-app'
module.exports = class Client {
    static  connect() {
        return MongoClient.connect(url);
    }
}
