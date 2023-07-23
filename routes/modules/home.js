const express = require('express')
const router = express.Router()
const Record = require('../../models/records')
const Category = require('../../models/category')
const toolBox = require('../../plugins/toolBox')

let categories;
async function getCategories() {
  const categoryFind = await Category.find().lean()
  categories = categoryFind
}
getCategories()

router.get('/', async (req, res) => {
  const userId = req.user._id
  try {
    const records = await Record.find({ userId }).populate('categoryId').lean()

    const result = toolBox.caculateAmount(records)
    res.render('index', { categories, records: result.records, totalAmount: result.totalAmount })
  } catch (err) {
    console.log(err)
  }
})

// stupid way need refactor
router.get('/filter', async (req, res) => {
  const condition = {userId: req.user._id} // set condition to an object for search
  const { category, sort } = req.query

  let filterCategory = 'all'
  if (category !== 'all') {
    filterCategory = await Category.findOne({ name_en: category }).lean()
    condition.categoryId = filterCategory._id
  }

  const filterRecords = await Record.find(condition)
    .populate('categoryId')
    .sort(`${sort}`)
    .lean()

  const {records, totalAmount} = toolBox.caculateAmount(filterRecords)
  res.render('index', { records, totalAmount, categories, category, sort })
})

module.exports = router
