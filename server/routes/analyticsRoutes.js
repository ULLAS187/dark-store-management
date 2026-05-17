/**
 * Analytics Routes
 * Defines all API endpoints for analytics and dashboard
 */

const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getOrdersPerZone,
  getRevenueByStore,
  getOrdersByCity,
  getEmployeesPerStore,
  getInventorySummary,
  getOrderStatusDistribution
} = require('../controllers/analyticsController');

// GET dashboard statistics
router.get('/dashboard', getDashboardStats);

// GET orders per zone
router.get('/orders-per-zone', getOrdersPerZone);

// GET revenue by store
router.get('/revenue-by-store', getRevenueByStore);

// GET orders by city
router.get('/orders-by-city', getOrdersByCity);

// GET employees per store
router.get('/employees-per-store', getEmployeesPerStore);

// GET inventory summary
router.get('/inventory-summary', getInventorySummary);

// GET order status distribution
router.get('/order-status-distribution', getOrderStatusDistribution);

module.exports = router;
