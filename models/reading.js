const mongoose = require('mongoose')

const readingSchema = mongoose.Schema({
  source: { type: String, required: true },
  timestamp: { type: Date, required: true },
  values: {
    total_act_energy: Number,
    max_act_power: Number,
  },
})
module.exports = mongoose.model('Reading', readingSchema, 'readings')
