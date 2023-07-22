const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/users')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', async (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  const errors = []
  if (!name || !email || !password || !confirmPassword) errors.push({ msg: 'Name、Email、Password and Confirm Password are required.' })
  if (password !== confirmPassword) errors.push({ msg: 'Password and Confirm Password do not match.' })
  if (errors.length) return res.render('register', { errors, name, email, password, confirmPassword })

  User.findOne({ email }).lean()
    .then((user) => {
      console.log('here')
      if (user) {
        errors.push({ msg: 'This email already exists.' })
        return res.render('register', { errors, name, email, password, confirmPassword })
      }

      return bcrypt.genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) =>
          User.create({
            name,
            email,
            password: hash
          }))
        .then(() => res.redirect('/users/login'))
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

router.get('/logout', async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)

    req.flash('successMsg', 'You have successfully logged out.')
    res.redirect('/users/login')
  })
})

module.exports = router
