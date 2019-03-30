// routes/index.js
const router = require('express').Router();

const {
  getHashsFromSet,
  getHashsFromSetByScore } = require('./middleware');
  
router.post('/gethashesfromset',
  getHashsFromSet
)

router.post('/gethashesfromsetbyscore',
  getHashsFromSetByScore
)

router.post('/ping', (req, res) => { res.send('PONG') })
  
module.exports = router