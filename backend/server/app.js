// server/app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Logging Middleware ===
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response for ${req.method} ${req.url}:`, body);
    originalSend.call(this, body);
  };
  next();
});

// === Static Files (Frontend) ===
app.use(express.static(path.join(__dirname, '../public')));

// === MongoDB Connection ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

const settingsRoutes = require('../routes/settingsRoutes');

// === API Routes ===
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/products', require('../routes/productRoutes'));
app.use('/api/orders', require('../routes/orderRoutes'));
app.use('/api/settings', settingsRoutes);

// === Catch-All Route for SPA ===
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
