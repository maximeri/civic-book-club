const express = require('express')
const router = express.Router()
const passport = require('passport')

// router.get('/auth/facebook', passport.authenticate('facebook', {
//   scope: ['public_profile','email']
// }))
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: ' /login.html' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/')
  });

module.exports = router