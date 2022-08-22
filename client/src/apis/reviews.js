// get reviews
function getReviews() {
  const reviews = []
  axios.get(`${baseUrl}/reviews/${bookId}`, config)
    .then((response) => {
      reviews.push(...response.data)
      renderReviews(reviews)
    })
    .catch((err) => console.log(err))
}

// Get user reviews
function getUserReviews() {
  const reviews = []
  axios.get(`${baseUrl}/reviews/user/${userId}`, config)
    .then((response) => {
      reviews.push(...response.data)
      renderUserReviews(reviews)
    })
    .catch((err) => console.log(err))
}

// post review
function submitReview() {
  const form = document.getElementById('review-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    const formData = new FormData(form)
    // Convert formData object to URL-encoded string:
    const payload = new URLSearchParams(formData)
    // Post the payload using Fetch:
    fetch(`${baseUrl}/reviews/${bookId}`, {
      method: 'POST',
      body: payload,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        location.reload()
      })
  })
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

// delete review
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