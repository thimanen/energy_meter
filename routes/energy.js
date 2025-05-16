const express = require('express')
const energyRouter = require('express').Router()
const { readRange } = require('../controllers/readRange')
const { logger } = require('../utils/logger')
const { getUtcRangeForLocalDate } = require('../helpers/dateUtils')
const { readAggregateByHour } = require('../controllers/readAggregateByHour')

energyRouter.get('/', async (request, response) => {
  response.send('<h1>Energy meter</h1>')
})

energyRouter.get('/date/:date', async (request, response) => {
  const dateStr = request.params.date
  const { startUtc, endUtc } = getUtcRangeForLocalDate(dateStr)

  try {
    const energyReadings = await readRange(startUtc, endUtc)
    response.json(energyReadings).end()
  } catch (error) {
    response.status(500).json({ error: 'Range read failed' })
  }
})

energyRouter.get('/hourly/:date', async (request, response) => {
  const dateStr = request.params.date
  const { startUtc, endUtc } = getUtcRangeForLocalDate(dateStr)
  console.log('startUtc:' , startUtc)
  console.log('endUtc: ', endUtc)

  try {
    const energyReadings = await readAggregateByHour(startUtc, endUtc)
    response.json(energyReadings)
  } catch (error) {
    response.status(500).json({ error: 'Aggregation failed' })
  }
})

module.exports = energyRouter
