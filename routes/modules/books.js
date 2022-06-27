const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const bookController = require('../../controllers/book-controller')

router.post('/:id', bookController.likeBook) // 收藏書
router.post('/', bookController.addBook) // 建立書
router.delete('/:id', bookController.unlikeBook) // 取消收藏書
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }], bookController.editBook)) // 編輯書
router.get('?categoryId=:categoryId', bookController.getEvent) // 查看某分類的所有書
router.get('?sortBy=ctime&limit=10', bookController.getEvent) // 查看最近新增的 10 本書
router.get('/user/:userId', bookController.getUserBooks) // 查看使用者收藏的所有書
router.get('/:id', bookController.getBook) // 查看個別書
router.get('/', bookController.getBooks) // 查看所有書

module.exports = router
