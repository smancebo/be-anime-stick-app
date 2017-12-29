
const router = require('express').Router();
const accountController = require('./account/controller');

const plugin = new (require('./plugins/jkanime'))
const request = require('request');
const fs = require('fs');
const remote = require('remote-file-size');


router.use('/account', accountController);

router.get('/search/:str?', async (req, res) => {
    res.json(await plugin.search(req.params.str).catch((err) => {
        res.json(err);
    }));
});

router.get('/episodes/:show', async (req, res) => {
    res.json(await plugin.getEpisodes(req.params.show))
})

router.get('/view/:episode', async (req, res) => {
    res.json(await plugin.getEpisodeVideo(req.params.episode))
})
router.get('/image/:img', async (req, res) => {
    res.writeHead(200, { 'Content-type': 'image/jpg' })
    res.end(await plugin.image(req.params.img), 'binary');
})

router.get('/watch', (req, res) => {
    const { video } = req.query;
    res.writeHead(200, { 'Content-type': 'video/mp4' });
    request(video).pipe(res).on('error', (e) => {
        console.log(e)
    })
})

router.get('/size', (req, res) => {
    const {video} = req.query;
    remote(video, (err, o) => {
        res.json({size: o});
    })

});

router.get('/video', (req, res) => {
    const { video } = req.query;
    const name = `${new Date().getTime()}.mp4`;
    const filePath = `${__dirname}/cache/video/${name}`;

    const videoFile = fs.createWriteStream(filePath)
    // videoFile.on('data', (chunk) => {
    //    res.writeHead(200, {'Content-Type' : 'video/mp4'})
    //    res.send(chunk);
    // })
    request(video).pipe(videoFile);
    videoFile.on('pipe', () => {
        console.log('someone is piping')
    });

    const nfile = fs.createReadStream(filePath);
    nfile.on('readable', () => {
        fs.stat(filePath, (err, stats) => {
            const { size } = stats;
            if (size > 0) {


                if (err) {
                    return res.status(404).end();
                }
                const { range } = req.headers

                const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
                const end = size - 1;
                const chunkSize = (end - start) + 1;

                res.set({
                    'Content-Range': `bytes ${start}-${end}/${size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4'
                })
                res.status(206);
                const readable = fs.createReadStream(filePath, { start: start, end: end })
                readable.on('open', () => readable.pipe(res))
                readable.on('close', () => fs.unlinkSync(filePath));
                readable.on('error', (streamErr) => { res.end(streamErr); fs.unlinkSync(filePath) });
            }
            res.status(206).end()
        })
    })




})

module.exports = router;