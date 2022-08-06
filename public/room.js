var socket = io()
var form = document.getElementById('form');
var input = document.getElementById('input');
let params = new URLSearchParams(document.location.search);
let username = params.get("username")
let avatar = params.get("avatar")
let userInfo = {username, avatar}

// chat room
document.addEventListener('DOMContentLoaded', () => {
  socket.emit('userInfo', userInfo)
})

socket.on('userInfo', (userInfo) => {
  outputUser(userInfo)
})

  socket.on('message', function (msg) {
    console.log(msg)
    outputMessage(msg)
  })

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const data = { username, msg: input.value, avatar }
    // emit chat message to the server
    socket.emit('chat message', data)
    window.scrollTo(0, document.body.scrollHeight);
    input.value = '';
  }
})

// output message
function outputMessage(msg) {
  var message = document.createElement('li')
  message.classList.add("clearfix")
  message.innerHTML = `
  <div class="message-data">
   <img src="${msg.avatar}" alt="avatar">
  <span>${msg.username}</span>
                  <span class="message-data-time">${msg.time}</span>
                </div>
                <div class="message my-message"> ${msg.text}
                </div>
  `
  messages.appendChild(message)
}

// output user info
function outputUser(userInfo) {
  var user = document.createElement('li')
  user.classList.add("clearfix")
  user.innerHTML = `
  <img src="${userInfo.avatar}" alt="avatar">
              <div class="about">
                <div class="name">${userInfo.username}</div>
                <div class="status"> <i class="fa fa-circle online"></i> online </div>
              </div>
  `
  users.appendChild(user)
}