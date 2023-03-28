const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../middlewares/auth')
const { createMessage } = require('../handlers/message')

router.route('/')
  .post(authenticateToken, createMessage)

module.exports = router
