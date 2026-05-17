/**
 * Inventory Controller
 * ----------------------
 * Handles all CRUD operations for inventory management.
 * Includes low stock alerts and store-wise filtering.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/db');

/**
 * GET /api/inventory
 * Retrieve all inventory items with store details (JOIN query)
 */
const getAllInventory = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, ds.store_name
      FROM inventory i
      INNER JOIN dark_stores ds ON i.store_id = ds.store_id
      ORDER BY i.product_id DESC
    `);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/inventory/:id
 * Retrieve a single inventory item by ID
 */
const getInventoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT i.*, ds.store_name
      FROM inventory i
      INNER JOIN dark_stores ds ON i.store_id = ds.store_id
      WHERE i.product_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/inventory/store/:storeId
 * Retrieve all inventory for a specific store
 */
const getInventoryByStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const [rows] = await pool.query(`
      SELECT i.*, ds.store_name
      FROM inventory i
      INNER JOIN dark_stores ds ON i.store_id = ds.store_id
      WHERE i.store_id = ?
      ORDER BY i.category, i.product_name
    `, [storeId]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/inventory/low-stock
 * Retrieve products with quantity below threshold (< 10)
 * Uses the vw_low_stock view
 */
const getLowStock = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, ds.store_name
      FROM inventory i
      INNER JOIN dark_stores ds ON i.store_id = ds.store_id
      WHERE i.quantity < 10
      ORDER BY i.quantity ASC
    `);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/inventory
 * Add a new product to inventory
 */
const createInventory = async (req, res, next) => {
  try {
    const { product_name, category, quantity, price, store_id } = req.body;

    if (!product_name || !category || quantity === undefined || !price || !store_id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: product_name, category, quantity, price, store_id'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO inventory (product_name, category, quantity, price, store_id) VALUES (?, ?, ?, ?, ?)',
      [product_name, category, quantity, price, store_id]
    );

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: { product_id: result.insertId, ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/inventory/:id
 * Update an existing inventory item
 */
const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { product_name, category, quantity, price, store_id } = req.body;

    if (!product_name || !category || quantity === undefined || !price || !store_id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const [result] = await pool.query(
      'UPDATE inventory SET product_name = ?, category = ?, quantity = ?, price = ?, store_id = ? WHERE product_id = ?',
      [product_name, category, quantity, price, store_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product_id: parseInt(id), ...req.body }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/inventory/:id
 * Delete a product from inventory
 */
const deleteInventory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM inventory WHERE product_id = ?', [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInventory,
  getInventoryById,
  getInventoryByStore,
  getLowStock,
  createInventory,
  updateInventory,
  deleteInventory
};
