const express = require('express')
const router = express.Router()
const Record = require('../../models/records')
const Category = require('../../models/category')
const validator = require('../../plugins/validate')

router.get('/create', (req, res) => {
  res.render('new')
})

router.post('/create', (req, res) => {
  const userId = req.user._id
  const record = req.body
  const errors = validator.recodrValidate(record)
  if (errors.length) return res.render('new', { errors, record })

  record.userId = userId
  Category.findOne({ name: record.category }).lean()
    .then((category) => {
      record.categoryId = category._id
      return Record.create(record)
        .then(() => res.redirect('/'))
        .catch((err) => console.log(err))
    }).catch((err) => console.log(err))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findOne({ _id: id }).populate('categoryId')
    .lean()
    .then((record) => {
      record.date = record.date.toISOString().split('T')[0]
      res.render('edit', { record })
    }).catch((err) => console.log(err))
})

router.put('/:id', (req, res) => {
  const record = req.body
  const id = req.params.id
  const errors = validator.recodrValidate(record)
  if (errors.length) return res.render('new', { errors, record })

  Category.findOne({ name: record.category }).lean()
    .then((category) => {
      record.categoryId = category._id
      return Record.updateOne({ _id: id }, record)
        .then(() => res.redirect('/'))
        .catch((err) => console.log(err))
    }).catch((err) => console.log(err))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.deleteOne({ _id: id })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

module.exports = router
