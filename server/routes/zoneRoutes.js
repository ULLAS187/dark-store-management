/**
 * Zone Routes
 * Defines all API endpoints for zone management
 */

const express = require('express');
const router = express.Router();
const {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
} = require('../controllers/zoneController');

// GET all zones
router.get('/', getAllZones);

// GET zone by ID
router.get('/:id', getZoneById);

// POST create new zone
router.post('/', createZone);

// PUT update zone
router.put('/:id', updateZone);

// DELETE zone
router.delete('/:id', deleteZone);

module.exports = router;
