const express = require('express')
const app = express()
app.use(express.json())

app.get('/users', async (req, res) => {
  return res.send({
    method: 'GET',
    endpoint: '/users'
  })
})

app.post('/users', async (req, res) => {
  return res.send({
    method: 'DELETE',
    endpoint: '/users'
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