// templates
// heart
function renderHeart(isLiked) {
  if (isLiked) {
    return "fa-solid"
  } else {
    return "fa-regular"
  }
}
// card
function renderCard(data) {
  const card = document.querySelector('#card')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += 
    `
<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${item.image
      }" class="card-img-top img-fluid" alt="Book Image">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
        </div>
        <div class="card-footer">
          <a id="book${item.id
      }"class="btn btn btn-outline-secondary "href="/book.html?id=${item.id
      }">See Events</a>
          <button class="btn btn-like-book"><small class="text-muted"><i class="${renderHeart(item.isLiked)} fa-heart"style="color:Tomato"></i>&ensp;${item.totalLikes}</small></button>
        </div>
      </div>
    </div>
  </div>
    `
  })
  card.innerHTML = rawHTML
}

function renderNavbar () {
    const template = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="index.html">Civic Book Club</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
  
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="event.html">My Events</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="book.html">My Books</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="login.html">Login</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Find a book..." aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
  `
  return template
  }

  function Navbar() {
    const template = document.querySelector('#navbar')
    template.innerHTML = `
      ${renderNavbar()}
  `
    console.log(template)
  }

// carousel inner item
    function renderCarousel(data) {
      const carousel = document.querySelector('.carousel-inner')
      let rawHTML = ''
      data.forEach((item) => {
        rawHTML += `
<div class="carousel-item">
      <img src="${item.image}" class="d-block w-100 p-3" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5>${item.name}</h5>
        <p>${item.introduction}</p>
      </div>
    </div>
    `
      })
      carousel.innerHTML += rawHTML
   }

// request slides
function requestSlides() {
  const slides = []
  axios.get('http://localhost:3000/api/v1/books/top10')
  .then((response) => {
    console.log(response.data)
    slides.push(...response.data)
    renderCarousel(slides)
    })
    .catch((err) => console.log(err))
}

// request card
function requestCard() {
  const cards = []
  axios.get('http://localhost:3000/api/v1/books')
    .then((response) => {
      cards.push(...response.data)
      renderCard(cards)
    })
    .catch((err) => console.log(err))
}

// DOMContentLoaded event
document.addEventListener('DOMContentLoaded', (event) => {
  Navbar()
  requestCard()
  requestSlides()
})