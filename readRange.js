require('dotenv').config()
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const Reading = require('./models/reading')
const { connectToMongoDB } = require('./helpers/db')

const run = async (startTs, endTs) => {
  const start = new Date(startTs)
  const end = new Date(endTs)
  logger.info(start)
  logger.info(end)

  try {
    await connectToMongoDB()

    const results = await Reading.find({
      timestamp: { $gte: start, $lte: end },
    })

    logger.info(
      `Found ${results.length} readings between ${start.toISOString()} and ${end.toISOString()}`,
    )

    results.forEach((reading) => {
      console.log(
        `[${reading.timestamp.toISOString()}] ${reading.source}: total_act_energy: ${reading.total_act_energy}`,
      )
    })

    await mongoose.disconnect()
  } catch (error) {
    logger.error('Error querying MongoDB: ', error.message)
    return
  }
}

if (require.main === module) {
  const [, , startArg, endArg] = process.argv
  logger.info(`got arguments: ${startArg} and ${endArg}`)

  run(startArg, endArg)
}

module.exports = { run }
