const cron = require('node-cron')
const { getDailyData, clearDailyData } = require('./datacollector')
const Reading = require('../models/reading')
const config = require('../utils/config')
const logger = require('../utils/logger')
const { getLastMongoTs } = require('../helpers/db')

const getCompleteData = async (source, shellyUrl) => {
  const sourceData = getDailyData().filter((s) => s.source === source)

  if (!sourceData.length) return []

  const lastMongoTs = await getLastMongoTs(source)
  console.log('last ts:', lastMongoTs, ' on ', source)
  const expectedStart = new Date(lastMongoTs.getTime() + 60 * 1000)
  console.log('expected start', expectedStart)
  const actualStart = new Date(sourceData[0].timestamp)
  console.log('actual start', actualStart)

  return []
}

const scheduleDailyUpload = (source, shellyUrl) => {
  const cronSchedule = config.UPLOAD_CRON_SCHEDULE || '1 0 * * *'

  cron.schedule(cronSchedule, async () => {
    /*
    const energyData = getDailyData()
    */
    const energyData = await getCompleteData(source, shellyUrl)

    if (energyData.length === 0) {
      logger.error(`[${source}] No data to upload to MongoDB`)
      return
    }

    try {
      await Reading.insertMany(energyData)
      const now = new Date()
      const localDateTime = now.toLocaleString()
      logger.info(
        `[${source}] Uploaded ${energyData.length} readings to MongoDB at ${localDateTime}`,
      )
      clearDailyData()
    } catch (error) {
      logger.error(`[${source}] Upload failed: ${error.message}`)
    }
  })

  logger.info(
    `[${source}] Daily upload to MongoDB scheduled with cron: ${cronSchedule}`,
  )
}

module.exports = { scheduleDailyUpload }
