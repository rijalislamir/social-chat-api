require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const conn = require('../src/database')
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(authHeader)
  console.log(token)

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    console.log(user)
    req.user = user
    next()
  })
}

app.post('/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send({
        status: 'failed',
        message: 'Required both email and password!'
      })
    }

    conn.query('SELECT * FROM users WHERE ?', { email }, async (err, result) => {
      if (err) {
        return res.status(400).send({
          status: 'failed',
          message: err
        })
      }

      if (!result.length) {
        return res.status(400).send({
          status: 'failed',
          message: 'Email not registered!'
        })
      }

      const user = result[0]

      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        return res.send({
          status: 'success',
          accessToken
        })
      }
  
      return res.status(400).send({
        status: 'failed',
        message: 'Invalid credentials!'
      })
    })
  } catch (error) {
    return res.status(400).send({
      status: 'failed',
      message: error
    })
  }
})

app.get('/users', (_, res) => {
  conn.query(`SELECT * FROM users`, (err, users) => {
    if (err) {
      res.statusCode = 400

      res.send({
        status: 'failed',
        message: err
      })
    }
    
    return res.send({
      status: 'success',
      users
    })
  })
})

app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body
  
    if (!name || !email || !password) {
      return res.status(400).send({
        status: 'failed',
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
          status: 'failed',
          message: err
        })
      }
      
      return res.status(201).send({
        status: 'success',
        user
      })
    })
  } catch (error) {
    return res.status(400).send({
      status: 'failed',
      message: error
    })
  }
})

app.put('/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const { name, email } = req.body

  if (!name || !email) {
    res.statusCode = 400

    return res.send({
      status: 'failed',
      message: 'Required both name and email!'
    })
  }

  conn.query('UPDATE users SET ? WHERE ?', [{ name, email }, { id }], (err, result) => {
    if (err) {
      res.statusCode = 400

      return res.send({
        status: 'failed',
        message: err
      })
    }

    if (!result.affectedRows) {
      res.statusCode = 400

      return res.send({
        status: 'failed',
        message: 'User not found!'
      })
    }


    return res.send({
      status: 'success',
      user: {
        id,
        name,
        email
      }
    })
  })

})

app.delete('/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params

  if (id !== req.user.id) return res.status(403).send({
    status: 'failed',
    message: 'Forbidden'
  })

  conn.query('DELETE FROM users WHERE ?', { id }, (err, result) => {
    if (err) {
      res.statusCode = 400

      return res.send({
        status: 'failed',
        message: err
      })
    }

    if (!result.affectedRows) {
      res.statusCode = 400

      return res.send({
        status: 'failed',
        message: 'User not found!'
      })
    }

    return res.send({
      status: 'success',
      id
    })
  })

})

app.listen(5000)