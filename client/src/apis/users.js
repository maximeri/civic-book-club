// get user
function getUser() {
  axios.get(`${baseUrl}/users/${userId}`, config)
    .then((response) => {
      renderUser(response.data)
    })
    .catch((err) => console.log(err))
}
