const express = require('express')
const energyRouter = require('express').Router()
const { readRange } = require('../controllers/readRange')
const { readLatest } = require('../controllers/readLatest')
const { logger } = require('../utils/logger')
const {
  getUtcDayRangeForLocalDate,
  getUtcWeekRangeForLocalDate,
} = require('../helpers/dateUtils')
const {
  readAggregateByHour,
  readAggregateByDay,
} = require('../controllers/readAggregate')

energyRouter.get('/', async (request, response) => {
  response.send('<h1>Energy meter</h1>')
})

// GET /energy/date/:date raw data for the date
energyRouter.get('/date/:date', async (request, response) => {
  const dateStr = request.params.date
  const { startUtc, endUtc } = getUtcDayRangeForLocalDate(dateStr)

  try {
    const energyReadings = await readRange(startUtc, endUtc)
    response.json(energyReadings).end()
  } catch (error) {
    response.status(500).json({ error: 'Range read failed' })
  }
})

// GET /energy/now
energyRouter.get('/now', async (request, response) => {
  try {
    const energyReadings = await readLatest()
    response.json(energyReadings)
  } catch (error) {
    response.status(500).json({ error: 'Failed to read latest' })
  }
})

// GET /energy/hourly/:date
energyRouter.get('/hourly/:date', async (request, response) => {
  const dateStr = request.params.date
  const { startUtc, endUtc } = getUtcDayRangeForLocalDate(dateStr)

  try {
    const energyReadings = await readAggregateByHour(startUtc, endUtc)
    response.json(energyReadings)
  } catch (error) {
    response.status(500).json({ error: 'Aggregation failed' })
  }
})
// GET /energy/daily/:date
energyRouter.get('/daily/:date', async (request, response) => {
  const dateStr = request.params.date
  const { startUtc, endUtc } = getUtcWeekRangeForLocalDate(dateStr)

  try {
    const energyReadings = await readAggregateByDay(startUtc, endUtc)
    response.json(energyReadings)
  } catch (error) {
    response.status(500).json({ error: 'Aggregation failed' })
  }
})

module.exports = energyRouter
