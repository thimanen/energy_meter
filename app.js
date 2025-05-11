const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')

const { startDataCollector } = require('./controllers/datacollector')
const { connectToMongoDB, ensureTimeSeriesCollection } = require('./helpers/db')

const app = express()
app.use(express.json())
logger.info('Server started')

// Connect to MongoDB
connectToMongoDB()
ensureTimeSeriesCollection()

// Start collection of energy data
startDataCollector('solar', config.SHELLY_SOLAR_URI)
startDataCollector('mains', config.SHELLY_MAINS_URI)
const now = new Date()
logger.info({
  now,
    toDateString: now.toDateString(),
    toISOString: now.toISOString(),
    toLocaleString: now.toLocaleString(),
    toLocaleDateString: now.toLocaleDateString(),
    toLocaleTimeString: now.toLocaleTimeString(),
    toUTCString: now.toUTCString(),
    toTimeString: now.toTimeString(),})

module.exports = app
