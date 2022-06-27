const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')
// router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, userController.putUser) // 修改使用者資料
// router.get('/:id', userController.getUser) // 瀏覽使用者資料

module.exports = router
