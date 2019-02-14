const express = require('express')
const app = express()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
require('./websocket')
const routes = require('./routes')
const config = require('./config')

passport.use(new LocalStrategy(
  function(username, password, done) {
    //JUST TESTING...
    if(username === 'greg' && password == 'greg') {
      return done(null, 'greg')
    } else {
      return done(null, false, { message: 'Incorrect creds.' })
    }
  }
))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

//app.use(express.static('../frontend/build'))
app.use(passport.initialize());
app.use('/', routes)

app.listen(config.webserver.port, function() {
  console.log('Server listening on:', config.webserver.port)
})