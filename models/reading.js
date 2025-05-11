const mongoose = require('mongoose')

const readingSchema = mongoose.Schema({
  source: { type: String, required: true },
  timestamp: { type: Date, required: true },
  total_act_energy: { type: Number, required: true },
  total_act_ret_energy: { type: Number, required: true },
  max_act_power: { type: Number, required: true },
})
module.exports = mongoose.model('Reading', readingSchema, 'readings')
