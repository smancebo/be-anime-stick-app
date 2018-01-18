
const crypto = require('../crypto');

const Openload = require('./openload');
const RapidVideo = require('./rapidvideo');
const StreaMango = require('./streamango');

const OPEN_LOAD = {key: 'openload', resolver: Openload, flavor: 'Strawberry'};
const RAPID_VIDEO = { key: 'rapidvideo', resolver: RapidVideo, flavor: 'Lime'};
const STREAMANGO = { key: 'streamango', resolver: StreaMango, flavor: 'Mango'};
const YOUR_UPLOAD = { key: 'yourupload', resolver: ''};
const IZANAGI = {key: 'izanagi', resolver: '' };
const EFIRE = { key: 'efire.php', resolver: ''} ;

const Providers = [
    OPEN_LOAD,
    RAPID_VIDEO,
    STREAMANGO
]

class Resolver {

    
    async getMedia(url){
        const resolver = this.getResolver(url);
        return await resolver.getMedia(url);
    }

    parseMediaSources(sources){
        var mediaFlavors = [];

        for(let provider of Providers){
            const url = sources.filter((u) => u.indexOf(provider.key) !== -1)[0]
            if (url){
                mediaFlavors.push({
                    flavor: provider.flavor,
                    url: crypto.encrypt(url)
                })
            }   
        }

        return mediaFlavors;
    }

    getResolver(u){
        const url = new mediaURL(u);
        for(let provider of Providers){
            if(url.isFromProvider(provider.key)){
                return new provider.resolver();
            }
        }
        return undefined;
    }
    
}

class mediaURL{
    constructor(url){
        this.url = url;
    }

    isFromProvider(provider) {
        if (this.url.indexOf(provider) !== -1) {
            return true
        } else {
            return false;
        }
    }
}

module.exports = Resolver;