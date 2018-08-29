const express = require('express')
const app = express()
const api = require('./api')
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 8081)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', api)
app.use(express.static('static'))

app.use(function (req, res, next) {
  const err = new Error('Not found')
  err.status = 404
  res.json(err)
})

const mongoose = require('mongoose')
mongoose.connect('')
