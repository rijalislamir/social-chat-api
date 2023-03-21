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
  const { name } = req.body

  if (!name) {
    res.statusCode = 400

    return res.send({
      status: 'failed',
      message: 'Required a name!'
    })
  }

  conn.query(`INSERT INTO users SET ?`, { name }, (err, result) => {
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
        id: result.insertId,
        name
      }
    })
  })
})

app.put('/users/:id', async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!name) {
    res.statusCode = 400

    return res.send({
      status: 'failed',
      message: 'Required a name!'
    })
  }

  conn.query('UPDATE users SET ? WHERE ?', [{ name }, { id }], (err, result) => {
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
        name
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