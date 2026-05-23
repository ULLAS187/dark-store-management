/**
 * Inventory Routes
 * Defines all API endpoints for inventory management
 */

const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  getInventoryById,
  getInventoryByStore,
  getLowStock,
  getProductsByStore,
  createInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');

// GET low stock items (must be before /:id)
router.get('/low-stock', getLowStock);

// GET products by store for order creation dropdown (must be before /store/:storeId and /:id)
router.get('/products/:storeId', getProductsByStore);

// GET inventory by store
router.get('/store/:storeId', getInventoryByStore);

// GET all inventory
router.get('/', getAllInventory);

// GET inventory item by ID
router.get('/:id', getInventoryById);

// POST add new product
router.post('/', createInventory);

// PUT update product
router.put('/:id', updateInventory);

// DELETE product
router.delete('/:id', deleteInventory);

module.exports = router;
