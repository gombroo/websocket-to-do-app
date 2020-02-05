const express = require('express');
const socket = require('socket.io');
let tasks = [];

// run app and server
const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

// chceking if there's a new connection/client
io.on('connection', (socket) => {
  console.log('New socket!' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (socket) => {
    tasks.push(socket.name);
    socket.broadcast.emit(socket.name);
  });

  socket.on('removeTask', (socket) => {
    tasks.splice(socket.index, 1);
    socket.broadcast.emit('remove', socket.index);
    //socket.broadcast.emit('removeTasks');
  });


 
});



    // const user = users.find((user) => user.id == socket.id);
    // users = users.filter(user => user.id !== socket.id);

  // socket.on('connection', function(socket){
  //   socket.emit('updateData', tasks);
  // });