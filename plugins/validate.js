const validator = {
  recodrValidate: function (record) {
    const errors = []
    const date = new Date()
    const dateToday = date.toISOString().split('T')[0]

    if (record.date > dateToday) errors.push({ msg: "Date can't be future date." })
    if (record.amount < 0) errors.push({ msg: "Amount can't less then 0." })

    return errors
  }
}

module.exports = validator
