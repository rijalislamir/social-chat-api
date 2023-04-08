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
    const userId = socket.handshake.auth.userId;
    const email = socket.handshake.auth.email;
    const name = socket.handshake.auth.name;

    if (!email) {
      return next(new Error("invalid email"));
    }

    socket.userId = userId;
    socket.email = email;
    socket.name = name;
    next();
  });
  
  let usersSockets = {}
  
  io.on('connection', (socket) => {
    usersSockets[socket.userId] = socket
    
    const onlineUsers = [];
    for (let [id, socket] of io.of("/").sockets) {
      onlineUsers.push({
        socketId: id,
        userId: socket.userId,
        name: socket.name,
        email: socket.email,
        self: false
      });
    }
    socket.emit("onlineUsers", onlineUsers);
    
    socket.broadcast.emit("newUser", {
      socketId: socket.id,
      userId: socket.userId,
      email: socket.email,
      name: socket.name,
      self: false
    });
    
    console.log('user CONNECTED');
  
    socket.on('sendMessage', ({ message, to, conversationId, users }) => {
      if (usersSockets.hasOwnProperty(to)) {
        usersSockets[to].emit('fetchMessage', {
          conversationId,
          message,
          userId: socket.userId,
          users,
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
