require('dotenv').config()
const mongoose = require('mongoose')
const logger = require('../utils/logger')
const Reading = require('../models/reading')

const readRange = async (startTs, endTs) => {
  const start = new Date(startTs)
  const end = new Date(endTs)

  try {
    const results = await Reading.find({
      timestamp: { $gte: start, $lte: end },
    })

    logger.info(
      `Found ${results.length} readings between ${start.toISOString()} and ${end.toISOString()}`,
    )

    /*
    results.forEach((reading) => {
      console.log(
        `[${reading.timestamp.toISOString()}] ${reading.source}: total_act_energy: ${reading.total_act_energy}`,
      )
    })*/
    return results
  } catch (error) {
    logger.error('Error querying MongoDB: ', error.message)
    return
  }
}

module.exports = { readRange }
