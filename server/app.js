/**
 * Dark Store and Zone Registry Management System
 * ================================================
 * Main Express Application Entry Point
 * 
 * This file:
 * - Initializes Express server
 * - Configures middleware (CORS, JSON parsing)
 * - Registers all API routes
 * - Connects to MySQL database
 * - Starts the server
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const zoneRoutes = require('./routes/zoneRoutes');
const storeRoutes = require('./routes/storeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// Middleware Configuration
// =====================

// Enable CORS for frontend communication
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// =====================
// API Routes
// =====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Dark Store Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Register module routes
app.use('/api/zones', zoneRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// =====================
// Start Server
// =====================
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║   Dark Store Management System - API Server       ║
║   Running on: http://localhost:${PORT}               ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
╚════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
