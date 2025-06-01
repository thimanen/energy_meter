const { DateTime } = require('luxon')

const getTimeUntilNextMinute = () => {
  const now = new Date()
  return 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())
}

const getUtcDayRangeForLocalDate = (localDateStr) => {
  // use Luxon packgae to better deal with daylight savings etc.
  const startLocal = DateTime.fromISO(localDateStr, {
    zone: 'Europe/Helsinki',
  }).startOf('day')
  const endLocal = startLocal.endOf('day')

  const startUtc = startLocal.toUTC().toJSDate()
  const endUtc = endLocal.toUTC().toJSDate()

  return { startUtc, endUtc }
}

const getUtcWeekRangeForLocalDate = (localDateStr) => {
  const zone = 'Europe/Helsinki'
  const startLocal = DateTime.fromISO(localDateStr, {zone}).startOf('day')
  const endLocal = startLocal.plus({ days: 7 }).startOf('day')

  const startUtc = startLocal.toUTC().toJSDate()
  const endUtc = endLocal.toUTC().toJSDate()

  return { startUtc, endUtc }
}

module.exports = {
  getTimeUntilNextMinute,
  getUtcDayRangeForLocalDate,
  getUtcWeekRangeForLocalDate,
}
