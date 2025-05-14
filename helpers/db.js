const config = require('../utils/config')
const logger = require('../utils/logger')
const { getDailyData, clearDailyData } = require('../controllers/datacollector')
const Reading = require('../models/reading')
const mongoose = require('mongoose')

// MongoDB and Mongoose startup

const connectToMongoDB = async () => {
  mongoose.set('strictQuery', false)

  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error in connecting to MongoDB:', error.message)
    })
}

const closeMongoDB = async () => {
  try {
    await mongoose.disconnect()
    logger.info('MongoDB disconnected')
  } catch (error) {
    logger.error('MongoDB disconnect unsuccesfull')
    process.exit(1)
  }
}

const ensureTimeSeriesCollection = async () => {
  const conn = mongoose.connection
  const collection = await conn.listCollections({ name: 'readings' })

  if (collection.length === 0) {
    await conn.createCollection('readings', {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'sourse',
        granularity: 'minutes',
      },
    })
    logger.info('created time-series collection "readings"')
  } else {
    logger.info('Time-series collection "readings" exists')
  }
}

const shutdown = async () => {
  logger.info('Shutting down...')

  try {
    const energyData = getDailyData()
    if (energyData.length === 0) {
      logger.error('No data to upload to MongoDB')
      process.exit(0)
    }

    await Reading.insertMany(energyData)
    const now = new Date()
    const localDateTime = now.toLocaleString()
    logger.info(
      `Uploaded ${energyData.length} readings to MongoDB at ${localDateTime}`,
    )
    await closeMongoDB()
    clearDailyData()
  } catch (error) {
    logger.error('Upload failed:', error.message)
    process.exit(1)
  }
}

module.exports = {
  connectToMongoDB,
  closeMongoDB,
  ensureTimeSeriesCollection,
  shutdown,
}
