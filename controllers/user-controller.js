const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    Promise.all([User.findOne({ where: { account: req.body.account } }), User.findOne({ where: { email: req.body.email } })]).then(([findAccount, findEmail]) => {
      if (findAccount) throw new Error('Account has already been taken.')
      if (findEmail) throw new Error('Email has already been taken.')
      const hash = bcrypt.hashSync(req.body.password, 10)
      const user = User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash
      })
      return user
    })
      .then(user => {
        user = user.toJSON()
        delete user.password
        res.json(user)
      })
      .catch(err => next(err))
  },
  logIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    return User.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'Requesters',
          attributes: ['status']
        }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(user => {
        if (!user) throw new Error("User doen't have permission!")
        user = user.toJSON()
        delete user.password
        return res.json(user)
      })
      .catch(err => next(err))
  },
  getCurrentUser: (req, res, next) => {
    const currentUser = req.user
    delete currentUser.password
    return res.json({
      currentUser
    })
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      throw new Error("User doen't have permission!")
    }
    const preference = req.body.preference || req.user.preference
    const job = req.body.job || req.user.job
    const goal = req.body.goal || req.user.goal
    const password = req.body.password ? bcrypt.hashSync(req.body.password, 10) : req.user.password
    const name = req.body?.name || req.user.name
    const account = req.body?.account || req.user.account
    const email = req.body?.email || req.user.email
    const avatar = req.files?.avatar ? req.files.avatar[0] : null
    Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } }),
      User.findByPk(req.params.id),
      imgurFileHandler(avatar)])
      .then(([
        findEmail,
        findAccount,
        user,
        avatarFilePath,
      ]) => {
        if (findEmail && findEmail.id !== req.user.id) throw new Error('Email has already been taken.')
        if (findAccount && findAccount.id !== req.user.id) throw new Error('Account has already been taken.')
        return user.update({
          name,
          account,
          email,
          password,
          avatar: avatarFilePath || user.avatar,
          preference,
          job,
          goal
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        return res.json(user)
      })
      .catch(err => next(err))
  }
}

module.exports = userController