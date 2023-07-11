const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    red: 'users',
    required: true
  }
})

module.exports = mongoose.model('records', recordSchema)
