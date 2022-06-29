const express = require('express')
const router = express.Router()
const reviewController = require('../../controllers/review-controller.js')
router.post('/:userId', reviewController.likeReview) // 按讚書評
router.post('/', reviewController.addReview) // 新增書評
router.put('/:id', reviewController.editReview) // 修改書評
router.delete('/:id', reviewController.deleteReview) // 刪除書評
router.get('/:userId', reviewController.getReviews) // 查看此用戶所有書評

module.exports = router
