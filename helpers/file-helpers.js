const fs = require('fs') // 引入 fs 模組 （Node.js 提供專門來處理檔案的原生模組）
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) 
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  imgurFileHandler
}
