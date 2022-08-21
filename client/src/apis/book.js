
function requestBook() {
  let params = new URLSearchParams(document.location.search)
  let bookId = parseInt(params.get("bookId"), 10)
  axios.get(`${baseUrl}/books/${bookId}`, config)
    .then((response) => {
      renderBook(response.data)
    })
    .catch((err) => console.log(err))
}

document.addEventListener('DOMContentLoaded', () => {
  requestBook()
})