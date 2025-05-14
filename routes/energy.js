const express = require('express')
const energyRouter = require('express').Router()
const { readRange } = require('../controllers/readRange')
const { logger } = require('../utils/logger')

energyRouter.get('/', async (request, response) => {
  response.send('<h1>Energy meter</h1>')
})

energyRouter.get('/date/:date', async (request, response) => {
  const dateStr = request.params.date
  console.log(dateStr)
  

  // create start and end timestamps
  response.status(200).end()
})

module.exports = energyRouter
