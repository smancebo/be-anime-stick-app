const phantomjs = require('phantomjs-prebuilt-that-works');
const path = require('path');

class RapidVideo{
    async getMedia(url){
        return new Promise((resolve, reject) => {
            const openloadUrl = url;
            const phScript = path.join(__dirname, 'scripts', 'phantom-rapidvideo.js');
            const phantom = phantomjs.exec(phScript, openloadUrl);
            phantom.stdout.on('data', (streamUrl) => {
                const urlStr = streamUrl.toString().trim();
                const match = urlStr.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                if(match && match.length > 0){
                    let vid = {url: match[0], source: 'Lime'};
                    resolve(vid);
                    phantom.kill('SIGINT');
                }
            });

        })
    }
}

module.exports = RapidVideo