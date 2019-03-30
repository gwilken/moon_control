const redis = require('redis')
const RedisClient = require('../redis/RedisClient.js')


const getHashsFromSet = async (req, res, next) => {
  let {set, start, end} = req.body
  let redisClient = new RedisClient()
  let docs = await redisClient.getHashsFromSet(set, start, end)
  redisClient.quit()
  res.json(docs)
}


const getHashsFromSetByScore = async (req, res, next) => {
  let {set, start, end} = req.body
  let redisClient = new RedisClient()
  let docs = await redisClient.getHashsFromSetByScore(set, start, end)
  redisClient.quit()
  res.json(docs)
}


module.exports = { 
  getHashsFromSet,
  getHashsFromSetByScore
}