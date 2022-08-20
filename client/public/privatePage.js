var socket = io()
var form = document.getElementById('form');
var content = document.getElementById('content');
let params = new URLSearchParams(document.location.search);
let username = params.get("username")
let avatar = params.get("avatar")
let userId = params.get("userId")
let user2Id = ''
let room = params.get("room")
const apiHost = 'localhost'
const port = '3000'
const baseUrl = `http://${apiHost}:${3000}/api/v1`
const token = localStorage.getItem('access_token')
const config = {
  headers: { Authorization: `Bearer ${token}` }
}

// Join chatroom
socket.emit('joinRoom', { username, room, avatar })

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);
});


// Message submit
form.addEventListener('submit', (e) => {
  e.preventDefault()
  // Post message to DB
  const formData = new FormData(form)
  const payload = new URLSearchParams(formData)
  // Post the payload using Fetch:
  fetch(`${baseUrl}/sockets/rooms/${userId}/${user2Id}`, {
    method: 'POST',
    body: payload,
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
  if (content.value) {
    let msg = content.value
    // emit public message to the server
    socket.emit('chatMessage', msg)
    window.scrollTo(0, document.body.scrollHeight);
    content.value = '';
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

function requestRooms() {
  let params = new URLSearchParams(document.location.search)
  let userId = parseInt(params.get("userId"), 10)
  const rooms = []
  axios.get(`${baseUrl}/sockets/rooms/${userId}`, config)
    .then((response) => {
      rooms.push(...response.data)
      renderRooms(rooms)
    })
    .catch((err) => console.log(err))
}

function renderRooms(data) {
  const template = document.getElementById('userList')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<li class="clearfix">
              <img src="${returnNonCurrentUser(item.User1, item.User2).avatar}" alt="avatar">
              <a href="/privatePage.html?room=${item.id}&userId=${userId}&username=${username}&avatar=${avatar}">
              <div class="about">
                <div class="name">${returnNonCurrentUser(item.User1, item.User2).name}</div>
                <div class="status"><i> ${item.Messages[0].content.substring(0, 20)}...</i></div>
                <div class="status"> ${moment(item.Messages[0].createdAt).fromNow()}</div>
              </div>
              </a>
            </li>
    `
  })
  template.innerHTML = rawHTML
}

// render rooms
function renderRooms(data) {
  const template = document.getElementById('userList')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<li class="clearfix" onclick="requestRoom(${item.Messages[0].RoomId})">
              <img src="${returnNonCurrentUser(item.User1, item.User2).avatar}" alt="avatar">
              <div class="about">
                <div class="name">${returnNonCurrentUser(item.User1, item.User2).name}</div>
                <div class="status"><i> ${item.Messages[0].content.substring(0, 20)}...</i></div>
                <div class="status"> ${moment(item.Messages[0].createdAt).fromNow()}</div>
              </div> 
            </li>
    `
  })

  template.innerHTML = rawHTML
}

// request room
function requestRoom(roomId) {
  // let params = new URLSearchParams(document.location.search)
  // let roomId = parseInt(params.get("room"), 10)
  axios.get(`${baseUrl}/sockets/${roomId}`, config)
    .then((response) => {
      renderRoom(response)
    })
    .catch((err) => console.log(err))
}

// render room
function renderRoom(data) {
  const template = document.getElementById('messages')
  const chatPersonTemplate = document.getElementById('chat-person')
  let rawHTML = ''
  console.log(data.data.User1.id)
  chatPersonTemplate.innerHTML = `
  <div class="col-lg-6">
                <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                  <img src="${returnNonCurrentUser(data.data.User1, data.data.User2).avatar}" alt="avatar">
                </a>
                <div class="chat-about">
                  <h6 class="m-b-0">${returnNonCurrentUser(data.data.User1, data.data.User2).name}</h6>
                </div>
  `
  data.data.Messages.forEach(item => {
    rawHTML +=
      `
      <div class="message-data">
   <img src="${item.User.avatar}" alt="avatar">
  <span>${item.User.name}</span>
                  <span class="message-data-time">${moment(item.createdAt).fromNow()}</span>
                </div>
                <div class="message my-message"> ${item.content}
                </div>
    `
  })
  user2Id = returnNonCurrentUser(data.data.User1, data.data.User2).id
  template.innerHTML = rawHTML
}


function returnNonCurrentUser(user1, user2) {
  console.log('user1 id, user2 id, userid', user1.id, user2.id, userId)
  if (Number(user1.id) === Number(userId)) {
    return user2
  } else {
    return user1
  }
}

function hideElement(element) {
  document.querySelector(`${element}`).innerHTML = ''
}


document.addEventListener('DOMContentLoaded', (event) => {
  requestRooms()
  requestRoom()
})