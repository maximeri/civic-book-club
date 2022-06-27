const express = require('express')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')
const router = express.Router()
const users = require('./modules/users')
const friendships = require('./modules/friendships')
const books = require('./modules/books')
const events = require('./modules/events')
const reviews = require('./modules/reviews')
const { authenticated } = require('../middleware/auth')
const userController = require('../controllers/user-controller')

// 將不同的 routes 拆分
router.post('/users/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/users', userController.signUp)
router.get('/get_current_user', authenticated, userController.getCurrentUser)
router.use('/users', authenticated, users)
router.use('/friendships', authenticated, friendships)
router.use('/books', authenticated, books)
router.use('/events', authenticated, events)
router.use('/reviews', authenticated, reviews)
router.use('/', apiErrorHandler)

module.exports = router
