// Get room
function getRoom(roomId) {
  axios.get(`${baseUrl}/sockets/${roomId}`, config)
    .then((response) => {
      renderRoom(response)
    })
    .catch((err) => console.log(err))
}

// Get rooms
function getRooms() {
  let params = new URLSearchParams(document.location.search)
  let userId = parseInt(params.get("userId"), 10)
  const rooms = []
  axios.get(`${baseUrl}/sockets/rooms/${userId}`, config)
    .then((response) => {
      rooms.push(...response.data)
      renderRooms(rooms)
    })
    .catch((err) => console.log(err))
}