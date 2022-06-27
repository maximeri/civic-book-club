if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const routes = require('./routes')
const port = 3000
const session = require('express-session')
const passport = require('./config/passport')
const SESSION_SECRET = 'secret'

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1', routes)
app.listen(port, () => console.log(`App is listening on port ${port}!`))

module.exports = app
