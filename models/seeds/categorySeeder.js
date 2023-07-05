const db = require('../../config/mongoose')
const Categories = require('../category')

const SEED_CATEGORIES = [
    {
        id: 1,
        name: "家居物業"
    },
    {
        id: 2,
        name: "交通出行"
    },
    {
        id: 3,
        name: "休閒娛樂"
    },
    {
        id: 4,
        name: "餐飲食品"
    },
    {
        id: 5,
        name: "其他"
    }
]

db.once('open', () => {
    Promise.all(SEED_CATEGORIES.map(SEED_CATEGORY => {
        return Categories.create(SEED_CATEGORY)
    }))
    .then(()=>{
        console.log("Create categoreis done.")
        process.exit()
    })
})