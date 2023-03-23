const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../middlewares/auth')
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../handlers/user')

router.route('/all')
  .get(getAllUsers)
  
router.route('/')
  .get(authenticateToken, getUser)
  .post(createUser)

router.route('/:id')
  .put(authenticateToken, updateUser)
  .delete(authenticateToken, deleteUser)

module.exports = router