const { User, Review, LikedReview } = require('../models')

const reviewController = {
  getReviews: (req, res, next) => {
      return Review.findAndCountAll({
        include: [
          { model: User, as: 'LikedReviews', attributes: ['id'] }
        ],
        order: [['createdAt', 'DESC']]
      })
        .then(reviews => {
          const likedReviewId = req.user?.LikedReviews ? req.user.LikedReviews.map(likeReview => likeReview.id) : []
          const resultReviews = reviews.rows.map(r => ({
            ...r.toJSON(),
            isLiked: likedReviewId.includes(r.id),
            totalLikes: r.likeReviews ? r.likeReviews.length : 0
          }))
          return res.json(resultReviews)
        })
        .catch(err => next(err))
  },
  addReview: (req, res, next) => {
    const title = req.body.title
    const content = req.body.content
    if (!title || !content) throw new Error('Field required!')
    return Review.create({
      UserId: req.user.id,
      title,
      content
    })
      .then(review => {
        return res.json(review)
      })
      .catch(err => next(err))
  },
  editReview: (req, res, next) => {
    const title = req.body.title || null
    const content = req.body?.content || null
    if (!title || !content) throw new Error('Field required!')
      return Review.findByPk(req.params.id)
      .then(review => {
        if (!review) throw new Error('Review does not exist')
        return review.update({
          title,
          content
        })
      })
      .then(review => {
        review = review.toJSON()
        return res.json(review)
      })
      .catch(err => next(err))
  },
  deleteReview: async (req, res, next) => {
    const userId = req.user.id
    const reviewId = req.params.id
    try {
      const review = await Review.findOne({
        where: { id: userId, reviewId }
      })
      if (!review) throw new Error("Review doesn't exist or you don't have permission to edit!")
      const destroyedReview = await review.destroy()
      await LikedReview.destroy({
        where: { reviewId }
      })
      res.json(destroyedReview)
    } catch (err) {
      next(err)
    }
  },
  likeReview: (req, res, next) => {
    const userId = req.user.id
    const reviewId = Number(req.params.id)
    return Promise.all([
      Review.findByPk(reviewId),
      LikedReview.findOne({
        where: {
          userId,
          reviewId
        }
      })
    ])
      .then(([review, like]) => {
        if (!review) throw new Error("Review doesn't exist!")
        if (like) throw new Error('You have liked this review!')
        return Review.create({
          userId,
          reviewId
        })
      })
      .then(likedReview => {
        return res.json(likedReview)
      })
      .catch(err => next(err))
  }
}

module.exports = reviewController