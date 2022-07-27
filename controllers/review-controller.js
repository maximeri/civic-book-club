const { User, Review, LikedReview } = require('../models')

const reviewController = {
  getReviews: (req, res, next) => {
      return Review.findAndCountAll({
        include: [
          { model: User, attributes: ['id','name','avatar'] },
          { model: User, as: 'LikedReviewUsers', attributes: ['id'] }
        ],
        where:{ bookId: req.params.bookId },
        order: [['createdAt', 'DESC']]
      })
        .then(reviews => {
          const likedReviewId = req.user?.LikedReviews ? req.user.LikedReviews.map(likeReview => likeReview.id) : []
          const resultReviews = reviews.rows.map(r => ({
            ...r.toJSON(),
            isLiked: likedReviewId.includes(r.id),
            totalLikes: r.LikedReviewUsers.length
          }))
          return res.json(resultReviews)
        })
        .catch(err => next(err))
  },
  getUserReviews: (req, res, next) => {
    return Review.findAndCountAll({
      include: [
        { model: User, as: 'LikedReviewUsers', attributes: ['id'] }
      ],
      where: {userId: req.params.userId},
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
      userId: req.user.id,
      bookId: req.params.bookId,
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
    try {
      const review = await Review.findOne({
        where: { userId: req.user.id, id: req.params.id }
      })
      if (!review) throw new Error("Review doesn't exist or you don't have permission to edit!")
      const destroyedReview = await review.destroy()
      await LikedReview.destroy({
        where: { reviewId: req.params.id }
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
        if (like) return like.destroy()
        return LikedReview.create({
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