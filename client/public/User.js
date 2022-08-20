const token = localStorage.getItem('access_token')
const config = {
  headers: { Authorization: `Bearer ${token}` }
}
const apiHost = 'localhost'
const port = '3000'
const baseUrl = `http://${apiHost}:${3000}/api/v1`
// get current user
let currentUserId = ''
let requestCurrentUserPromise = new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/get_current_user`, config)
    .then((response) => {
      // console.log(response.data.currentUser.id)
      resolve(response.data.currentUser)
      // return response.data.currentUser
    })
    .catch((err) => console.log(err))
})

function returnCurrentUserId(id) {
  currentUserId = id
}

requestCurrentUserPromise.then(function (currentUser) {
  returnCurrentUserId(currentUser.id)
})

// get userId in the url
function getUserId() {
  let params = new URLSearchParams(document.location.search)
  let userId = parseInt(params.get("userId"), 10)
  return userId
}

// render expired events
function disabledExpireEvent(time) {
  time = new Date(time)
  const today = new Date()
  const parsedTime = Date.parse(time)
  const parsedToday = Date.parse(today)
  if (parsedTime <= parsedToday) {
    return 'disabled'
  } else {
    return null
  }
}

// disable fully booked
function renderNoSeat(seat) {
  if (seat == 0) {
    console.log(seat)
    return 'disabled'
  } else if (getUserId() === currentUserId) {
    return 'disabled'
  } else {
    return null
  }
}

// disable host to join
function renderDisabledHost(hostId) {
  if (hostId === currentUserId) {
    return 'disabled'
  } else {
    return null
  }
}

// render hidden
function renderEnterRoom() {
  if (getUserId() === currentUserId) {
    return null
  } else {
    return 'hidden'
  }
}

function renderHidden() {
  if (getUserId() !== currentUserId) {
    return null
  } else {
    return 'hidden'
  }
}

// user
function requestUser() {
  axios.get(`${baseUrl}/users/${getUserId()}`, config)
    .then((response) => {
      renderUser(response.data)
    })
    .catch((err) => console.log(err))
}

function renderUser(data) {
  const template = document.querySelector('#user')
  axios.get(`${baseUrl}/get_current_user`, config)
    .then((response) => {
      return response.data.currentUser
    }).then(currentUser => {
      let rawHTML = ''
      rawHTML +=
        `
  <div class="container">
  <img id="avatar-user" src="${data.avatar}" class="img-thumbnail" alt="${data.name}">
    <h1 class="display-4">${data.name} <a class="btn btn-outline-dark" href="privatePage.html?userId=${currentUser.id}&user2id=${data.id}&username=${currentUser.name}&user2name=${data.name}&avatar=${currentUser.avatar}&user2avatar=${data.avatar}">Message <i class="fa-solid fa-comment"></i></a></h1>
     
    <p class="lead">${data.job}</p>
    <p>${data.preference}</p>
</div>
    `
      template.innerHTML = rawHTML
    })
}

// member events
function renderMemberEvents(data) {
  const template = document.querySelector('#member-events')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<div class="col-sm-3" id="${item.id}">
  <div class="mb-2">
    <div class="card">
        <div class="card-body">
          <h5 class="card-title"><a style="display: inline; vertical-align: middle;" href="/book.html?bookId=${item.Event.bookId}">${item.Event.topic}</a></h5>
          <p>${item.Event.memberCount} members</p>
          <p class="font-bold text-wrap">${new Date(item.Event.startAt).toLocaleString()}</p>
        </div>
        <div class="card-footer">
          <form class="event-form" id="${item.id}" action="" method="POST" style="display: inline;">
          <a href="${item.Event.meetingLink}" class="btn btn-outline-success" ${renderEnterRoom()}>Enter Room</a>
          <button id="${item.id}"onclick="joinEvent()" class="btn btn-outline-success" ${renderHidden()} ${renderDisabledHost(item.Event.hostId)}type="submit" ${renderNoSeat(item.Event.memberCount - item.Event.currentMemberCount)} ${disabledExpireEvent(item.Event.startAt)}>Join Now</button>
          <span class="font-weight-light text-right">${item.Event.memberCount - item.Event.currentMemberCount} seats left</span>
        </form>
        </div>
        </div>
      </div>
  </div>
    `
  })
  template.innerHTML += rawHTML
}

function requestMemberEvents() {
  const params = new URLSearchParams(document.location.search);
  const userId = parseInt(params.get("userId"), 10)
  const events = []
  axios.get(`${baseUrl}/events/user/member/${userId}`, config)
    .then((response) => {
      events.push(...response.data)
      renderMemberEvents(events)
    })
    .catch((err) => console.log(err))
}

