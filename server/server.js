const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const { setSocketServer } = require('./utils/notificationEmitter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setSocketServer(io);

connectDB();

io.on('connection', (socket) => {
  console.log(`Admin dashboard connected: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`Admin dashboard disconnected: ${socket.id}. Reason: ${reason}`);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded medical reports through a predictable static path.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Organ Donation System API is running'
  });
});

app.get('/api/donors', require('./controllers/donorController').getAllDonors);
app.get('/api/recipients', require('./controllers/recipientController').getAllRecipients);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/donor', require('./routes/donorRoutes'));
app.use('/api/recipient', require('./routes/recipientRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
