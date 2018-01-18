const phantomjs = require('phantomjs-prebuilt-that-works');
const path = require('path');

class Openload {
    getMedia(url){
        return new Promise((resolve, reject) => {
            const openloadUrl = url;
            const phScript = path.join(__dirname, 'scripts', 'phantom-openload.js');
            const phantom = phantomjs.exec(phScript, openloadUrl);
            phantom.stdout.on('data', (streamUrl) => {
                const urlStr = streamUrl.toString().trim();
                let vid = { url: `http://openload.co/stream/${urlStr}`, source: 'Strawberry'};
                resolve(vid);
            });
            
        })
    }
}

module.exports = Openload;