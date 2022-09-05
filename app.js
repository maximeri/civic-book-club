if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const routes = require('./routes')
const port = process.env.PORT || 3000
const session = require('express-session')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})
app.use(routes)
app.use(express.static('client/src/'))
app.use(express.static('client/public/'))

// Socket.io
app.get('/publicRoom.html', (req, res) => { 
  res.sendFile(__dirname + '/client/public/room.html')
})

app.get('/privateRoom.html', (req, res) => { 
  res.sendFile(__dirname + '/client/public/message.html') 
})

server.listen(port, () => console.log(`App is listening on port ${port}!`))

module.exports = app
require('./server.js')(server)