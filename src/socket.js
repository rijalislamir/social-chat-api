require('dotenv').config()
const { Server } = require("socket.io");

const initializeSocketIO = (server) => {
  const io = new Server(
    server,
    {
      cors: {
        origin: process.env.FRONTEND_URL
      }
    }
  );

  io.use((socket, next) => {
    const email = socket.handshake.auth.email;
    const name = socket.handshake.auth.name;
    if (!email) {
      return next(new Error("invalid email"));
    }
    socket.email = email;
    socket.name = name;
    next();
  });
  
  let connectedUsers = {}
  
  io.on('connection', (socket) => {
    connectedUsers[socket.email] = socket

    console.log(Object.keys(connectedUsers))
    
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
  
    socket.on('sendMessage', ({ message, to }) => {
      console.log('sendMessage')
      if (connectedUsers.hasOwnProperty(to)) {
        console.log('fetchMessage')
        connectedUsers[to].emit('fetchMessage', {
          message,
          senderEmail: socket.email,
          senderName: socket.name,
        })
      }
    })
  
    socket.on('disconnect', () => {
      delete connectedUsers[socket.email]
      console.log(Object.keys(connectedUsers))
      socket.broadcast.emit("exitUser", {
        userID: socket.id,
        email: socket.email,
      });
  
      console.log('user DISCONNECTED');
    });
  });
}

module.exports = { initializeSocketIO }
