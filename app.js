const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')

const startDataCollector = require('./controllers/datacollector')

const app = express()
app.use(express.json())
logger.info('Server started')

// MongoDB and Mongoose startup
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error in connecting to MongoDB:', error.message)
  })

// Start collection of energy data
startDataCollector('solar', config.SHELLY_SOLAR_URI)
startDataCollector('mains', config.SHELLY_MAINS_URI)

module.exports = app
