const express = require('express')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const app = express()
app.use(express.json())

app.use('/', authRoutes)
app.use('/users', userRoutes)

app.listen(5000)