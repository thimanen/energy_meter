const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const axios = require('axios')

const app = express()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

app.use(express.json())
logger.info('Server started')

const fetchData = async (startTimestamp, endTimestamp) => {
  try {
    const url = `${config.SHELLY_MAINS_URI}&ts=${startTimestamp}`
    logger.info(`time now: ${Date.now() / 1000} and startTimestamp: ${startTimestamp}`)
    const response = await axios.get(url)
    
    logger.info('Mittaridata:', response.data.data[0].values[0])
  } catch (error) {
    logger.error('Virhe pyynnössä:', error)
  }
}

const getTimeUntilNextMinute = () => {
  const now = new Date()
  return 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())
}

const syncFirstRead = () => {
  const delay = getTimeUntilNextMinute()
  logger.info(`Ensimmäinen luku tapahtuu ${delay / 1000} sekunnin kuluttua`)

  setTimeout(() => {
    const startTimestamp = Math.floor(Date.now() / 1000) - 120
    const endTimestamp = startTimestamp

    fetchData(startTimestamp, endTimestamp)

    setInterval(() => {
      const startTimestamp = Math.floor(Date.now() / 1000) - 120
      const endTimestamp = startTimestamp + 60
      fetchData(startTimestamp, endTimestamp)
    }, 60000)
  }, delay)
}

syncFirstRead()

module.exports = app
