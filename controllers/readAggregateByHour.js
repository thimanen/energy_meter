const logger = require('../utils/logger')
const Reading = require('../models/reading')

const readAggregateByHour = async (startTs, endTs) => {
  const start = new Date(startTs)
  const end = new Date(endTs)

  try {
    const results = await Reading.aggregate([
      {
        $match: {
          timestamp: { $gte: startTs, $lt: endTs },
        },
      },
      {
        $group: {
          _id: {
            source: '$source',
            hour: {
              $dateTrunc: {
                date: '$timestamp',
                unit: 'hour',
              },
            },
          },
          total_act_energy: { $sum: '$total_act_energy' },
          total_act_ret_energy: { $sum: '$total_act_ret_energy' },
          max_act_power: { $max: '$max_act_power' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          source: '$_id.source',
          timestamp: '$_id.hour',
          total_act_energy: 1,
          total_act_ret_energy: 1,
          max_act_power: 1,
          count: 1,
        },
      },
      {
        $sort: { timestamp: 1, source: 1 },
      },
    ])

    return results
  } catch (error) {
    logger.error('Aggregation error:', error.message)
    return
  }
}

module.exports = { readAggregateByHour }
