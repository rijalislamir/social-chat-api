require('dotenv').config()
const http = require('http');
const express = require('express')
const cors = require('cors')
const { initializeSocketIO } = require('./socket')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 5000

initializeSocketIO(server)

app.use(cors())
app.use(express.json())

app.use('/', authRoutes)
app.use('/users', userRoutes)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})