const Transaction = require('../../models/transaction')

module.exports = function (router) {
  // Get the transactions for a given year, month etc by userId
  router.get('/transaction/:year/:month', function (req, res) {
    const userId = req.get('userId')
    const month = req.params.month - 1
    const year = req.params.year
    const startDt = new Date(Date.UTC(year, month, 1, 0, 0, 0))
    const endDt = new Date(Date.UTC(year, month, 1, 1, 0, 0, 0))

    const qry = {
      userId: userId,
      transactionDate: {
        $gte: startDt,
        $lt: endDt
      }
    }
  })
}
