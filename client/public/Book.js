// render no seat disabled
function renderNoSeat(seats) {
  if (seats === 0) {
    return 'disabled'
  } else {
    return null
  }
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

// disable participated user to join
function renderDisabledParticipatedUser(participatedUsers) {
  let userIds = []
  participatedUsers.forEach(e => userIds.push(e.id))
  const equalsCurrentUserId = (element) => element === currentUserId
  // console.log('0000000', userIds, currentUserId, userIds.some(equalsCurrentUserId) )
  if (userIds.some(equalsCurrentUserId)) {
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

// hide delete button 
function hideDeleteBtn(userId) {
  if (userId !== currentUserId) {
    return 'hidden'
  } else {
    return null
  }
}

function renderBook(data) {
  const template = document.querySelector('#book')
  let rawHTML = ''
  rawHTML +=
    `
  <div class="container text-center">
  <img src="${data.image}" class="img-thumbnail" alt="${data.name}">
    <h1 class="display-4">${data.name}</h1>
    <p class="lead">${data.isbn}</p>
    <p>${data.introduction}</p>
    <a href="/addBookEvent.html?bookIsbn=${data.isbn}" class="btn btn-outline-success">+ Event</a>
    <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#exampleModal">+ Review</button>
</div>
    `
  template.innerHTML = rawHTML
}

// events
function renderEvents(data) {
  const template = document.querySelector('#events')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `
<div class="col-sm-3" id="${item.id}">
  <div class="mb-2">
    <div class="card">
        <div class="card-body" id="event-card-body">
          <h5 class="card-title"><a style="display: inline; vertical-align: middle;" href="/book.html?id=${item.id}">${item.topic}</a></h5>
          <p>${item.memberCount} members</p>
          <p class="font-bold text-wrap">${new Date(item.startAt).toLocaleString()}</p>
        </div>
        <div class="card-footer">
          <form class="event-form" id="${item.id}" action="./events/member/${item.id}" method="POST" style="display: inline;">
          <button onclick="joinEvent()" class="btn btn-outline-success" type="submit" ${renderDisabledParticipatedUser(item.ParticipatedUsers)} ${renderDisabledHost(item.hostId)} ${renderNoSeat(item.memberCount - item.currentMemberCount)} ${disabledExpireEvent(item.startAt)}>Join Now</button>
          <span class="font-weight-light text-right">${item.memberCount - item.currentMemberCount} seats left</span>
        </form>
        </div>
        </div>
      </div>
  </div>
    `
  })
  template.innerHTML = rawHTML
}

// reviews
function renderLike(like) {
  if (like) return `fa-solid`
  else {
    return `fa-regular`
  }
}

function renderReviews(data) {
  const template = document.querySelector('#reviews')
  let rawHTML = ''
  data.forEach(item => {
    rawHTML +=
      `

<div class="card" id="review-card">
  <div class="card-body">
    <h5 class="card-title">${item.title}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${new Date(item.createdAt).toLocaleString()}</h6>
    <p class="card-text">${item.content}</p>
    <div class="row m-1">
    <img id="avatar-review" src="${item.User.avatar}" alt="${item.User.name}">
    <a href="user.html?userId=${item.User.id}" class="card-link mt-2">&ensp;${item.User.name}</a>
    <form class="review-form" id="${item.id}" action="./books/${item.id}" method="POST">
          <button onclick="likeReview()" class="btn btn-like-book" type="submit"><i class="${renderLike(item.isLiked)} fa-heart"></i>&ensp;${item.totalLikes}</button>
          </form>
          <form id="${item.id}" action="./reviews/${item.id}" method="DELETE">
           <button onclick="deleteReview()" class="btn btn-outline-danger" type="submit" ${hideDeleteBtn(item.User.id)}>Delete</button>
          </form>
  </div>
  </div>
</div>

    `
  })
  template.innerHTML = rawHTML
}
