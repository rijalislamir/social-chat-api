const connectDb = require('./database')
const express = require('express')
const app = express()

const conn = connectDb()
app.use(express.json())

app.get('/users', (req, res) => {
  conn.query(`SELECT * FROM users`, (err, results) => {
    if (err) {
      res.statusCode = 400

      res.send({
        status: 'failed',
        message: err
      })
    }
    
    return res.send({
      status: 'success',
      users: results
    })
  })
})

app.post('/users', (req, res) => {
  conn.query(`INSERT INTO users SET ?`, { name: 'Rijal' }, (err, result) => {
    if (err) {
      res.statusCode = 400

      res.send({
        status: 'failed',
        message: err
      })
    }
    
    return res.send({
      status: 'success',
    })
  })
})

app.put('/users', async (req, res) => {
  return res.send({
    method: 'PUT',
    endpoint: '/users'
  })
})

app.delete('/users', async (req, res) => {
  return res.send({
    method: 'DELETE',
    endpoint: '/users'
  })
})

app.listen(5000)