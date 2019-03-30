const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config')
require('./websocket');
//require('./redis');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes)

app.listen(config.app.port, function() {
  console.log('[ EXPRESS ] - REST Server up:', config.app.port)
})