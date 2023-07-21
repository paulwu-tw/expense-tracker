const db = require('../../config/mongoose')
const Categories = require('../category')

const SEED_CATEGORIES = [
  {
    name: '家居物業',
    name_en: 'house',
    icon: 'fa-solid fa-house fa-2xl'
  },
  {
    name: '交通出行',
    name_en: 'traffic',
    icon: 'fa-solid fa-van-shuttle fa-2xl'
  },
  {
    name: '休閒娛樂',
    name_en: 'entertainment',
    icon: 'fa-solid fa-face-grin-beam fa-2xl'
  },
  {
    name: '餐飲食品',
    name_en: 'food',
    icon: 'fa-solid fa-utensils fa-2xl'
  },
  {
    name: '其他',
    name_en: 'others',
    icon: 'fa-solid fa-pen fa-2xl'
  }
]

db.once('open', () => {
  Promise.all(SEED_CATEGORIES.map(SEED_CATEGORY => {
    return Categories.create(SEED_CATEGORY)
  }))
    .then(() => {
      console.log('Create categoreis done.')
      process.exit()
    })
})
