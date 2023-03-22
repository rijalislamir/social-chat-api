const express = require('express')
const router = express.Router()

const { authenticateToken } = require('../middlewares/auth')
const { getAllUsers, createUser, updateUser, deleteUser } = require('../handlers/user')

router.route('/')
  .get(getAllUsers)
  .post(createUser)

router.route('/:id')
  .put(authenticateToken, updateUser)
  .delete(authenticateToken, deleteUser)

module.exports = router