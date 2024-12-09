const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./user');
const foodRoutes = require('./food');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/food', foodRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Default Route
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/api/test-db', async (req, res) => {
    try {
      const result = await mongoose.connection.db.admin().ping();
      res.status(200).json({ message: 'MongoDB connected', result });
    } catch (error) {
      res.status(500).json({ message: 'MongoDB connection error', error });
    }
  });
  
// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export for Vercel
module.exports = (req, res) => {
  app(req, res); // Adapts Express for Vercel's serverless environment
};
