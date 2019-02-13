const config = {
  webserver: {
    port: 4000
  },
  websocket: {
    port: 8080,
  },
  db: {
    name: '',
    collection: '',
    host: '127.0.0.1',
    port: 27017,
  },
  redis: {
    port: 6379,
    host: 'localhost',
  }
}

module.exports = config;
