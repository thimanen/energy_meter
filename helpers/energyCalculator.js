const logger = require('../utils/logger')

// round to four digits
const roundToFour = (value) => Math.round(value * 10000) / 10000

const computeEnergyFlows = (mains, solar) => {
  if (!mains || !solar) {
    logger.error('Both mains and solar energy readings are required')
  }

  const timestamp = mains.timestamp
  const solarProduced = roundToFour(solar.total_act_energy)
  const solarSold = roundToFour(mains.total_act_ret_energy)
  const mainsBought = roundToFour(mains.total_act_energy)
  const solarUsed = roundToFour(solarProduced - solarSold)
  const totalConsumption = roundToFour(mainsBought + solarUsed)
  const netFlow = roundToFour(mainsBought - solarSold)

  return {
    timestamp,
    solarProduced,
    solarSold,
    mainsBought,
    solarUsed,
    totalConsumption,
    netFlow,
  }
}

const createTimestampsForDate = (dateStr) => {
    
}

module.exports = { computeEnergyFlows }
