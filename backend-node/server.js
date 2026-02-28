const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  dbName: 'femaura',
  // Connection pool settings for better performance
  maxPoolSize: 10,          // Max connections in pool
  minPoolSize: 2,           // Keep 2 connections alive always
  serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000,   // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000,  // Initial connection timeout
  heartbeatFrequencyMS: 10000, // Check connection health every 10s
  retryWrites: true,        // Retry failed writes
  retryReads: true          // Retry failed reads
})
.then(() => console.log('✅ Connected to MongoDB successfully with connection pooling'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const symptomLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  isPeriodDay: { type: Boolean, default: false },
  mood: { type: String, enum: ['Great', 'Good', 'Low', 'Very Low'], required: true },
  moodScore: { type: Number, required: true }, // 3=Great, 2=Good, 1=Low, 0=Very Low
  energyLevel: { type: Number, min: 1, max: 5 },
  painLevel: { type: Number, min: 1, max: 5 },
  symptoms: [String],
  notes: String
});

// Create compound index for quick lookup by user and date
symptomLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const SymptomLog = mongoose.model('SymptomLog', symptomLogSchema);

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ detail: "Missing fields" });

  try {
    // Use lean() for faster query
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }).lean();
    if (existingUser) {
      return res.status(400).json({ detail: "Username or email already exists" });
    }

    // Hash password with bcrypt (10 rounds is good balance of speed vs security)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log("✅ User Registered Successfully:", savedUser.username);

    res.json({ id: newUser._id, username, email });
  } catch (e) {
    console.error('❌ Registration error:', e);
    res.status(500).json({ detail: "Internal error" });
  }
});

// Login
app.post('/token', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ detail: "Missing credentials" });

  try {
    // Use lean() for faster queries (returns plain JS object instead of Mongoose document)
    const user = await User.findOne({ username }).lean();
    if (!user) return res.status(401).json({ detail: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ detail: "Invalid credentials" });

    // Longer token expiry to reduce re-authentication (7 days instead of 30 min)
    const token = jwt.sign(
      { sub: user.username, id: user._id }, 
      process.env.SECRET_KEY, 
      { expiresIn: '7d' }  // Changed from 30m to 7 days
    );
    
    res.json({ access_token: token, token_type: 'bearer' });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ detail: "Internal error" });
  }
});

// Get User
app.get('/users/me', authenticateToken, async (req, res) => {
  try {
    // Use lean() and select() for faster query
    const user = await User.findOne({ username: req.user.sub })
      .select('-password')
      .lean();
    if (!user) return res.status(404).json({ detail: "User not found" });
    res.json(user);
  } catch (e) {
    console.error('Get user error:', e);
    res.status(500).json({ detail: "Internal error" });
  }
});

// --- Symptom Tracker APIs ---

// Log Symptom (Create or Update)
app.post('/api/symptoms/log', authenticateToken, async (req, res) => {
  try {
    const { date, isPeriodDay, mood, energyLevel, painLevel, symptoms, notes } = req.body;
    
    const userId = req.user.id;
    if (!userId) return res.status(403).json({ detail: "User ID missing in token" });

    const moodScores = { "Great": 3, "Good": 2, "Low": 1, "Very Low": 0 };
    const moodScore = moodScores[mood] !== undefined ? moodScores[mood] : 1;

    // Normalize date to start of day to ensure uniqueness per day
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    const filter = { userId, date: logDate };
    const update = {
      userId,
      date: logDate,
      isPeriodDay,
      mood,
      moodScore,
      energyLevel,
      painLevel,
      symptoms,
      notes
    };

    const log = await SymptomLog.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true, // Create if doesn't exist
      setDefaultsOnInsert: true
    });

    res.json(log);
  } catch (e) {
    console.error(e);
    res.status(500).json({ detail: "Failed to save log" });
  }
});

// Get Logs for a Month
app.get('/api/symptoms/month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user.id;

    if (!year || !month) return res.status(400).json({ detail: "Year and month required" });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
    endDate.setHours(23, 59, 59, 999);

    const logs = await SymptomLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.json(logs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ detail: "Failed to fetch logs" });
  }
});

// Get History (last N months)
app.get('/api/symptoms/history', authenticateToken, async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 3;
    const userId = req.user.id;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const logs = await SymptomLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.json(logs);
  } catch (e) {
    res.status(500).json({ detail: "Failed to fetch history" });
  }
});

// Proxy to Python Services
app.post('/predict', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/predict`, req.body, {
      timeout: 30000,  // 30 second timeout
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Prediction service error:', error.message);
    res.status(500).json({ detail: "ML Service Error" });
  }
});

app.post('/chat', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/chat`, req.body, {
      timeout: 15000,  // 15 second timeout for chatbot
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Chat service error:', error.message);
    res.status(500).json({ detail: "Chat Service Error" });
  }
});

// Health Check Endpoints (Critical for preventing cold starts)
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    service: 'node-backend'
  };
  
  // Quick DB ping to keep connection alive
  try {
    await mongoose.connection.db.admin().ping();
    health.mongodb_ping = 'success';
  } catch (err) {
    health.mongodb_ping = 'failed';
    health.status = 'degraded';
  }
  
  res.json(health);
});

// Lightweight ping endpoint (no DB check)
app.get('/ping', (req, res) => {
  res.json({ status: 'alive', timestamp: Date.now() });
});

// Keep-alive endpoint to prevent cold starts
app.get('/keepalive', (req, res) => {
  res.json({ 
    status: 'warm', 
    message: 'Service is warm and ready',
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: "FemAura Node Backend (MongoDB) Running",
    status: "healthy",
    endpoints: ['/health', '/ping', '/keepalive']
  });
});

app.listen(PORT, () => {
  console.log(`Node Server running on port ${PORT}`);
});
