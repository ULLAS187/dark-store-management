/**
 * Zone Controller
 * -----------------
 * Handles all CRUD operations for delivery zones.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/db');

/**
 * GET /api/zones
 * Retrieve all zones from the database
 */
const getAllZones = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM zones ORDER BY zone_id DESC'
    );
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/zones/:id
 * Retrieve a single zone by its ID
 */
const getZoneById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM zones WHERE zone_id = ?', [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/zones
 * Create a new zone
 */
const createZone = async (req, res, next) => {
  try {
    const { zone_name, city, pincode, delivery_radius } = req.body;

    // Validate required fields
    if (!zone_name || !city || !pincode || !delivery_radius) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: zone_name, city, pincode, delivery_radius'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO zones (zone_name, city, pincode, delivery_radius) VALUES (?, ?, ?, ?)',
      [zone_name, city, pincode, delivery_radius]
    );

    res.status(201).json({
      success: true,
      message: 'Zone created successfully',
      data: { zone_id: result.insertId, zone_name, city, pincode, delivery_radius }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/zones/:id
 * Update an existing zone
 */
const updateZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { zone_name, city, pincode, delivery_radius } = req.body;

    // Validate required fields
    if (!zone_name || !city || !pincode || !delivery_radius) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: zone_name, city, pincode, delivery_radius'
      });
    }

    const [result] = await pool.query(
      'UPDATE zones SET zone_name = ?, city = ?, pincode = ?, delivery_radius = ? WHERE zone_id = ?',
      [zone_name, city, pincode, delivery_radius, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    res.json({
      success: true,
      message: 'Zone updated successfully',
      data: { zone_id: parseInt(id), zone_name, city, pincode, delivery_radius }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/zones/:id
 * Delete a zone (cascades to stores, orders, etc.)
 */
const deleteZone = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM zones WHERE zone_id = ?', [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    res.json({ success: true, message: 'Zone deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
};
