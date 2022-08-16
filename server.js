module.exports = (server)=> {
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
  } = require("./utils/users")

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
            formatMessage(botName, `${user.username} has left the chat`, botImg)
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
}