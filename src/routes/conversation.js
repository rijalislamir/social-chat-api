const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../middlewares/auth')
const { createConversation, deleteConversation } = require('../handlers/conversation')
const { getConversationMessages } = require('../handlers/message')
const { getConversationUsers } = require('../handlers/user')

router.route('/')
  .post(authenticateToken, createConversation)

router.route('/:id')
  .delete(authenticateToken, deleteConversation)

router.route('/:id/users')
  .get(authenticateToken, getConversationUsers)

router.route('/:id/messages')
  .get(authenticateToken, getConversationMessages)

module.exports = router
