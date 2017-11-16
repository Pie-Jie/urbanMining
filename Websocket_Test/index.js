
const io = require('socket.io-client');



const socket = io.connect('ws://nmd17server.herokuapp.com', {
 reconnect: true
});

socket.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

