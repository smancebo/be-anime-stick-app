var page = require('webpage').create();
var fs = require('fs');
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
page.onError = function(msg, trace) {
   return;
}
page.open(videoUrl, settings, function (status) {
    if (status === "success") {

        var a = page.evaluate(function () {
            return {
                decoded_id: document.getElementById('streamurl').innerHTML
            };
            
        });
       
        console.log(a.decoded_id);
        phantom.exit();
    }
});