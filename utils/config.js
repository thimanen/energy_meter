require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SHELLY_MAINS_URI = process.env.SHELLY_MAINS_URI
const SHELLY_SOLAR_URI = process.env.SHELLY_SOLAR_URI
const UPLOAD_CRON_SCHEDULE = process.env.UPLOAD_CRON_SCHEDULE

module.exports = {
  MONGODB_URI,
  PORT,
  SHELLY_MAINS_URI,
  SHELLY_SOLAR_URI,
  UPLOAD_CRON_SCHEDULE,
}
