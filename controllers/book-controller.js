const { Book, User, LikedBook } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
          totalLikes: r.LikedBooks ? r.LikedBooks.length : 0
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
    return LikedBook.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    })
      .then(books => {
        if (!books) throw new Error('This account does not exist.')
        return res.json(books)
      }).catch(err => next(err))
  },
  getTopBooks: (req, res, next) => {
    return Book.findAll({
      include: [{
        model: User, as: 'LikedBookUsers'
      }]
    })
      .then(books => {
        for (let i = 0; i < books.length; i++) {
          if (books[i].userId === req.user.id) {
            books.splice(i, 1)
          }
        }
        const likedBookId = req.user?.LikedBooks ? req.user.LikedBooks.map(lb => lb.id) : []
        books = books.map(b => ({
          ...b.dataValues,
          likeCount: b.LikedBookUsers.length,
          isLiked: req.user && likedBookId.includes(b.id)
        }))
        books.sort((a, b) => b.likeCount - a.likeCount)
        books = books.slice(0, 10)
        res.json(books)
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
    // once the book is created, only name, image, and introduction can be edited
    const introduction = req.body.introduction || null
    const name = req.body?.name || null
    const { file } = req
    if (!name || !introduction) throw new Error('Field required!')
    Promise.all([
      Book.findByPk(req.params.id),
      Book.findOne({ where: { name } }),
      imgurFileHandler(file)])
      .then(([book, findName, filePath]) => {
        if (!book) throw new Error('The book has not been created yet.')
        if ((Number(book.id) !== Number(req.params.id)) && findName) throw new Error('Name has already been taken.')
        return book.update({
          name,
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
        if (like) throw new Error('You have liked this book!')
        return LikedBook.create({
          userId,
          bookId
        })
      })
      .then(likedBook => {
        return res.json(likedBook)
      })
      .catch(err => next(err))
  },
  unlikeBook: (req, res, next) => {
    const userId = req.user.id
    const bookId = req.params.id
    return LikedBook.findOne({
      where: {
        userId,
        bookId
      }
    })
      .then(likedBook => {
        if (!likedBook) throw new Error("You haven't liked this book!")
        return likedBook.destroy()
      })
      .then(unlike => {
        return res.json(unlike)
      })
      .catch(err => next(err))
  }
}


module.exports = bookController