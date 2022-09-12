const redis = require('redis')
const reids_port = process.env.REDIS_PORT || 6379
const client = redis.createClient(reids_port)


async function start() {
  await client.connect()
  console.log('redis connected')
}
function cache (req, res, next) {
  return new Promise(async function (resolve, reject) {
    const value = await client.get('images');
    if (value != null) {
      console.log('cache hit')
      resolve(JSON.parse(value));
      return res.json(JSON.parse(value));
    }
    else {
      next()
    }
  })
}
start()
module.exports = {cache}