require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groups');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
  });

  socket.on('message', async ({ token, message }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newMessage = new Message({
        groupId: message.group_id,
        sender: decoded.userId,
        content: message.content
      });
      await newMessage.save();

      io.to(message.group_id).emit('message', {
        sender: decoded.userId,
        content: message.content,
        timestamp: newMessage.timestamp
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
