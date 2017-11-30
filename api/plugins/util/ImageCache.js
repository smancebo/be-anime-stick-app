const path = require('path');

const fs = require('fs');
const imgBase = path.join('..','..','cache', 'img')
const dirname = __dirname;
console.log(dirname);
class ImageCache {
    static Set(name, buffer){
        const filePath = path.resolve(path.join(dirname,imgBase, name))
    
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, buffer, (err) => {
                if(err){
                    resolve(undefined);
                    return ;
                }
                resolve(buffer);
            })
        })
    }

    static Get(name){
        return new Promise((resolve, reject) => {
            const filePath = path.resolve(path.join(dirname, imgBase, name))
            fs.readFile(filePath, (err, buffer) => {
                if(err){
                    resolve(undefined);
                    return;
                }
                resolve(buffer)
            })
        })
    }
}

module.exports = ImageCache;