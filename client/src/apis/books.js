// get a book
function getBook() {
  axios.get(`${baseUrl}/books/${bookId}`, config)
    .then((response) => {
      renderBook(response.data)
    })
    .catch((err) => console.log(err))
}

// get books
function getBooks() {
  axios.get(`${baseUrl}/books`, config)
    .then((response) => {
      cards.push(...response.data)
      renderBooks(cards)
    })
    .catch((err) => console.log(err))
}

// get user books
function getUserBooks() {
  const cards = []
  axios.get(`${baseUrl}/books/user/${userId}`, config)
    .then((response) => {
      cards.push(...response.data)
      renderUserBooks(cards)
    })
    .catch((err) => console.log(err))
}

// Get top books
function getTopBooks() {
  const carousels = []
  axios.get(`${baseUrl}/books/top10`, config)
    .then((response) => {
      carousels.push(...response.data)
      renderCarousel(carousels)
    })
    .catch((err) => console.log(err))
}

// Like a book
window.onload = () => {
  var likeBookForms = document.getElementsByClassName("likeBook")
  for (var i = 0; i < likeBookForms.length; i++) {
    likeBookForms[i].addEventListener('submit', (e) => {
      e.preventDefault()
      console.log(e.target)
      fetch(`${baseUrl}/books/${e.target.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => location.reload())
        .catch((err) => console.log(err))
    })
  }
}