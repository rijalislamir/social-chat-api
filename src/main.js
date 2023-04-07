require('dotenv').config()
const http = require('http');
const express = require('express')
const cors = require('cors')
const { initializeSocketIO } = require('./socket')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const conversationRoutes = require('./routes/conversation')
const messageRoutes = require('./routes/message')

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 5000

initializeSocketIO(server)

app.use(cors())
app.use(express.json({ limit: "665kb" }));

app.use('/', authRoutes)
app.use('/users', userRoutes)
app.use('/conversations', conversationRoutes)
app.use('/messages', messageRoutes)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})