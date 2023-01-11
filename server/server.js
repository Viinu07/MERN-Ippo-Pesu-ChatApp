const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const path = require('path');

const { chat } = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express(); // app

/* Configuring the .env file */
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

/* app.get('/', (req, res) => {
  res.send('Api is runnning successfully');
}); */

/* The data is fetched from the frontend-React so the json data is used*/
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

/* Deployment */

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '../client/build/')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Api running successfully');
  });
}

/* Deployment */
app.use(notFound);
app.use(errorHandler);

const server = app.listen(5000, () => {
  console.log(`The app is listening on port ${PORT}`);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000 /* It is used to save the bandwidth when the user is not sending message */,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  /* Creating a new socket for the frontend */
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    //console.log(userData._id);
    socket.emit('connected');
  });
  /* The user joined in the room from the frontend */
  socket.on('join chat', (room) => {
    socket.join('room');
    console.log('User Joined Room: ' + room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat users not defined');
    /* The logic to handle the chat to receive other participants other than the sender*/
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.off('setup', () => {
    console.log('User Disconnected');
    socket.leave(userData._id);
  });
});
