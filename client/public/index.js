let cards = [] // books

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

// books
function renderLike(like) {
  if (like) return `fa-solid`
  else {
    return `fa-regular`
  }
}

function renderBooks(data) {
  const template = document.querySelector('#books')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<div class="col-sm-3">
  <div class="mb-2">
    <div class="card">
        <img src="${item.image
      }" class="card-img-top img-fluid" alt="Book Image" id="book-img">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="">ISBN: ${item.isbn}</p>
        </div>
        <div class="card-footer">
        <form class="likeBook" id="${item.id}">
          <a class="btn btn-outline"href="/book.html?bookId=${item.id
      }">See Events</a>
          <button class="btn btn-like-book"><i id="${item.id}"class="${renderLike(item.isLiked)} fa-bookmark"></i>&ensp;${item.totalLikes}</button>
          <script>
          
          </script>
          </form>
        </div>
        </div>
      </div>
  </div>
    `
  })
  template.innerHTML = rawHTML
}

// search-bar
const searchInput = document.getElementById('search-input')
const searchForm = document.getElementById('search-form')
searchForm.addEventListener("submit", e => {
  e.preventDefault()
  const keyword = searchInput.value.toLowerCase()
  if (!keyword.length) {
    return alert('please enter valid name or isbn')
  }
  let filteredCards = []
  filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(keyword) ||
    card.isbn.includes(keyword)
  )
  if (filteredCards.length === 0) {
    return alert(`No matching result for "${keyword}"`)
  }
  renderBooks(filteredCards)
})

