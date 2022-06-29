const { Book, User, LikedBook } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const bookController = {
  getBooks: (req, res, next) => {
    return Book.findAndCountAll({
      include: [
        { model: User, as: 'LikedBooks', attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    })
    .then(books => {
      const likedBookId = req.user?.LikedBooks ? req.user.LikedBooks.map(likeBook => likeBook.id) : []
      const resultBooks = books.rows.map(r => ({
        ...r.toJSON(),
        isLiked: likedBookId.includes(r.id),
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
      where: { UserId: req.params.id },
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
        model: User, as: 'LikedBooks'
      }]
    })
      .then(books => {
        for (let i = 0; i < books.length; i++) {
          if (books[i].userId === req.user.id) {
            books.splice(i, 1)
          }
        }
        books = books.map(b => ({
          ...b.dataValues,
          likeCount: b.LikedBooks.length,
          isLiked: req.user && req.user.LikedBooks.map(lb => lb.id).includes(b.id)
        }))
        books.sort((a, b) => b.followerCount - a.followerCount)
        books = books.slice(0, 10)
        res.json(books)
      })
      .catch(err => next(err))
  },
  addBook: (req, res, next) => {
    const name = req.body.name
    const ISBN = req.body.ISBN
    const introduction = req.body.introduction
    const image = req.files?.image ? req.files.image[0] : null
    if (!name || !ISBN ) throw new Error('Field required!')
    if (Book.findOne({ where: { ISBN } })) throw new Error('Book already exists!')
    return Book.create({
      UserId: req.user.id,
      name,
      ISBN,
      introduction,
      image
    })
      .then(book => {
        return res.json(book)
      })
      .catch(err => next(err))
  },
  editBook: (req, res, next) => {
    // once the book is created, only name, image, and introduction can be edited
    if (Number(req.params.id) !== Number(req.user.id)) {
      throw new Error("User doen't have permission!")
    }
    const introduction = req.body.introduction || null
    const name = req.body?.name || null
    const image = req.files?.image ? req.files.image[0] : null
    if (!name || !introduction) throw new Error('Field required!')
    Promise.all([
      Book.findByPk(req.params.id),
      Book.findOne({ where: { name } }),
      imgurFileHandler(image)])
      .then( ([book,name,imageFilePath]) => {
        if (!book) throw new Error('The book has not been created yet.')
        if (!name) throw new Error('Name has already been taken.')
        return book.update({
          name,
          introduction,
          cover: imageFilePath
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
        if (like) throw new Error('You have liked this tweet!')
        return Book.create({
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
        return LikedBook.destroy()
      })
      .then(unlike => {
        return res.json(unlike)
      })
      .catch(err => next(err))
  }
}
  

module.exports = bookController