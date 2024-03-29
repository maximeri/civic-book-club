const apiHost = 'localhost'
const port = '3000'
const baseUrl = `/api/v1`
const token = localStorage.getItem('access_token')
const config = {
  headers: { Authorization: `Bearer ${token}` }
}
let params = new URLSearchParams(document.location.search)
let userId = parseInt(params.get("userId"), 10)
let bookId = parseInt(params.get("bookId"), 10)

// get current user
let currentUserId = ''
let requestCurrentUserPromise = new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/get_current_user`, config)
    .then((response) => {
      resolve(response.data.currentUser)
    })
    .catch((err) => console.log(err))
})

function returnCurrentUserId(id) {
  currentUserId = id
}

requestCurrentUserPromise.then(function (currentUser) {
  returnCurrentUserId(currentUser.id)
})


// navbar
function renderNavbar() {
    axios.get(`${baseUrl}/get_current_user`, config)
      .then((response) => {
        return response.data.currentUser
      })
      .then(currentUser => {
        const template = document.querySelector('#navbar')
        let rawHTML = `
      <nav class="navbar navbar-expand-lg navbar-light">
    <a class="navbar-brand" href="index.html">Civic Book Club</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
      <li class="nav-item">
      <button class="btn dark" disabled> Hi ${currentUser.name}!</button>
      </li>
        <li class="nav-item">
          <a class="nav-link" href="user.html?userId=${currentUser.id}">My Event <i class="fa-solid fa-calendar-check"></i></a>
        </li>
         </li>
          <li class="nav-item">
          <a class="nav-link" href="privatePage.html?userId=${currentUser.id}&username=${currentUser.name}&avatar=${currentUser.avatar}">Message <i class="fa-solid fa-comment"></i></a>
        </li>
         </li>
          <li class="nav-item">
          <a class="nav-link" href="publicRoom.html?room=public&userId=${currentUser.id}&username=${currentUser.name}&avatar=${currentUser.avatar}">Chat Room <i class="fa-solid fa-comments"></i></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="addEvent.html"><i class="fa-solid fa-plus"></i> Event</a>
        </li>
          <li class="nav-item">
          <a class="nav-link" href="addBook.html"><i class="fa-solid fa-plus"></i> Book</a>
        </li>
        <li class="nav-item">
          <button id="logout" onclick="logout()"class="btn my-sm-0 my-2">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
  `
        template.innerHTML = rawHTML
      })
      .catch((err) => console.log(err))
}

// logout
function logout() {
  localStorage.removeItem('access_token')
  window.location.href = `/login.html`
}


// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar()
})