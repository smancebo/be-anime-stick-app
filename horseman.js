const Horseman = require('node-horseman');
const horseman = new Horseman();

horseman
.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://player.jkanime.co/?id=4802&ep_id=4802&anime=dragon-ball-kai&episode=episodio-6')
    .attribute('video', 'src')
    .log() // prints out the number of results
    .close();