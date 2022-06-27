const express = require('express')
const router = express.Router()
const reviewController = require('../../controllers/review-controller')
router.post('/:userId', reviewController.likeReview) // 按讚書評
router.post('/', reviewController.addReview) // 新增書評
router.put('/:id', reviewController.editReview) // 修改書評
router.delete('/:id', reviewController.deleteReview) // 刪除書評
router.get('/:bookId?sortBy=ctime&limit=10', reviewController.getNewReviews) // 查看一本書最新的 10 筆評論
router.get('/:userId', reviewController.getReviews) // 查看此用戶所有書評

module.exports = router
