const { logger } = require('../utils/logger')

const getTimeUntilNextMinute = () => {
  const now = new Date()
  return 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())
}

const getUtcRangeForLocalDate = (localDateStr) => {
  const localDate = new Date(localDateStr)

  const startLocal = new Date(localDate)
  startLocal.setHours(0, 0, 0, 0)
  const endLocal = new Date(localDate)
  endLocal.setHours(23, 59, 59, 999)

  const startUtc = new Date(startLocal)
  const endUtc = new Date(endLocal)

  return { startUtc, endUtc }
}

module.exports = { getTimeUntilNextMinute, getUtcRangeForLocalDate }
