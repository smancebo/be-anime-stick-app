
const router = require('express').Router();
const plugin = new (require('./plugins/jkanime'))

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
    res.end(await plugin.image(req.params.img), 'binary');
})

module.exports = router;