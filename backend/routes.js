const express = require('express')
const passport = require('passport')
const router = new express.Router();
const redisUtils = require('./redisUtils.js')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

router.get('/key/:key/:start?/:end?', async (req, res) => {  
    console.log(req.params.key)
    let data = await redisUtils.getHashsFromSet(req.params.key, req.params.start, req.params.end)
    console.log(data)
    res.json(data)
})

router.get('/window/:key/:window', async (req, res) => {  
    let data = await redisUtils.getHashsFromSet(req.params.key, req.params.window * -1, -1)
    res.json(data)
})

router.get('/allkeys', async (req, res) => {  
    let data = await redisUtils.getHashsFromSet(req.params.key, req.params.start, req.params.end)
    res.json(data)
})

router.post('/key', jsonParser, (req, res) => {
    console.log(req.body)
    res.send('OK')
   // redisUtils.addHashUpdateSet()
})

router.post('/update',
    passport.authenticate('basic', { session: false }),
    jsonParser,
    (req, res) => {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        //res.redirect('/users/' + req.user.username);
        console.log('>>>>>>AUTHENTICATED>>>>')
        //console.log(req.body)

        const data = req.body;

        Object.keys(data).map(key => {
            console.log('key:', key)
            
            if(data[key].set && data[key].hashkey) {
                let arr = Object.entries(data[key])
                redisUtils.redis.hmset(data[key].hashkey, arr.flat())
                console.log('hash added:', data[key].hashkey)
                
                redisUtils.redis.zadd(data[key].set, data[key].hashkey, parseFloat(data[key].timestamp))
                console.log('set added:', data[key].set)

                //r.zadd(set + '-set', hashkey, timestamp )
            }

            console.log('sortedset:', data[key].set)
            
        })


        res.end()
    })

// router.post('/', jsonParser, (req, res) => {
//     console.log(req.body)
//     res.send('OK')
//    // redisUtils.addHashUpdateSet()
// })

module.exports = router