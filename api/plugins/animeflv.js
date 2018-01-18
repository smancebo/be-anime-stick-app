const request = require('../modules/request-handler');
const r = require('request');
const phantomjs = require('phantomjs-prebuilt-that-works');
const cheerio = require('cheerio');
const path = require('path');
const crypto = require('./util/crypto');
const ImageCache = require('./util/ImageCache');
const baseUrl = 'http://www.animeflv.net';
const Resolver = require('./util/video-resolver/resolver');
class AnimeFLV {


    async search(str) {
        //TODO: Add pagination from source
        let strSearch = str.replace(/\s/g, '+')
        const response = await request.get(`${baseUrl}/browse?q=${strSearch}`, true).catch((err) => {
            throw err;
        });
        const $ = cheerio.load(response.body);

        let found = [];
        $('.Anime.alt.B').each((i, elem) => {
            const element = $(elem).find('a');
            const description = $($(elem).find('.Description').find('p')[1]).text();

            let anime = {};
            anime.id = found.length;
            anime.title = element.find('.Title').text();
            anime.link = crypto.encrypt(`${baseUrl}${element.attr('href')}`);
            anime.image = crypto.encrypt(`${baseUrl}${element.find('img').attr('data-cfsrc')}`);
            anime.description = description
            anime.type = element.find('.Type').text();

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

        if (cacheBuffer === undefined) {
            const body = await request.linkImage(crypto.decrypt(url), true);
            imgBuffer = new Buffer(body);
            ImageCache.Set(filename, imgBuffer);
            return imgBuffer;
        }

        return new Buffer(cacheBuffer);
    }

    async getEpisodes(link) {
        const response = await request.get(crypto.decrypt(link))
        const $ = cheerio.load(response.body);
        const listEpisode = $(".ListEpisodes > li");
        const listCaps = $(".ListCaps > li");
        let episodes = [];
        if (listEpisode.length > 0) {
            listEpisode.each((e, elem) => {
                const element = $(elem).find('a');

                let episode = {};
                episode.id = episodes.length;
                episode.name = element.text().trim();
                episode.link = crypto.encrypt(`${baseUrl}${element.attr('href')}`);

                episodes.push(episode);
            });
        } else {
            listCaps.each((e, elem) => {
                const element = $(elem).find('a');
                let episode = {};
                episode.id = episodes.length;
                episode.name = element.find('p').text().trim();
                episode.link = crypto.encrypt(`${baseUrl}${element.attr('href')}`)

                episodes.push(episode)
            })
        }

        return episodes;
    }

    async getEpisodeVideo(link) {

        const getSources = (l) => new Promise(async (resolve, reject) => {
            const episodeUrl = crypto.decrypt(l).replace('http://', 'https://')
            const phScript = path.join(__dirname, 'util', 'phantom-animeflv.js');
            const phantom = phantomjs.exec(phScript, episodeUrl);
            phantom.stdout.on('data', (videoArray) => {
                resolve(JSON.parse(videoArray));
            });
        })

        const urls = await getSources(link);
        const mediaResolver = new Resolver();
        return mediaResolver.parseMediaSources(urls);

    }

    getFlavorVideo(link){
        
        const mediaResolver = new Resolver();
        return mediaResolver.getMedia(crypto.decrypt(link))
        
    }

    async getLastUpdates() {
        try {
            const response = await request.get(baseUrl).catch((err) => {
                throw err;
            });

            const $ = cheerio.load(response.body);
            let found = [];
            $('.ListEpisodios > li').each((i, elem) => {
                let anime = {};
                const element = $(elem).find('a');
                // const reg = new RegExp(/background:\surl\('(.+)'\)/);
                // const image = reg.exec(element.find('.thumbnail-recent_home').attr('style'))[1];

                anime.id = found.length;
                anime.name = element.find('.Title').text();
                anime.link = crypto.encrypt(`${baseUrl}${element.attr('href')}`);
                anime.image = crypto.encrypt(`${baseUrl}${element.find('img').attr('src')}`)
                anime.episode = element.find('.Capi').text();

                found.push(anime);
            })

            return found;
        } catch (ex) {
            return [];
        }
    }

    async getEpisodeOpenload(link) {
        return request.withOptions({
            followAllRedirects: true,
            timeout: 3000,
            url: link
        })


        // const $ = cheerio.load(response.body);
        // const url = $('#streamurj').html();
        // return url;

    }
}

module.exports = AnimeFLV;