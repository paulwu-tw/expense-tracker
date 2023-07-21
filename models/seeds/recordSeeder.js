const db = require('../../config/mongoose')
const Categories = require('../category')
const Records = require('../records')
const Users = require('../users')
const bcrypt = require('bcryptjs')
const data = require('./data.json').data

const SEED_USERS = data.SEED_USERS
const SEED_RECORDS = data.SEED_RECORDS

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
    for (const [record_index, record] of SEED_RECORDS.entries()) {
      if (record_index >= 3 * user_index && record_index < 3 * (user_index + 1)) {
        // console.log(record.category)
        const category = await Categories.findOne({ name_en: record.category }).lean()
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
