const axios = require('axios')
const logger = require('../utils/logger')
const config = require('../utils/config')
const Reading = require('../models/reading')
const { getTimeUntilNextMinute } = require('../helpers/dateUtils')

let dailyData = []

const getDailyData = () => {
  return dailyData
}

const clearDailyData = () => {
  dailyData.length = 0
}

const clearDailyDataForSource = (source) => {
  dailyData = dailyData.filter((s) => s.source !== source)
}

const aggregateData = (reading) => {
  const total_act_energy =
    reading.data[0].values[0][0] +
    reading.data[0].values[0][16] +
    reading.data[0].values[0][32]

  const total_act_ret_energy =
    reading.data[0].values[0][2] +
    reading.data[0].values[0][18] +
    reading.data[0].values[0][34]

  const max_act_power =
    reading.data[0].values[0][6] +
    reading.data[0].values[0][22] +
    reading.data[0].values[0][38]

  const ts = reading.data[0].ts

  return { total_act_energy, total_act_ret_energy, max_act_power, ts }
}

const fetchData = async (source, shellyUrl, startTimestamp) => {
  try {
    /*
    logger.info(
      `time now: ${Date.now() / 1000} and startTimestamp: ${startTimestamp}`,
    )
    */

    const url = `${shellyUrl}&ts=${startTimestamp}`
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

    dailyData.push(reading)

    /*
    logger.info(
      `meter data from ${source} at ${ts}: total energy: ${total_act_energy}, maximum power: ${max_act_power}, total returned energy: ${total_act_ret_energy}`,
    )
    logger.info(dailyData)
    */
  } catch (error) {
    logger.error('error in request:', error)
  }
}

const syncFirstRead = (source, shellyUrl) => {
  const delay = getTimeUntilNextMinute()
  logger.info(`[${source}] First read after ${delay / 1000} seconds`)

  setTimeout(() => {
    const startTimestamp = Math.floor(Date.now() / 1000) - 120

    fetchData(source, shellyUrl, startTimestamp)

    setInterval(() => {
      const startTimestamp = Math.floor(Date.now() / 1000) - 120

      fetchData(source, shellyUrl, startTimestamp)
    }, 60000)
  }, delay)
}

const startDataCollector = (source, shellyUrl) => {
  syncFirstRead(source, shellyUrl)
}

module.exports = {
  startDataCollector,
  aggregateData,
  getDailyData,
  clearDailyData,
  clearDailyDataForSource,
}
