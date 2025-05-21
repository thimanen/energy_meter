const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const middleware = require('./utils/middleware')
const energyRouter = require('./routes/energy')
const { shutdown, getLastMongoTs } = require('./helpers/db')

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
logger.info(`Local time: ${now.toLocaleString()}`)

// Start collection of energy data
startDataCollector('solar', config.SHELLY_SOLAR_URI)
startDataCollector('mains', config.SHELLY_MAINS_URI)

// Schedule daily upload to MongoDB
scheduleDailyUpload('solar', config.SHELLY_SOLAR_URI)
scheduleDailyUpload('mains', config.SHELLY_MAINS_URI)
// Routes

app.use('/energy', energyRouter)
app.use(middleware.unknownEndpoint)

// handle abrupt termination such as ctrl-C in terminal
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

module.exports = app
