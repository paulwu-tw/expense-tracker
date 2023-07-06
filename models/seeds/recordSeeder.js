const db = require('../../config/mongoose')
const category = require('../category')
const Categories = require('../category')
const Records = require('../records')
const Users = require('../users')
const bcrypt = require('bcryptjs')

const SEED_USERS = [
    {
        name: "user1",
        email: "user1@gmail.com",
        password: "1111"
    },
    {
        name: "user2",
        email: "user2@gmail.com",
        password: "1111"
    }
]

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

// db.once('open', async ()=> {
//     const category = await Categories.findOne({name: "家居物業"}).lean()
//     console.log(category)
// })

db.once('open', async () => {
    await Promise.all(SEED_USERS.map(async (user, user_index) => {
        const hash = await bcrypt.hash(user.password, await bcrypt.genSalt(10))
        const createdUser = await Users.create({
            name: user.name,
            email: user.email,
            password: hash
        })
        console.log(`Create User-${user_index}`)

        const userRecords = []
        for(const [record_index, record] of SEED_RECORDS.entries()) {
            if (record_index >= 3 * user_index && record_index < 3 * (user_index + 1)) {
                // console.log(record.category)
                const category = await Categories.findOne({ name: record.category }).lean()
                // console.log(category)
                record.userId = createdUser._id
                record.categoryId = category._id
                userRecords.push(record)
            }
        }
        return Records.create(userRecords)
    }))
    process.exit()
})
