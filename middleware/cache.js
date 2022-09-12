const redis = require('redis')
const reids_port = process.env.REDIS_PORT || 6379
const client = redis.createClient(reids_port)


async function start() {
  await client.connect()
  console.log('redis connected')
}

async function cache(req, res, next) {
  const value = await client.get('images');
  if (value != null) {
      console.log('cache hit')
      return res.json(JSON.parse(value));
    }
    else {
    console.log('MySQL hit')
      next()
    }
}

start() // connect to Redis when starting the app
module.exports = {cache}