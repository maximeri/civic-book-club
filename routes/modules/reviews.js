const express = require('express')
const router = express.Router()
const reviewController = require('../../controllers/review-controller.js')
router.post('/user/:id', reviewController.likeReview) // like a reveiw
router.post('/:bookId', reviewController.addReview) // add a reveiw
router.put('/:id', reviewController.editReview) // edit a review
router.delete('/:id', reviewController.deleteReview) // delete a reivew
router.get('/user/:userId', reviewController.getUserReviews) // view all reviews from a user
router.get('/:bookId', reviewController.getReviews) // view all reviews of a book

module.exports = router
