const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Book, Review } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy( // passport.use(new LocalStrategy(option 設定客製化選項, function登入的認證程序))
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  // authenticate user
  (account, password, cb) => {
    User.findOne({ where: { account } })
      .then(user => {
        // 找不到使用者
        if (!user) return cb(null, false) // 第一個 null 是 Passport 的設計，代表沒有錯誤發生
        // 使用者存在，驗證密碼
        bcrypt.compare(password, user.password).then(res => {
          // 找到 user 但資料庫裡的密碼和表單密碼不一致
          if (!res) return cb(null, false)
          // 驗證通過
          return cb(null, user)
        })
      })
  }
))
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Review},
      { model: Review, as: 'LikedReviews' },
      { model: Book, as: 'LikedBooks' },
      { model: User, as: 'Requesters'},
      { model: User, as: 'Receivers' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      { model: Review },
      { model: Review, as: 'LikedReviews' },
      { model: Book, as: 'LikedBooks' },
      { model: User, as: 'Requesters' },
      { model: User, as: 'Receivers' }
    ]
    
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
