const { logger } = require('../utils/logger')

const getUtcRangeForLocalDate = (localDateStr) => {
  const localDate = new Date(localDateStr)
 
  const startLocal = new Date(localDate.setHours(0, 0, 0, 0))
  const endLocal = new Date(localDate.setHours(23, 59, 59, 999))

  const startUtc = new Date(
    startLocal.getTime() - startLocal.getTimezoneOffset() * 60000,
  )
  const endUtc = new Date(
    endLocal.getTime() - endLocal.getTimezoneOffset() * 60000,
  )

  return { startUtc, endUtc }
}

module.exports = { getUtcRangeForLocalDate }
