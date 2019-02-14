const express = require('express')
const app = express()
require('./websocket')
const routes = require('./routes')
const config = require('./config')

//app.use(express.static('../frontend/build'))
app.use('/', routes)

app.listen(config.webserver.port, function() {
  console.log('Server listening on:', config.webserver.port)
})