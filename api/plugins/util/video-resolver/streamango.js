const phantomjs = require('phantomjs-prebuilt-that-works');
const path = require('path');
class StreaMango {
    async getMedia(url) {
        return new Promise(async (resolve, reject) => {
            const openloadUrl = url;
            const phScript = path.join(__dirname, 'scripts', 'phantom-streamango.js');
            const phantom = phantomjs.exec(phScript, openloadUrl);
            phantom.stdout.on('data', (streamUrl) => {
                const urlStr = streamUrl.toString().trim();
                    let vid = { url: urlStr, source: 'Mango' };
                    resolve(vid);
                    phantom.kill('SIGINT');
            });
        })
    }
}

module.exports = StreaMango