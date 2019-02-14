const express = require('express')
const router = new express.Router();
const redis = require('./redisUtils.js')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

router.get('/key/:key/:start?/:end?', async (req, res) => {  
    console.log(req.params.key)
    let data = await redis.getHashsFromSet(req.params.key, req.params.start, req.params.end)
    console.log(data)
    res.json(data)
})

router.get('/window/:key/:window', async (req, res) => {  
    let data = await redis.getHashsFromSet(req.params.key, req.params.window * -1, -1)
    res.json(data)
})

router.get('/allkeys', async (req, res) => {  
    let data = await redis.getHashsFromSet(req.params.key, req.params.start, req.params.end)
    res.json(data)
})

router.post('/key', jsonParser, (req, res) => {
    console.log(req.body)
    res.send('OK')
   // redis.addHashUpdateSet()
})

router.post('/', jsonParser, (req, res) => {
    console.log(req.body)
    res.send('OK')
   // redis.addHashUpdateSet()
})

module.exports = router