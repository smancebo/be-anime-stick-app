
const router = require('express').Router();
const plugin = new (require('./plugins/jkanime'))

router.get('/search/:str', async (req, res) => {
    res.json(await plugin.search(req.params.str));
});

router.get('/episodes', async (req, res) => {
    res.json(await plugin.getEpisodes(req.query.l))
})

router.get('/view', async (req, res) => {
    res.json(await plugin.getEpisodeVideo(req.query.l))
})

module.exports = router;