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
  
  let usersSockets = {}
  
  io.on('connection', (socket) => {
    usersSockets[socket.email] = socket

    console.log(Object.keys(usersSockets))
    
    const onlineUsers = [];
    for (let [id, socket] of io.of("/").sockets) {
      onlineUsers.push({
        socketId: id,
        name: socket.name,
        email: socket.email,
      });
    }
    socket.emit("onlineUsers", onlineUsers);
    
    socket.broadcast.emit("newUser", {
      socketId: socket.id,
      email: socket.email,
      name: socket.name,
    });
    
    console.log('user CONNECTED');
  
    socket.on('sendMessage', ({ message, to }) => {
      console.log('sendMessage')
      if (usersSockets.hasOwnProperty(to)) {
        console.log('fetchMessage')
        usersSockets[to].emit('fetchMessage', {
          message,
          senderEmail: socket.email,
          senderName: socket.name,
        })
      }
    })
  
    socket.on('disconnect', () => {
      delete usersSockets[socket.email]

      socket.broadcast.emit("exitUser", {
        socketId: socket.id,
        email: socket.email,
        name: socket.name,
      });
  
      console.log('user DISCONNECTED');
    });
  });
}

module.exports = { initializeSocketIO }
