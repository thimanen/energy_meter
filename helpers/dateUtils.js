const { DateTime } = require('luxon')

const getTimeUntilNextMinute = () => {
  const now = new Date()
  return 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())
}

const getUtcRangeForLocalDate = (localDateStr) => {
  // calculate UtC range without luxon package
  /*
  const localDate = new Date(localDateStr)

  const startLocal = new Date(localDate)
  startLocal.setHours(0, 0, 0, 0)
  const endLocal = new Date(localDate)
  endLocal.setHours(23, 59, 59, 999)

  const startUtc = new Date(startLocal)
  const endUtc = new Date(endLocal)
  */

  // use Luxon packgae to better deal with daylight savings etc.
  const startLocal = DateTime.fromISO(localDateStr, {
    zone: 'Europe/Helsinki',
  }).startOf('day')
  const endLocal = startLocal.endOf('day')

  const startUtc = startLocal.toUTC().toJSDate()
  const endUtc = endLocal.toUTC().toJSDate()

  return { startUtc, endUtc }
}

module.exports = { getTimeUntilNextMinute, getUtcRangeForLocalDate }
