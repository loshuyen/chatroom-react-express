const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: 'http://localhost:3000' });

let allUsers = [];

const leaveRoom = (userID, chatRoomUsers) => {
  return chatRoomUsers.filter((user) => user.id != userID);
};

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.emit('message', { text: 'Welcome!', username: 'Admin' });

  socket.on('join_room', ({ username, room }) => {
    socket.join(room);
    socket
      .to(room)
      .emit('message', { text: `${username} joined`, username: 'Admin' });

    const id = socket.id;
    allUsers.push({ id, username, room });
    const chatRoomUsers = allUsers.filter((user) => user.room === room);

    io.to(room).emit('room_users', chatRoomUsers);
  });

  socket.on('sendMessage', (message) => {
    const room = message.room;
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    const userLeaving = allUsers.find((user) => user.id === socket.id);
    const roomLeaving = userLeaving?.room;
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(roomLeaving).emit('room_users', allUsers);
    console.log(userLeaving);
  });
});

server.listen(8000, () => {
  console.log('Server is listening to port: 8000');
});
