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

io.use((socket, next) => {
  const email = socket.handshake.auth.email;
  if (!email) {
    return next(new Error("invalid email"));
  }
  socket.email = email;
  next();
});

io.on('connection', (socket) => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      email: socket.email,
    });
  }
  socket.emit("users", users);
  
  socket.broadcast.emit("newUser", {
    userID: socket.id,
    email: socket.email,
  });
  
  console.log('user CONNECTED');

  socket.on('disconnect', () => {
    socket.broadcast.emit("exitUser", {
      userID: socket.id,
      email: socket.email,
    });

    console.log('user DISCONNECTED');
  });
});

app.use('/', authRoutes)
app.use('/users', userRoutes)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})