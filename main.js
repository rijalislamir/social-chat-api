const { v4: uuidv4 } = require('uuid');
const conn = require('./database')
const express = require('express')
const app = express()

app.use(express.json())

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

app.post('/users', (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    res.statusCode = 400

    return res.send({
      status: 'failed',
      message: 'Required both name and email!'
    })
  }

  const id = uuidv4()

  conn.query(`INSERT INTO users SET ?`, { id, name, email }, (err, result) => {
    if (err) {
      res.statusCode = 400

      return res.send({
        status: 'failed',
        message: err
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

app.put('/users/:id', async (req, res) => {
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

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params

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