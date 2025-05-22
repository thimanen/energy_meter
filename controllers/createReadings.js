const axios = require('axios')
const cron = require('node-cron')
const {
  getDailyData,
  aggregateData,
  clearDailyData,
  clearDailyDataForSource,
} = require('./datacollector')
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

  // if expected time is the same as actual time of the first readigs in the dailyData
  if (expectedStart.getTime() === actualStart.getTime()) {
    return sourceData
  }

  logger.error(
    `gap in readings for [${source}] between ${lastMongoTs.toISOString()} and ${actualStart.toISOString()}`,
  )

  let missingData = []

  console.log('now entering for-loop')
  for (
    let timest = new Date(expectedStart);
    timest < actualStart;
    timest = new Date(timest.setMinutes(timest.getMinutes() + 1))
  ) {
    try {
      console.log('timestamp: ', timest)
      const url = `${shellyUrl}&ts=${Math.floor(timest.getTime() / 1000)}`
      const response = await axios.get(url)
      const { total_act_energy, total_act_ret_energy, max_act_power, ts } =
        aggregateData(response.data)

      const reading = new Reading({
        source: source,
        timestamp: ts * 1000,
        total_act_energy,
        total_act_ret_energy,
        max_act_power,
      })

      console.log('reading looks like: ', reading)

      missingData.push(reading)
      console.log('missing data:', missingData)
    } catch (error) {
      loggger.error(
        `Èrror fetching data for [${source}] at ${timest.toISOString()}`,
        error,
      )
    }
  }

  const fullData = [...missingData, ...sourceData].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  )
  return fullData
}

const scheduleDailyUpload = (source, shellyUrl) => {
  const cronSchedule = config.UPLOAD_CRON_SCHEDULE || '1 0 * * *'

  cron.schedule(cronSchedule, async () => {
    const energyData = getDailyData().filter((s) => s.source === source)
    /*
    const energyData = getDailyData()
    const energyData = await getCompleteData(source, shellyUrl)
    */

    if (energyData.length === 0) {
      logger.error(`[${source}] No data to upload to MongoDB`)
      return
    }
    /*
    console.log('this goes to MongoDB now: ', energyData)
    */

    try {
      await Reading.insertMany(energyData)
      const now = new Date()
      const localDateTime = now.toLocaleString()
      logger.info(
        `[${source}] Uploaded ${energyData.length} readings to MongoDB at ${localDateTime}`,
      )
      clearDailyDataForSource(source)
    } catch (error) {
      logger.error(`[${source}] Upload failed: ${error.message}`)
    }
  })

  logger.info(
    `[${source}] Daily upload to MongoDB scheduled with cron: ${cronSchedule}`,
  )
}

module.exports = { scheduleDailyUpload }
