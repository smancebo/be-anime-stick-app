const cloudscraper = require('cloudscraper');
const request = require('request');


class Request {
    get(url, notCloudfare) {
        const not_cloudfare = notCloudfare || false;

        return new Promise((resolve, reject) => {
            const handleRequest = (err, res, body) => {
                
                if (err) {
                    reject(err);
                    return;
                    
                } else {
                    resolve({
                        res,
                        body
                    });
                }
            }
            if (!not_cloudfare) {
                cloudscraper.get(url, handleRequest)
            } else {
                request.get(url, handleRequest);
            }
        })
    }
    linkImage(url) {
        return new Promise((resolve, reject) => {
            cloudscraper.request({
                method: 'GET',
                encoding: null,
                url
            }, (err, res, body) => {
                if (!err && res.statusCode === 200) { 
                    resolve((body));
                } else {
                    reject(err);
                }
            })
        })
    }
    getImage(url) {
        return new Promise((resolve, reject) => {
            cloudscraper.request({
                method: 'GET',
                encoding: null,
                url
            }, (err, res, body) => {
                if (!err && res.statusCode === 200) {
                    const base64Buffer = new Buffer(body).toString('base64');
                    const contentType = res.headers['content-type'];
                    const data = `data:${contentType};base64,${base64Buffer}`;
                    resolve(data);
                } else {
                    reject(err);
                    throw err;
                }
            })
        })
    }
}



module.exports = new Request();