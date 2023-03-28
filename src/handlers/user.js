const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
const conn = require('../database')

const getAllUsers = (_, res) => {
  conn.query(`SELECT * FROM users`, (err, users) => {
    if (err) {
      res.statusCode = 400

      res.send({
        success: false,
        message: err
      })
    }
    
    return res.send({
      success: true,
      users
    })
  })
}

const getUser = (req, res) => {
  conn.query(`SELECT * FROM users WHERE ? LIMIT 1`, { id: req.user.id }, (err, result) => {
    if (err) {
      res.status(400).send({
        success: false,
        message: err
      })
    }

    const user = result[0]
    if (user) delete user.password

    return res.send({
      success: true,
      user
    })
  })
}

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
  
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Required name, email, and password field!'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword
    }
  
    conn.query(`INSERT INTO users SET ?`, user, (err) => {
      if (err) {  
        return res.status(400).send({
          success: false,
          message: err
        })
      }
      
      return res.status(201).send({
        success: true,
        user
      })
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
}

const updateUser = (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (id !== req.user.id) return res.status(403).send({
    success: false,
    message: 'Forbidden!'
  })

  if (!name) {
    res.statusCode = 400

    return res.send({
      success: false,
      message: 'Required a name!'
    })
  }

  conn.query('UPDATE users SET ? WHERE ?', [{ name }, { id }], (err, result) => {
    if (err) {
      res.statusCode = 400

      return res.send({
        success: false,
        message: err
      })
    }

    if (!result.affectedRows) {
      res.statusCode = 400

      return res.send({
        success: false,
        message: 'User not found!'
      })
    }


    return res.send({
      success: true,
      user: {
        id,
        name,
        email: req.user.email
      }
    })
  })
}

const deleteUser = (req, res) => {
  const { id } = req.params

  if (id !== req.user.id) return res.status(403).send({
    success: false,
    message: 'Forbidden!'
  })

  conn.query('DELETE FROM users WHERE ?', { id }, (err, result) => {
    if (err) {
      res.statusCode = 400

      return res.send({
        success: false,
        message: err
      })
    }

    if (!result.affectedRows) {
      res.statusCode = 400

      return res.send({
        success: false,
        message: 'User not found!'
      })
    }

    return res.send({
      success: true,
      id
    })
  })
}

const getConversationUsers = (req, res) => {
  try {
    const { id } = req.params

    conn.query(`
        SELECT users.id, users.name, users.email FROM users_conversations
        JOIN users
        ON users_conversations.userId = users.id
        WHERE ?
      `,
      { conversationId: id },
      (err, result) => {
        if (err) {
          return res.status(400).send({
            success: false,
            message: err
          })
        }

        return res.send({
          success: true,
          users: result
        })
      }
    )
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  } 
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getConversationUsers
}
