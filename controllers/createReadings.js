const cron = require('node-cron')
const { getDailyData, clearDailyData } = require('./datacollector')
const Reading = require('../models/reading')
const config = require('../utils/config')
const logger = require('../utils/logger')

const scheduleDailyUpload = () => {
  const cronSchedule = config.UPLOAD_CRON_SCHEDULE || '1 0 * * *'

  cron.schedule(cronSchedule, async () => {
    const energyData = getDailyData()
    if (energyData.length === 0) {
      logger.error('No data to upload to MongoDB')
      return
    }

    try {
      await Reading.insertMany(energyData)
      logger.info(`Uploaded ${energyData.length} readings to MongoDB`)
      clearDailyData()
    } catch (error) {
      logger.error('Upload failed:', error.message)
    }
  })

  logger.info(`Daily upload to MongoDB scheduled with cron: ${cronSchedule}`)
}

module.exports = { scheduleDailyUpload }
