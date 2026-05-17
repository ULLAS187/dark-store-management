/**
 * Store Routes
 * Defines all API endpoints for dark store management
 */

const express = require('express');
const router = express.Router();
const {
  getAllStores,
  getStoreById,
  searchStores,
  createStore,
  updateStore,
  deleteStore
} = require('../controllers/storeController');

// GET search stores (must be before /:id to avoid conflict)
router.get('/search', searchStores);

// GET all stores
router.get('/', getAllStores);

// GET store by ID
router.get('/:id', getStoreById);

// POST create new store
router.post('/', createStore);

// PUT update store
router.put('/:id', updateStore);

// DELETE store
router.delete('/:id', deleteStore);

module.exports = router;
