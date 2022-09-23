const { Book, User, LikedBook } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const redis = require('redis')
const reids_port = process.env.PORT || 6379
const client = redis.createClient({
  url: 'redis://redis:6379'
});
client.connect()

const bookController = {
  getBooks: (req, res, next) => {
    return Book.findAndCountAll({
      include: [
        { model: User, as: 'LikedBookUsers', attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(books => {
        const likedBookUserId = req.user?.LikedBooks ? req.user.LikedBooks.map(likeBooks => likeBooks.id) : []
        const resultBooks = books.rows.map(r => ({
          ...r.toJSON(),
          isLiked: likedBookUserId.includes(r.id),
          totalLikes:r.LikedBookUsers.length
        }))
        return res.json(resultBooks)
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    return Book.findByPk(req.params.id)
      .then(book => {
        if (!book) throw new Error("Book didn't exist!")
        return res.json(book)
      })
      .catch(err => next(err))
  },
  getUserBooks: (req, res, next) => {
    return LikedBook.findAndCountAll({
      attributes: {
        exclude: ['updatedAt', 'createdAt']
      },
      include: [{
        model: Book,
        include: [
          { model: User, as: 'LikedBookUsers', attributes: ['id'] }
        ]
}],
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    })
      .then(books => {
        if (!books) throw new Error('This account does not exist.')
        const likedBookUserId = req.user?.LikedBooks ? req.user.LikedBooks.map(likeBooks => likeBooks.id) : [] // defined in config passport.js
        const resultBooks = books.rows.map(r => ({
          ...r.toJSON(),
          isLiked: likedBookUserId.includes(r.bookId),
          totalLikes: r.Book?.LikedBookUsers?.length
        }))
        return res.json(resultBooks)
      })
      .catch(err => next(err))
  },
  getTopBooks: (req, res, next) => {
    return Book.findAll({
      include: [{
        model: User, as: 'LikedBookUsers'
      }]
    })
      .then(books => {
        const likedBookId = req.user?.LikedBooks ? req.user.LikedBooks.map(lb => lb.id) : []
        books = books.map(b => ({
          ...b.dataValues,
          likeCount: b.LikedBookUsers.length
        }))
        books.sort((a, b) => b.likeCount - a.likeCount)
        books = books.slice(0, 10)
        // get images
        images = books.map(b => b.image)
        // Set data to Redis
        client.setEx("images", 3600, JSON.stringify(images))
        res.json(images)
      })
      .catch(err => next(err))
  },
  addBook: (req, res, next) => {
    const { name, isbn, introduction } = req.body
    const { file } = req
    if (!name || !isbn) throw new Error('Field required!')
    Promise.all([Book.findOne({ where: { isbn: isbn } }), Book.findOne({ where: { name: name } })])
      .then(([findIsbn, findName]) => {
        if (findIsbn) throw new Error('Book isbn already exists!')
        if (findName) throw new Error('Book name already exists!')
  return Book.create({
    userId: req.user.id,
    name: name,
    isbn: isbn,
    introduction,
    image: file || null
  })
      })
      .then(book => {
        return res.json(book)
      })
      .catch(err => next(err))
  },
  editBook: (req, res, next) => {
    // once the book is created only image and introduction can be edited
    const introduction = req.body.introduction || null
    const { file } = req
    if (!introduction) throw new Error('Field required!')
    Promise.all([
      Book.findByPk(req.params.id),
      imgurFileHandler(file)])
      .then(([book, filePath]) => {
        if (!book) throw new Error('The book has not been created yet.')
        return book.update({
          introduction,
          image: filePath || book.image
        })
      })
      .then(book => {
        book = book.toJSON()
        return res.json(book)
      })
      .catch(err => next(err))
  },
  likeBook: (req, res, next) => {
    const userId = req.user.id
    const bookId = Number(req.params.id)
    return Promise.all([
      Book.findByPk(bookId),
      LikedBook.findOne({
        where: {
          userId,
          bookId
        }
      })
    ])
      .then(([book, like]) => {
        if (!book) throw new Error("Book doesn't exist!")
        if (like) return like.destroy()
        return LikedBook.create({
          userId,
          bookId
        })
      })
      .then(likedBook => {
        return res.json(likedBook)
      })
      .catch(err => next(err))
  }
}


module.exports = bookController