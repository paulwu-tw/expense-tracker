const express = require('express')
const router = express.Router()
const Record = require('../../models/records')
const Category = require('../../models/category')
const validator = require('../../plugins/validate')


let categories;
async function getCategories() {
  const categoryFind = await Category.find().lean()
  categories = categoryFind
}
getCategories()

router.get('/create', async (req, res) => {
  try {
    // const categories = await Category.find().lean()
    res.render('new', { categories })
  } catch (err) {
    console.error(err)
  }

})

router.post('/create', async (req, res) => {
  const userId = req.user._id
  const record = req.body
  record.userId = userId

  // validate input data
  const errors = validator.recodrValidate(record)
  if (errors.length) return res.render('new', { errors, record })

  try {
    const category = await Category.findOne({ name_en: record.category }).lean()
    record.categoryId = category._id

    await Record.create(record)
    res.redirect('/')
  } catch (err) {
    console.error(err)
  }

})

router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  try {
    // const categories = await Category.find().lean()
    const record = await Record.findOne({ _id: id }).populate('categoryId').lean()
    record.date = record.date.toISOString().split('T')[0]

    res.render('edit', { record, categories, category: record.categoryId.name_en})
  } catch (err) {
    console.error(err)
  }

})

router.put('/:id', async (req, res) => {
  const record = req.body
  const id = req.params.id
  
  // validate input data 
  const errors = validator.recodrValidate(record)
  if (errors.length) return res.render('new', { errors, record })

  try {
    const category = await Category.findOne({ name_en: record.category }).lean()
    record.categoryId = category._id
    await Record.updateOne({ _id: id }, record)
    res.redirect('/')
  } catch (err) {
    console.error(err)
  }

})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    await Record.deleteOne({ _id: id })
    res.redirect('/')
  } catch (err) {
    console.error(err)
  }

})

module.exports = router
