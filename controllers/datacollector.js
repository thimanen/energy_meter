const axios = require('axios')
const logger = require('../utils/logger')
const config = require('../utils/config')

const dailyData = {
  solar: [],
  mains: [],
}

const aggregateData = (reading) => {
  const total_act_energy =
    reading.data[0].values[0][0] +
    reading.data[0].values[0][16] +
    reading.data[0].values[0][32]

  const max_act_power =
    reading.data[0].values[0][6] +
    reading.data[0].values[0][22] +
    reading.data[0].values[0][38]

  const ave_power =
    (reading.data[0].values[0][12] * reading.data[0].values[0][15] +
      reading.data[0].values[0][28] * reading.data[0].values[0][31] +
      reading.data[0].values[0][44] * reading.data[0].values[0][47]) /
    3

  const ts = reading.data[0].ts

  return { total_act_energy, max_act_power, ave_power, ts }
}

const fetchData = async (source, shellyUrl, startTimestamp) => {
  try {
    logger.info(
      `time now: ${Date.now() / 1000} and startTimestamp: ${startTimestamp}`,
    )

    const url = `${shellyUrl}&ts=${startTimestamp}`
    const response = await axios.get(url)
    const { total_act_energy, max_act_power, ave_power, ts } = aggregateData(
      response.data,
    )

    dailyData[source].push({
      source,
      timestamp: ts,
      values: { total_act_energy, max_act_power, ave_power },
    })

    logger.info(
      `meter data from ${source} at ${ts}: total energy: ${total_act_energy}, maximum power: ${max_act_power}, average power: ${ave_power}`,
    )
  } catch (error) {
    logger.error('error in request:', error)
  }
}

const getTimeUntilNextMinute = () => {
  const now = new Date()
  return 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())
}

const syncFirstRead = (source, shellyUrl) => {
  const delay = getTimeUntilNextMinute()
  logger.info(`source ${source}: first read after ${delay / 1000} seconds`)

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

module.exports = startDataCollector
