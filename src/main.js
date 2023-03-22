const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/', authRoutes)
app.use('/users', userRoutes)

app.listen(5000)