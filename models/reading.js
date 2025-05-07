const mongoose = require('mongoose')

const readingSchema = mongoose.Schema({
  source: { type: String, required: true },
  timestamp: { type: Date, required: true },
  values: {
    total_current: Number,
    total_act_power: Number,
    total_aprt_power: Number,
  },
})
module.exports = mongoose.model('Reading', readingSchema, 'readings')
