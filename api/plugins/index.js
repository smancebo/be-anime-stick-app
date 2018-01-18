const jkanime = require('./jkanime');
const animeflv = require('./animeflv');
const JKANIME = new jkanime();
const ANIME_FLV = new animeflv();


const plugins = {
    JKANIME,
    ANIME_FLV
}

exports.PLUGINS = plugins
exports.get = (req) => {
    const plugin = req.headers['plugin'] || undefined;
    if(plugin === undefined){
        return plugins.JKANIME
    } else {
        return plugins[plugin];
    }
}
exports.getAvailablePlugins = () => {
    return Object.keys(plugins);
}