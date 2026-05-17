/**
 * Store Controller
 * ------------------
 * Handles all CRUD operations for dark stores.
 * Includes JOIN queries with zones table for detailed information.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/db');

/**
 * GET /api/stores
 * Retrieve all stores with zone information (JOIN query)
 */
const getAllStores = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT ds.*, z.zone_name, z.city, z.pincode
      FROM dark_stores ds
      INNER JOIN zones z ON ds.zone_id = z.zone_id
      ORDER BY ds.store_id DESC
    `);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stores/:id
 * Retrieve a single store by ID with zone details
 */
const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT ds.*, z.zone_name, z.city, z.pincode
      FROM dark_stores ds
      INNER JOIN zones z ON ds.zone_id = z.zone_id
      WHERE ds.store_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stores/search?q=
 * Search stores by name, address, or manager name
 */
const searchStores = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchTerm = `%${q}%`;
    const [rows] = await pool.query(`
      SELECT ds.*, z.zone_name, z.city, z.pincode
      FROM dark_stores ds
      INNER JOIN zones z ON ds.zone_id = z.zone_id
      WHERE ds.store_name LIKE ? OR ds.address LIKE ? OR ds.manager_name LIKE ? OR z.zone_name LIKE ?
      ORDER BY ds.store_id DESC
    `, [searchTerm, searchTerm, searchTerm, searchTerm]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/stores
 * Create a new dark store
 */
const createStore = async (req, res, next) => {
  try {
    const { store_name, address, zone_id, manager_name, contact_number, capacity, status } = req.body;

    // Validate required fields
    if (!store_name || !address || !zone_id || !manager_name || !contact_number || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: store_name, address, zone_id, manager_name, contact_number, capacity'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO dark_stores (store_name, address, zone_id, manager_name, contact_number, capacity, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [store_name, address, zone_id, manager_name, contact_number, capacity, status || 'Active']
    );

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store_id: result.insertId, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/stores/:id
 * Update an existing dark store
 */
const updateStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { store_name, address, zone_id, manager_name, contact_number, capacity, status } = req.body;

    if (!store_name || !address || !zone_id || !manager_name || !contact_number || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const [result] = await pool.query(
      `UPDATE dark_stores 
       SET store_name = ?, address = ?, zone_id = ?, manager_name = ?, contact_number = ?, capacity = ?, status = ?
       WHERE store_id = ?`,
      [store_name, address, zone_id, manager_name, contact_number, capacity, status || 'Active', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: { store_id: parseInt(id), ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/stores/:id
 * Delete a dark store (cascades to inventory, employees, orders)
 */
const deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM dark_stores WHERE store_id = ?', [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.json({ success: true, message: 'Store deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  searchStores,
  createStore,
  updateStore,
  deleteStore
};
