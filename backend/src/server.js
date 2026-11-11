// backend/src/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();
const fs = require('fs');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { seedDatabase } = require('./seeds/seedData');
const errorHandler = require('./middlewares/error');
const initSockets = require('./sockets/chatSocket');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const postRoutes = require('./routes/postRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  },
  transports: ['websocket', 'polling']
});

initSockets(io);
app.set('io', io);

// Express Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'MEET-US Backend (Node.js & MongoDB)'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matching', matchRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/sessions', sessionRoutes);

// Servir uploads estáticos para ficheiros multimédia (áudio, vídeo, PDFs, imagens)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Servir Frontend PWA / SPA em Produção se já estiver compilado
const frontendPwa = path.join(__dirname, '../../frontend/dist/pwa');
const frontendSpa = path.join(__dirname, '../../frontend/dist/spa');
const frontendDist = fs.existsSync(frontendPwa) ? frontendPwa : (fs.existsSync(frontendSpa) ? frontendSpa : null);

if (frontendDist) {
  console.log('[Production] Frontend ativo a partir de:', frontendDist);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({ message: `Rota ${req.method} ${req.url} não encontrada no backend.` });
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(`🚀 MEET-US Backend running on http://localhost:${PORT}`);
      console.log(`📡 Socket.IO active on ws://localhost:${PORT}`);
      console.log(`🌍 Health endpoint: http://localhost:${PORT}/api/health`);
      console.log(`📱 LAN Access: http://192.168.1.251:${PORT}`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Fatal error starting MEET-US server:', err);
    process.exit(1);
  }
}

startServer();