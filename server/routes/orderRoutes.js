/**
 * Order Routes
 * Defines all API endpoints for order management
 */

const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrdersByZone,
  getOrdersByStore,
  createOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// GET orders by zone
router.get('/zone/:zoneId', getOrdersByZone);

// GET orders by store
router.get('/store/:storeId', getOrdersByStore);

// GET all orders
router.get('/', getAllOrders);

// GET order by ID
router.get('/:id', getOrderById);

// POST create new order
router.post('/', createOrder);

// PUT update order status
router.put('/:id/status', updateOrderStatus);

// DELETE order
router.delete('/:id', deleteOrder);

module.exports = router;
