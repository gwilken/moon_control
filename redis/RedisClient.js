// redis/RedisClient.js
const redis = require('redis')
const { promisify } = require('util')
const config = require('../config')

class RedisClient {
  constructor() {
    this.client = redis.createClient(config.redis.port, config.redis.host)
    this.zrange = promisify(this.client.zrange).bind(this.client)
    this.zrangebyscore = promisify(this.client.zrangebyscore).bind(this.client)
    this.zrevrange = promisify(this.client.zrevrange).bind(this.client)
    this.asyncHget = promisify(this.client.hget).bind(this.client)
    this.asyncHgetall = promisify(this.client.hgetall).bind(this.client)
    this.client.config("SET", "notify-keyspace-events", "KEA");
    this.keyChangeCb = () => {}
    this.eventChangeCb = () => {}

    this.client.on('message', (channel, message) => {
      let [ type, data] = channel.split(':')

      switch (type) {
        case '__keyspace@0__':
          this.handleKeyChange(data, message)
        break;
        
        case '__keyevent@0__':
          this.handleEventChange(data, message)
        break;
      }
    })
  }

  get(key) {
    return this.client.get(key)
  }

  getHashsFromSet (set, start = -30, end = -1) {
    return new Promise( async (resolve, reject) => {
        let list = await this.zrange(set, start, end)

        let res = list.map(async (key) => {
          return await this.asyncHgetall(key)
        })

        Promise.all(res).then( (docs) => {
          resolve(docs)
        })
    })
  }

  getHashsFromSetByScore (set, start, end) {
    return new Promise( async (resolve, reject) => {
        let list = await this.zrangebyscore(set, start, end)

        let res = list.map(async (key) => {
          return await this.asyncHgetall(key)
        })

        Promise.all(res).then( (docs) => {
          resolve(docs)
        })
    })
  }

  subscribeToKey (key) {
    this.client.subscribe(`__keyspace@0__:${key}`)
  }
  
  subscribeToEvent (event) {
    this.client.subscribe(`__keyevent@0__:${event}`)
  }

  handleKeyChange (key, event) {
    this.keyChangeCb(key, event)
  }

  handleEventChange (event, key) {
    this.eventChangeCb(event, key)
  }

  onKeyChange(cb) {
    this.keyChangeCb = cb
  }
  
  onEventChange(cb) {
    this.eventChangeCb = cb
  }

  quit() {
    this.client.quit()
  }
}

module.exports = RedisClient;