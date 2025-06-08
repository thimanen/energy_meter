const { getDailyData } = require('./datacollector')

const readLatest = async () => {
  try {
    const dailyDataAll = await getDailyData()
    const dailyDataSolar = dailyDataAll.filter((s) => s.source === 'solar')

    if (dailyDataSolar.length === 0) {
      return
    }
    return dailyDataSolar[dailyDataSolar.length - 1]
  } catch (error) {
    logger.error('Reading latest data failed:', error.message)
    return
  }
}

module.exports = { readLatest }
