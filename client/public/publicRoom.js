var socket = io()
var form = document.getElementById('form');
var input = document.getElementById('input');
let params = new URLSearchParams(document.location.search)
// Get username, room, avatar, and userId from URL
const username = params.get("username")
const room = params.get("room")
const avatar = params.get("avatar")
const apiHost = '34.202.109.95'
const port = '3000'
const baseUrl = `http://${apiHost}:${3000}/api/v1`

// Join chatroom
socket.emit('joinRoom', { username, room, avatar })

// Get rooms and users
socket.on('roomUsers', ({ users }) => {
  outputUsers(users)
})

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
});


// Message submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    let msg = input.value
    // emit public message to the server
    socket.emit('chatMessage', msg)
    window.scrollTo(0, document.body.scrollHeight);
    input.value = '';
  }
})

// output message to DOM
function outputMessage(message) {
  var li = document.createElement('li')
  li.classList.add("clearfix")
  li.innerHTML = `
  <div class="message-data">
   <img src="${message.avatar}" alt="avatar">
  <span>${message.username}</span>
                  <span class="message-data-time">${message.time}</span>
                </div>
                <div class="message my-message"> ${message.text}
                </div>
  `
  messages.appendChild(li)
}

// output users to DOM
function outputUsers(users) {
  const ul = document.getElementById('userList')
  ul.innerHTML = '' // clear the user list first
  // add uers
  users.forEach((user) => {
    ul.innerHTML += `
  <li class="clearfix">
  <img src="${user.avatar}" alt="avatar">
              <div class="about">
                <div class="name">${user.username}</div>
                <div class="status"> <i class="fa fa-circle online"></i> online </div>
              </div>
  </li>
  `
  })
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});