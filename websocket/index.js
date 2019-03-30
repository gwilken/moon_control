const WebSocket = require('ws');
const config = require('../config')
const RedisSub = require('../redis/RedisSubscriber')
const redis = require('redis')
const log = require('../utils/log')


//TODO: refactor as class, check connection status before send, create unsubscribe

const wss = new WebSocket.Server({ port: config.ws.port });
log('[ WEBSOCKET ] - WS Server up:', config.ws.port)


wss.on('connection', async (wsClient, req) => {
  let wsOrigin = req.headers.origin;

  log('[ WEBSOCKET ] - Client attempting to connect:', wsOrigin)

  let redisClient = redis.createClient(config.redis.port, config.redis.host)
  let redisSub = new RedisSub()


  const parseMessage = (str) => {
    try {
      let json = JSON.parse(str) || {}
  
      if (json.message.key && json.message.type) {
  
        switch (json.message.type) {
          case 'subscribeToKey':
            try {
              redisSub.subscribeToKey(json.message.key);
  
              redisSub.onKeyChange( (key, event) => {

                let msg
                redisClient.get(key, (err, value) => {
                  if (err) {
                    msg = JSON.stringify({
                      type: 'error',
                      timestamp: Date.now(),
                      message: err
                    })

                    wsClient.send(msg, (err) => {
                      if (err) {
                        console.log ('[ WEBSOCKET ] - Send Error.', err)
                      }
                    })

                  } else {
                    msg = JSON.stringify({
                      message: {
                        key,
                        event,
                        value,
                        timestamp: Date.now(),
                        type: 'keyChanged',
                      }
                    })
                    wsClient.send(msg, (err) => {
                      if (err) {
                        console.log ('[ WEBSOCKET ] - Send Error.', err)
                      }
                    })
                  }
                })
              })
            }

            catch (err) {
              log('[ WEBSOCKET ] - Error subscribeToKey')
            }
          break;
          
          case 'subscribeToSeries':
           // log('subscribeToSeries')
          
              try {
                redisSub.subscribeToKey(json.message.key);
  
                redisSub.onKeyChange( (key, event) => {
                
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
                log('[ WEBSOCKET ] - Error subscribeToSeries:', err)
              }   
          break;
  
          case 'subscribeToEvent':
            if(json.message.event) {

              try {
                redisSub.subscribeToEvent(json.message.event)
                
                redisSub.onEventChange( (event, key) => {
                  wsClient.send(`${event}, ${key}`)
                })
              }

              catch (err) {
                log('[ WEBSOCKET ] - Error subscribeToEvent:', err)
              }
            }
          }
      }
    } catch (err) {
      log('[ WEBSOCKET ] - ERROR parsing json:', err)
    }
  }


  wsClient.on('message', (msg) => {
    parseMessage(msg)
  })
  
  
  wsClient.on('close', () => {
    log('[ WEBSOCKET ] - Client connection closed.')
    redisSub.quit()
    redisClient.quit()
  })

});