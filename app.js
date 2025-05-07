const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

app.use(express.json())
logger.info('Server started')

module.exports = app
