const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FaecbookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/users')

// setup passport strategy
module.exports = app => {
  // init passport
  app.use(passport.initialize())
  app.use(passport.session())

  // conifg passport-local strategy
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) return done(null, false, req.flash('warningMsg', 'This email is not registered.'))

        return bcrypt.compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) return done(null, false, req.flash('warningMsg', 'Email or Password incorrect.'))
            return done(null, user)
          })
      })
      .catch((err) => done(err, false))
  }))

  // config passport-facebook strategy
  passport.use(new FaecbookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json

    User.findOne({ email }).then((user) => {
      if (user) return done(null, user)

      const randomPassword = Math.random().toString(36).slice(-8)
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(randomPassword, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(user => done(null, user))
        .catch(err => done(err, false))
    })
  }))

  // serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null))
  })
}
