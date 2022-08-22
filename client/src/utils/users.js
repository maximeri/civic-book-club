// get userId in the url
function getUserId() {
  let params = new URLSearchParams(document.location.search)
  let userId = parseInt(params.get("userId"), 10)
  return userId
}