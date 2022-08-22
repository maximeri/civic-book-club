// get events
function getEvents() {
  const events = []
  axios.get(`${baseUrl}/events/book/${bookId}`, config)
    .then((response) => {
      // let test = response.data.forEach(e => e.ParticipatedUsers.forEach(ee => console.log(ee.id)))
      events.push(...response.data)
      renderEvents(events)
    })
    .catch((err) => console.log(err))
}

// get host events
function getHostEvents() {
  const events = []
  axios.get(`${baseUrl}/events/user/host/${userId}`, config)
    .then((response) => {
      events.push(...response.data)
      renderHostEvents(events)
    })
    .catch((err) => console.log(err))
}

// get member events
function getMemberEvents() {
  const events = []
  axios.get(`${baseUrl}/events/user/member/${userId}`, config)
    .then((response) => {
      events.push(...response.data)
      renderMemberEvents(events)
    })
    .catch((err) => console.log(err))
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