const config = require('../utils/config')
const logger = require('../utils/logger')
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

module.exports = { connectToMongoDB, ensureTimeSeriesCollection }
