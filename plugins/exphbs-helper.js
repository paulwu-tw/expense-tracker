const exphbs = require('express-handlebars')

const helpers = exphbs.create({
  checkSelectValue: function (selectValue, optionValue) {
    if (selectValue === optionValue) return 'selected'
  }
})

module.exports = helpers
