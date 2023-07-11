const express = require('express')
const router = express.Router()
const Record = require('../../models/records')
const Category = require('../../models/category')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId }).populate('categoryId')
    .lean()
    .then((records) => {
      // console.log(records)
      let totalAmount = 0
      records.forEach((record) => {
        // record.icon = CATEGORY_ICON[record.categoryId.id]
        record.date = record.date.toISOString().split('T')[0]
        totalAmount += record.amount
      })
      res.render('index', { records, totalAmount })
    }).catch((err) => console.log(err))
})

// stupid way need refactor
router.get('/filter', (req, res) => {
  const userId = req.user._id
  const { category, sort } = req.query
  if (category) {
    Category.findOne({ name: category }).lean()
      .then((categoryId) => {
        Record.find({ categoryId: categoryId._id, userId }).populate('categoryId').lean()
          .sort(`${sort}`)
          .then((records) => {
            let totalAmount = 0
            records.forEach((record) => {
              // record.icon = CATEGORY_ICON[record.categoryId.id]
              record.date = record.date.toISOString().split('T')[0]
              totalAmount += record.amount
            })
            res.render('index', { records, totalAmount, category, sort })
          }).catch((err) => console.log(err))
      }).catch((err) => console.log(err))
  } else {
    Record.find({ userId }).populate('categoryId')
      .lean()
      .sort(`${sort}`)
      .then((records) => {
        let totalAmount = 0
        records.forEach((record) => {
          // record.icon = CATEGORY_ICON[record.categoryId.id]
          record.date = record.date.toISOString().split('T')[0]
          totalAmount += record.amount
        })
        res.render('index', { records, totalAmount, sort })
      }).catch((err) => console.log(err))
  }
})

module.exports = router
