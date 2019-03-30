const WebSocket = require('ws');
const config = require('../config')
const RedisSub = require('../redis/RedisSubscriber')
const redis = require('redis')
const log = require('../utils/log')

const wss = new WebSocket.Server({ port: config.ws.port });
log('[ WEBSOCKET ] - WS Server up:', config.ws.port)


const closeConnection = (client) => {
  log('[ WEBSOCKET ] - Closing client.')
  client.send('Closing connection.')
  client.close()
}



const parseMessage = (str, wsClient, redisClient) => {
  try {
    let json = JSON.parse(str) || {}

    if (json.message.key && json.message.type) {

      switch (json.message.type) {
        case 'subscribeToKey':
         // log('subtokey')

            let redisSubKey = new RedisSub()

            redisSubKey.subscribeToKey(json.message.key);

            redisSubKey.onKeyChange( (key, event) => {
              redisClient.get(key, (err, value) => {
                if (err) {
                  wsClient.send(JSON.stringify({
                    type: 'error',
                    timestamp: Date.now(),
                    message: err
                  }))
                } else { 
                  wsClient.send(JSON.stringify({
                    message: {
                      key,
                      event,
                      value,
                      timestamp: Date.now(),
                      type: 'keyChanged',
                    }
                  }))
                }
              })
            }) 
        break;
        
        case 'subscribeToSeries':
         // log('subscribeToSeries')
        
            try {
              let redisSubTimeseries = new RedisSub()

              redisSubTimeseries.subscribeToKey(json.message.key);

              redisSubTimeseries.onKeyChange( (key, event) => {
              
                redisClient.zrange(key, -1, -1, 'WITHSCORES', (err, val) => {
                  let [hashkey, keyAsTimestamp] = val
                  log('timestamp:', keyAsTimestamp, 'hashkey:', hashkey) 
                
                  redisClient.hgetall(hashkey, (err, hashVal) => {
                  log('hash:', hashVal)

                    let data = {
                      message: {
                        key,
                        event,
                        hashkey,
                        hashVal,
                        keyAsTimestamp,
                        timestamp: Date.now()
                      }
                    }
                    
                    wsClient.send(JSON.stringify(data))

                  })
                })
              })
            } catch (err) {
             // log('[ WEBSOCKET ] - Error subscribeToSeries:', err)
            }   
        break;

        case 'subscribeToEvent':
          if(json.message.event) {
            let redisSubEvent = new RedisSub()

            redisSubEvent.subscribeToEvent(json.message.event)
            
            redisSubEvent.onEventChange( (event, key) => {
              wsClient.send(`${event}, ${key}`)
            })

          }
        }
    }
  } catch (err) {
    log('[ WEBSOCKET ] - ERROR parsing json:', err)
  }
}


wss.on('connection', async (wsClient, req) => {
  let wsOrigin = req.headers.origin;

  log('[ WEBSOCKET ] - Client attempting to connect:', wsOrigin)

  let redisClient = redis.createClient(config.redis.port, config.redis.host)

  wsClient.on('message', (msg) => {
    parseMessage(msg, wsClient, redisClient)
  })  
});