const express = require('express')
const router = express.Router()
const Record = require('../../models/records')
const Category = require('../../models/category')

const CATEGORY_ICON = {
    1: 'fa-solid fa-house fa-2xl',
    2: 'fa-solid fa-van-shuttle fa-2xl"',
    3: 'fa-solid fa-face-grin-beam fa-2xl',
    4: 'fa-solid fa-utensils fa-2xl',
    5: 'fa-solid fa-pen fa-2xl',
}

router.get('/', (req, res) => {
    Record.find().populate('categoryId')
        .lean()
        .then((records) => {
            // console.log(records)
            let totalAmount = 0
            records.forEach((record) => {
                record.icon = CATEGORY_ICON[record.categoryId.id]
                record.date = record.date.toISOString().split('T')[0]
                totalAmount += record.amount
            })
            res.render('index', { records , totalAmount})
        })
})

module.exports = router