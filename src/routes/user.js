const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../middlewares/auth')
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../handlers/user')
const { getUserConversations, createUserConversation } = require('../handlers/conversation')

router.route('/all')
  .get(getAllUsers)
  
router.route('/')
  .get(authenticateToken, getUser)
  .post(createUser)

router.route('/:id')
  .put(authenticateToken, updateUser)
  .delete(authenticateToken, deleteUser)
  
router.route('/:userId/conversations')
  .get(authenticateToken, getUserConversations)
  
router.route('/:userId/conversations/:conversationId')
  .post(authenticateToken, createUserConversation)

module.exports = router