const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const bookController = require('../../controllers/book-controller')

router.post('/:id', bookController.likeBook) // like a book
router.post('/', bookController.addBook) // add a book
router.put('/:id', upload.single('image'), bookController.editBook) // edit book info
router.get('/top10', bookController.getTopBooks) // view top 10 books
router.get('/user/:userId', bookController.getUserBooks) // View a user's liked books
router.get('/:id', bookController.getBook) // view a book
router.get('/', bookController.getBooks) // view all books

module.exports = router
