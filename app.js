if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server)
const formatMessage = require('./utils/messages')
const botName = 'Book Bot'
const botImg = 'https://img.freepik.com/premium-vector/cute-robot-icon-illustration-techology-robot-icon-concept-isolated-flat-cartoon-style_138676-1219.jpg?w=1380'
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const routes = require('./routes')
const port = process.env.PORT || 3000
const session = require('express-session')
const passport = require('./config/passport')
const SESSION_SECRET = 'secret'
const { getUser } = require('./helpers/auth-helpers')

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})
app.use('/api/v1', routes)
app.use(express.static('public'))

// Socket.io
app.get('/publicRoom.html', (req, res) => { 
  res.sendFile(__dirname + '/public/room.html')
})

app.get('/privateRoom.html', (req, res) => { 
  res.sendFile(__dirname + '/public/message.html') 
})

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room, avatar }) => {
    const user = userJoin(socket.id, username, room, avatar)
    socket.join(user.room)
    // welcomt current user
    if (user.room === 'public') {
      socket.emit("message", formatMessage(botName, "Welcome to chat room!", botImg))
    }
    // Send  users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    })
    // Broadcast when a user connect
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`, botImg)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    })
    // Listen for public message
    socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg, user.avatar));
    })
    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`,botImg)
        );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    })
  })
})

server.listen(port, () => console.log(`App is listening on port ${port}!`))

module.exports = app