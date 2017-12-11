
const router = require('express').Router();
const accountController = require('./account/controller');

const plugin = new (require('./plugins/jkanime'))
const request = require('request');


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
    res.writeHead(200, {'Content-type' : 'image/jpg'})
    res.end(await plugin.image(req.params.img), 'binary');
})

router.get('/watch', (req, res) => {
    const { video } = req.query;
    request(video).pipe(res)
})

module.exports = router;