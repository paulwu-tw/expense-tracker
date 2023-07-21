const express = require('express')
const router = express.Router()
const Record = require('../../models/records')
const Category = require('../../models/category');
const records = require('../../models/records');

let categories;
async function getCategories() {
  const categoryFind = await Category.find().lean()
  categories = categoryFind
}
getCategories()

function caculateAmount(records) {
  let totalAmount = 0
  records.forEach((record) => {
    record.date = record.date.toISOString().split('T')[0]
    totalAmount += record.amount
  })

  return { records, totalAmount }
}

router.get('/', async (req, res) => {
  const userId = req.user._id
  try {
    const records = await Record.find({ userId }).populate('categoryId').lean()
    
    const result = caculateAmount(records)
    res.render('index', { categories, records: result.records, totalAmount: result.totalAmount })
  } catch (err) {
    console.log(err)
  }

})

// stupid way need refactor
router.get('/filter', async (req, res) => {
  const userId = req.user._id
  const { category, sort } = req.query

  const records = await Record.find({ userId }).populate('categoryId').lean().sort(`${sort}`)
  const filterRecords = records.filter((record)=>{
    if (category === 'all') return record
    else if(record.categoryId.name_en === category) return record
  })

  const result = caculateAmount(filterRecords)
  console.log("After Filter Category: ", category)
  res.render('index', { records: result.records, totalAmount: result.totalAmount, categories, category, sort })

})

module.exports = router
