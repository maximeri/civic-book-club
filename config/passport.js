const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Book, Review } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy( 
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

passport.use(
  new FacebookStrategy(
    {
       clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRECT,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email } = profile._json
        let user = await User.findOne({ where: { email } })
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8) // 36 = 10 digits + 26 letters
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(randomPassword, salt)
        // for new user creation
        user = await User.create({
          account:name,
          name,
          email,
          password: hash,
        })
        return done(null, user)
      } catch (err) {
        done(null, false)
      }
    }
  )
)

// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
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
