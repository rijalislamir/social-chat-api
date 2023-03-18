const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const express = require('express')
const app = express()
app.use(express.json())

app.post('/users', async (req, res) => {
  const { name, email, phone } = req.body

  if (!name || !email || !phone ) {
    const fields = []
    res.statusCode = 400
    
    if (!name) fields.push('name')
    if (!email) fields.push('email')
    if (!phone) fields.push('phone')

    return res.send({
      error: `Cannot found [${fields.map((field, i) => i ? ' ' + field : field)}] field${fields.length > 1 ? 's' : ''}!`
    })
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      phone
    }
  })

  return res.send(newUser)
})

app.delete('/users', async (req, res) => {
  const { id } = req.body

  if (typeof id !== 'string') {
    res.statusCode = 400
    
    return res.send({
      error: `Wrong type of id. Should be string!`
    })
  }

  if (!id) {
    res.statusCode = 400
    
    return res.send({
      error: `Cannot found id!`
    })
  }

  const deletedUser = await prisma.user.deleteMany({
    where: { id }
  })

  if (!deletedUser.count) {
    res.statusCode = 400

    return res.send({
      error: `Cannot found user!`
    })
  }
  
  return res.send({ id })
})

app.listen(5000)