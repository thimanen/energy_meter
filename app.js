const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const middleware = require('./utils/middleware')
const energyRouter = require('./routes/energy')

const { startDataCollector } = require('./controllers/datacollector')
const { connectToMongoDB, ensureTimeSeriesCollection } = require('./helpers/db')
const { scheduleDailyUpload } = require('./controllers/createReadings')

const app = express()
app.use(express.json())
logger.info('Express server started')
app.use(middleware.requestLogger)

// Connect to MongoDB
connectToMongoDB()
ensureTimeSeriesCollection()

const now = new Date()
logger.info(`time now is: ${now.toLocaleString()}`)

// Start collection of energy data
startDataCollector('solar', config.SHELLY_SOLAR_URI)
startDataCollector('mains', config.SHELLY_MAINS_URI)

// Schedule daily upload to MongoDB
scheduleDailyUpload()

// Routes

app.use('/energy', energyRouter)
app.use(middleware.unknownEndpoint)

module.exports = app
