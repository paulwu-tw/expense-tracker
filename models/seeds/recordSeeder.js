const db = require('../../config/mongoose')
const Categories = require('../category')
const Records = require('../records')

const SEED_RECORDS = [
    {
        name: "午餐",
        amount: "60",
        date: "2019-04-23",
        category: "餐飲食品"
    },
    {
        name: "晚餐",
        amount: "60",
        date: "2019-04-23",
        category: "餐飲食品"
    },
    {
        name: "捷運",
        amount: "120",
        date: "2019-04-23",
        category: "交通出行"
    },
    {
        name: "電影:驚奇隊長",
        amount: "60",
        date: "2019-04-23",
        category: "休閒娛樂"
    },
    {
        name: "租金",
        amount: "25000",
        date: "2019-04-01",
        category: "家居物業"
    }
]

db.once('open', () => {
    Promise.all(SEED_RECORDS.map(SEED_RECORD =>
        Categories.find({ name: SEED_RECORD.category })
            .lean()
            .then((category) => {
                const categoryId = category[0]._id
                SEED_RECORD.categoryId = categoryId
                return Records.create(SEED_RECORD)
            })
    ))
        .then(() => {
            console.log('Create records done.')
            process.exit()
        })
})
