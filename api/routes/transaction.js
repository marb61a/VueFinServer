const Transaction = require('../../models/transaction')
const mongoose = require('mongoose')

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

    Transaction.find(qry)
      .sort({ 'transactionDate': 1 })
      .exec()
      .then(docs => res.status(200).json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding user transactions',
          error: err
        })
      )
  })

  // Get the running transactions balance for a user
  router.get('/transaction/balance/:year/:month', function (req, res) {
    const userId = req.get('userId')
    const month = req.params.month - 1
    const year = req.params.year
    const endDt = new Date(Date.UTC(year, month, 1))
    const pipeline = [
      {
        $match: {
          // userId needs to be passed in as an objectID rather than a string
          userId: mongoose.Types.ObjectId(userId)
        }
      },
      {
        $match: {
          transactionDate: { $lt: endDt }
        }
      },
      {
        $group: {
          _id: null,
          charges: { $sum: '$charge' },
          deposits: { $sum: '$deposit' }
        }
      }
    ]

    Transaction.aggregate(pipeline)
      .exec()
      .then(docs => res.status(200).json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding user transactions',
          error: err
        })
      )
  })

  // Create a new transaction document
  router.post('/transaction', function (req, res) {
    let transaction = Transaction(req.body)

    transaction.save(function (err, transaction) {
      if (err) return console.log(err)
      res.status(200).json(transaction)
    })
  })
}
