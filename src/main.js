require('dotenv').config()
const http = require('http');
const express = require('express')
const cors = require('cors')
const { Server } = require("socket.io");

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 5000
const io = new Server(
  server,
  {
    cors: {
      origin: process.env.FRONTEND_URL
    }
  }
);

app.use(cors())
app.use(express.json())

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use('/', authRoutes)
app.use('/users', userRoutes)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})