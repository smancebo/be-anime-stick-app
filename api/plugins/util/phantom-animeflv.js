var page = require('webpage').create();
var system = require('system'),
    videoUrl;
var settings = {
    mode: 'w',
    charset: 'UTF-8',
    encoding: 'UTF8'
};

if (system.args.length < 2) {
    console.error('No URL provided');
    phantom.exit(1);
}

videoUrl = system.args[1]

page.settings.userAgent = 'Mozilla/ 5.0(Linux; Android 6.0; LENNY3 Build/ MRA58K) AppleWebKit / 537.36(KHTML, like Gecko) Chrome/ 57.0.2987.132 Mobile Safari/ 537.36';
page.onInitialized = function () {
    page.evaluate(function () {
        delete window.callPhantom;
        delete window._phantom;
    });
};
page.onError = function (msg, trace) {
    //console.log(msg)
}
page.open(videoUrl, function (status) {

    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function (s) {

        var ev = page.evaluate(function () {

            return video;
          
        });
        console.log(JSON.stringify(ev))
        phantom.exit()
    });
});
