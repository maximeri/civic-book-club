// navbar
function renderNavbar() {
  const token = localStorage.getItem('access_token')
  if (token) {
    const config = { headers: { Authorization: `Bearer ${token}` } }
    axios.get(`http://localhost:3000/api/v1/get_current_user`, config)
    .then((response) => {
      return response.data.currentUser.id
    })
      .then(userId => {
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
          <a class="nav-link" href="user.html?userId=${userId}">My Events</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="addEvent.html">+ Event</a>
        </li>
          <li class="nav-item">
          <a class="nav-link" href="addBook.html">+ Book</a>
        </li>
        <li class="nav-item">
          <button id="logout" onclick="logout()"class="btn my-sm-0 my-2">Logout</button>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Find a book..." aria-label="Search">
        <button class="btn my-2 my-sm-0" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
      </form>
    </div>
  </nav>
  `
        template.innerHTML = rawHTML
      })
      .catch((err) => console.log(err))
  } else {
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
          <a class="nav-link" href="login.html">Login</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Find a book..." aria-label="Search">
        <button class="btn my-2 my-sm-0" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
      </form>
    </div>
  </nav>
  `
    template.innerHTML = rawHTML
  }
}

// logout
function logout() {
  localStorage.removeItem('access_token')
  window.location.href = "http://localhost:3000/login.html"
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar()
})