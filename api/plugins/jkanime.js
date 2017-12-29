

const request = require('../modules/request-handler');
const phantomjs = require('phantomjs-prebuilt-that-works');
const cheerio = require('cheerio');
const path = require('path');
const crypto = require('./util/crypto');
const ImageCache = require('./util/ImageCache');
class JkAnime {
    async search(str) {
        let strSearch = str.replace(/\s/g, '+')
        const response = await request.get(`http://www.jkanime.co/Buscar?s=${strSearch}`).catch((err) => {
            throw err;
        });
        const $ = cheerio.load(response.body);

        let found = [];
        $('.anime_movies_items').each((i, elem) => {
            const element = $(elem).find('a');

            let anime = {};
            anime.id = found.length;
            anime.title = element.attr('title');
            anime.link = crypto.encrypt(element.attr('href'));
            anime.image = crypto.encrypt(element.find('img').attr('src'));

            found.push(anime);
        });
        // const parseImages = (results) => {
           
        //     const items = results.map(async (elem) => {
        //         const { title, link, id, image } = elem;
        //         return { title, link, id, image };
        //     });

        //     return items;
        // }
        //found = await Promise.all(parseImages(found))
        return found;
    }

    async image(url) {
        const defUrl = crypto.decrypt(url);
        const filename = path.basename(defUrl);
        let imgBuffer = null;

        const cacheBuffer = await ImageCache.Get(path.basename(defUrl));
        
        if(cacheBuffer === undefined) {
            const body = await request.linkImage(crypto.decrypt(url));
            imgBuffer = new Buffer(body);
            ImageCache.Set(filename, imgBuffer);
            return imgBuffer;
        }
        
        return new Buffer(cacheBuffer);
    }

    async getEpisodes(link) {
        const response = await request.get(crypto.decrypt(link))
        const $ = cheerio.load(response.body);

        let episodes = [];
        $("#episode_related > li").each((e, elem) => {
            const element = $(elem).find('a');

            let episode = {};
            episode.id = episodes.length;
            episode.name = element.html().trim();
            episode.link = crypto.encrypt(element.attr('href'));

            episodes.push(episode);
        });

        return episodes;
    }

    async getEpisodeVideo(link) {
        const response = await request.get(crypto.decrypt(link));
        const $ = cheerio.load(response.body);

        const frameUrl = $('iframe', '#player').attr('src');

        const frameResponse = await request.get(frameUrl)
        const $frame = cheerio.load(frameResponse.body);

        const video = $frame('video');

        return new Promise((resolve, reject) => {
            let vid = {
                url: ''
            };
            if (video.length > 0) {
                //we found a video tag
                vid.url = video.find('source').attr('src');
                resolve(vid);

            } else { //openload
                const openloadUrl = $frame('iframe', '#amzp').attr('src');
                const phScript = path.join(__dirname, 'util', 'phantom.js');
                const phantom = phantomjs.exec(phScript, openloadUrl);
                phantom.stdout.on('data', (streamUrl) => {
                    const urlStr = streamUrl.toString().trim();
                    vid.url = `http://openload.co/stream/${urlStr}`;
                    resolve(vid);
                });
            }
        });
    }
}

module.exports = JkAnime;