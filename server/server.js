const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const userRoute = require('./routes/UserRoute');
const productRoute = require('./routes/ProductRoute');
const categoryRoute = require('./routes/CategoryRoute');
const chatRoute = require('./routes/ChatRoute');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/category', categoryRoute);
app.use('/chat', chatRoute);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const newMessage = new Chat({ sender: senderId, receiver: receiverId, message });
    await newMessage.save();
    
    io.to(receiverId).emit('newMessage', newMessage);
    io.to(senderId).emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
