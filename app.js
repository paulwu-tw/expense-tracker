const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const routes = require('./routes')
const helpers = require('./plugins/exphbs-helper')

require('dotenv').config
require('./config/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers
}))
app.set('view engine', 'hbs')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(flash())
usePassport(app)

// add middleware for authenticate
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated(),
  res.locals.user = req.user
  res.locals.successMsg = req.flash('successMsg')
  res.locals.warningMsg = req.flash('warningMsg')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
