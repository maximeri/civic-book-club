// carousel
function renderCarousel(data) {
  const template = document.querySelector('.carousel-inner')
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
  template.innerHTML += rawHTML
}

function requestCarousel() {
  const token = localStorage.getItem('access_token')
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const carousels = []
  axios.get('http://localhost:3000/api/v1/books/top10', config)
    .then((response) => {
      carousels.push(...response.data)
      renderCarousel(carousels)
    })
    .catch((err) => console.log(err))
}

document.addEventListener('DOMContentLoaded', () => {
  requestCarousel()
})

// books
function renderLike(like) {
  if (like) return `fa-solid`
  else {
    return `fa-regular`
  }
}

function renderBooks(data) {
  const template = document.querySelector('.row')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<div class="col-sm-3" id="${item.id}">
  <div class="mb-2">
    <div class="card">
        <img src="${item.image
      }" class="card-img-top img-fluid" alt="Book Image">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
        </div>
        <div class="card-footer">
        <form action="./books/${item.id}" method="POST">
          <a class="btn btn-outline"href="/book.html?bookId=${item.id
      }">See Events</a>
          <button class="btn btn-like-book" type="submit"><i class="${renderLike(item.isLiked)} fa-bookmark"></i>&ensp;${item.totalLikes}</button>
          </form>
        </div>
        </div>
      </div>
  </div>
    `
  })
  template.innerHTML = rawHTML
}

function requestCard() {
  const token = localStorage.getItem('access_token')
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const cards = []
  axios.get('http://localhost:3000/api/v1/books', config)
    .then((response) => {
      cards.push(...response.data)
      renderBooks(cards)
    })
    .catch((err) => console.log(err))
}

document.addEventListener('DOMContentLoaded', () => {
  requestCard()
})