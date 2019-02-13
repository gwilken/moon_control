const redisClient = require('./redis.js')
const { promisify } = require('util')
const asyncIncr = promisify(redisClient.incr).bind(redisClient)
const zrange = promisify(redisClient.zrange).bind(redisClient)
const zrevrange = promisify(redisClient.zrevrange).bind(redisClient)
const asyncHget = promisify(redisClient.hget).bind(redisClient)
const asyncHgetall = promisify(redisClient.hgetall).bind(redisClient)
// const redisGet = promisify(redisClient.get).bind(redis)
//let test = await redisLrange(req.params.key, req.params.start, req.params.end)

const getHash = async (hashKey) => {
    let hash = await asyncHget()
}

// def add_hash_update_set(set, values, expire):
//     timestamp = int(time.time())
//     values['timestamp'] = timestamp
//     values['parent'] = set
//     hashkey = set + '-hash-' + str(timestamp)
  
//     try:
//         r.zadd(set + '-set', hashkey, timestamp )
//         r.hmset(hashkey, values)
//         r.expire(hashkey, expire)

//     except Exception as e:
//         print('Error setting Redis keys:', e)

const addHashUpdateSet = (obj) => {
    console.log(obj)
}

const recordEvent = async (event) => {
    let timestamp = Date.now()

    event.id = `${event.type}-${await asyncIncr('counter')}`
    event.timestamp = timestamp
    redisClient.hmset(event.id, event)

    redisClient.zadd(event.type, timestamp, event.id)
}

const getZrevrange = (key, window) => {
    return new Promise( async (resolve, reject) => {
        let list = await zrevrange(key, 0, window)

      //  console.log(key, list)

        let res = list.map(async (zkey) => {
            return await asyncHgetall(zkey)
        })

        Promise.all(res).then( (docs) => {
            resolve(docs)
        })
    })
}

const getHashsFromSet = (type, min = -30, max = -1) => {
    return new Promise( async (resolve, reject) => {
        let list = await zrange(type, min, max)

       // console.log(type, list)

        let res = list.map(async (key) => {
            return await asyncHgetall(key)
        })

        Promise.all(res).then( (docs) => {
            resolve(docs)
        })
    })
}

const getEventField = (type, field, min = 0, max = 100) => {
    return new Promise (async (resolve, reject) => {
        let list = await zrange(type, min, max)

        let res = list.map(async key =>  await asyncHget(key, field))

        Promise.all(res).then(docs => resolve(docs))
    })
}


const getEventFieldAndTimestamp = (type, field, min = 0, max = 100) => {
    return new Promise (async (resolve, reject) => {
        let list = await zrange(type, min, max)

        let res = list.map(async (key) => {
            let value = await asyncHget(key, field)
            let timestamp = await asyncHget(key, 'timestamp')
            return { value, timestamp }
        })

        Promise.all(res).then(docs => resolve(docs))
    })
}

module.exports = { addHashUpdateSet, redisClient, getZrevrange, recordEvent, getHashsFromSet, getEventField, getEventFieldAndTimestamp }
