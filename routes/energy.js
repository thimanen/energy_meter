const express = require('express')
const energyRouter = require('express').Router()
const { readRange } = require('../controllers/readRange')
const { logger } = require('../utils/logger')
const { getUtcRangeForLocalDate } = require('../helpers/dateUtils')

energyRouter.get('/', async (request, response) => {
  response.send('<h1>Energy meter</h1>')
})

energyRouter.get('/date/:date', async (request, response) => {
  const dateStr = request.params.date
  const { startUtc, endUtc } = getUtcRangeForLocalDate(dateStr)
  console.log(startUtc, endUtc)

  const energyReadings = readRange(startUtc, endUtc)
  console.log(energyReadings)
  response.json(energyReadings).end()
})

module.exports = energyRouter
