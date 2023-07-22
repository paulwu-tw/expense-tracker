
const toolBox = {
  caculateAmount: function (records) {
    let totalAmount = 0
    records.forEach((record) => {
      record.date = record.date.toISOString().split('T')[0]
      totalAmount += record.amount
    })

    return { records, totalAmount }
  }
}

module.exports = toolBox
