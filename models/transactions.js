const mongoose = require('mongoose')
const Schema = mongoose.Schema

let transactionSchema = new Schema({

})

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = Transaction