// host events
function renderHostEvents(data) {
  const template = document.querySelector('#host-events')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<div class="col-sm-3" id="${item.id}">
  <div class="mb-2">
    <div class="card">
        <div class="card-body">
          <h5 class="card-title"><a style="display: inline; vertical-align: middle;" href="/book.html?bookId=${item.bookId}">${item.topic}</a></h5>
          <p>${item.memberCount} members</p>
          <p class="font-bold text-wrap">${new Date(item.startAt).toLocaleString()}</p>
        </div>
        <div class="card-footer">
          <form class="event-form" id="${item.id}" action="./events/member/${item.id}" method="POST" style="display: inline;">
           <a href="${item.meetingLink}" class="btn btn-outline-success" ${renderEnterRoom()}>Enter Room</a>
          <button id="${item.id}" onclick="joinEvent()" class="btn btn-outline-success" type="submit"${renderHidden()} ${renderDisabledHost(item.hostId)} ${renderNoSeat(item.memberCount - item.currentMemberCount)} ${disabledExpireEvent(item.startAt)}>Join Now</button>
          <span class="font-weight-light text-right">${item.memberCount - item.currentMemberCount} seats left</span>
        </form>
        </div>
        </div>
      </div>
  </div>
    `
  })
  template.innerHTML += rawHTML
}

function requestHostEvents() {
  const params = new URLSearchParams(document.location.search);
  const userId = parseInt(params.get("userId"), 10)
  const events = []
  axios.get(`${baseUrl}/events/user/host/${userId}`, config)
    .then((response) => {
      events.push(...response.data)
      renderHostEvents(events)
    })
    .catch((err) => console.log(err))
}

// reviews
function renderLike(like) {
  if (like) return `fa-solid`
  else {
    return `fa-regular`
  }
}

// hide delete button 
function hideDeleteBtn(userId) {
  if (userId !== currentUserId) {
    return 'hidden'
  } else {
    return null
  }
}
// Delete review
function deleteReview() {
  if (confirm("Are you sure you want to delete this review?")) {
    document.addEventListener('submit', function (e) {
      e.preventDefault()
      fetch(`${baseUrl}/reviews/${e.target.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => location.reload())
        .catch((err) => console.log(err))
    })
  } else {
    console.log("You pressed Cancel!")
  }
}
// Render reviews
function renderReviews(data) {
  const template = document.querySelector('#reviews')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<div class="card">
  <div class="card-body">
    <h5 class="card-title"><a href="/book.html?bookId=${item.book_id
      }">${item.title} </a></h5>
   
    <h6 class="card-subtitle mb-2 text-muted">${new Date(item.createdAt).toLocaleString()}</h6>
    <p class="card-text">${item.content}</p>
    <div class="row m-1">
    <form id="${item.id}" action="./books/${item.id}" method="POST">
          <button onclick="likeReview()" class="btn btn-like-book" type="submit"><i class="${renderLike(item.isLiked)} fa-heart"></i>&ensp;${item.totalLikes}</button>
          </form>
          <form id="${item.id}" action="./reviews/${item.id}" method="DELETE">
           <button onclick="deleteReview()" class="btn btn-outline-danger" type="submit" ${hideDeleteBtn(item.userId)}>Delete</button>
          </form>
      </div>
  </div>
</div>
    `
  })
  template.innerHTML += rawHTML
}

// Request reviews
function requestReviews() {
  let params = new URLSearchParams(document.location.search)
  let userId = parseInt(params.get("userId"), 10)
  const reviews = []
  axios.get(`${baseUrl}/reviews/user/${userId}`, config)
    .then((response) => {
      reviews.push(...response.data)
      renderReviews(reviews)
    })
    .catch((err) => console.log(err))
}

// Render like 
function renderLike(like) {
  if (like) return `fa-solid`
  else {
    return `fa-regular`
  }
}
// Render books
function renderBooks(data) {
  const template = document.querySelector('#books')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<div class="col-sm-3">
  <div class="mb-2">
    <div class="card">
        <img src="${item.Book.image
      }" class="card-img-top img-fluid" alt="Book Image">
        <div class="card-body">
          <h5 class="card-title">${item.Book.name}</h5>
          <p class="">ISBN: ${item.Book.isbn}</p>
        </div>
        <div class="card-footer">
        <form class="likeBook" id="${item.book_id}">
          <a class="btn btn-outline"href="/book.html?bookId=${item.book_id
      }">See Events</a>
          <button class="btn btn-like-book"><i id="${item.book_id}" class="${renderLike(item.isLiked)} fa-bookmark"></i>&ensp;${item.totalLikes}</button>
          <script>
          
          </script>
          </form>
        </div>
        </div>
      </div>
  </div>
    `
  })
  template.innerHTML += rawHTML
}

// Request books
function requestBooks() {
  const cards = []
  axios.get(`${baseUrl}/books/user/${getUserId()}`, config)
    .then((response) => {
      cards.push(...response.data)
      renderBooks(cards)
    })
    .catch((err) => console.log(err))
}

// like review
function likeReview() {
  document.addEventListener('submit', function (e) {
    e.preventDefault()
    fetch(`${baseUrl}/reviews/user/${e.target.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => location.reload())
      .catch((err) => console.log(err))
  })
}

// like book
window.onload = () => {
  var likeBookForms = document.getElementsByClassName("likeBook")
  for (var i = 0; i < likeBookForms.length; i++) {
    likeBookForms[i].addEventListener('submit', (e) => {
      e.preventDefault()
      fetch(`${baseUrl}/books/${e.target.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => location.reload())
        .catch((err) => console.log(err))
    })
  }
}

// join event
function joinEvent() {
  var eventForms = document.getElementsByClassName("event-form")
  for (var i = 0; i < eventForms.length; i++) {
    eventForms[i].addEventListener('submit', function (e) {
      e.preventDefault()
      fetch(`${baseUrl}/events/member/${e.target.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => location.reload())
        .catch((err) => console.log(err))
    })
  }
}


document.addEventListener('DOMContentLoaded', () => {
  requestUser()
  requestBooks()
  requestReviews()
  requestMemberEvents()
  requestHostEvents()
})