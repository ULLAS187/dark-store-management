/**
 * Order Controller
 * ------------------
 * Handles all CRUD operations for order management.
 * Includes zone-wise and store-wise filtering with JOIN queries.
 * Demonstrates transactions for order creation.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/db');

/**
 * GET /api/orders
 * Retrieve all orders with zone and store details (multi-table JOIN)
 */
const getAllOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, z.zone_name, z.city, ds.store_name
      FROM orders o
      INNER JOIN zones z ON o.zone_id = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id = ds.store_id
      ORDER BY o.order_date DESC
    `);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/:id
 * Retrieve a single order by ID
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT o.*, z.zone_name, z.city, ds.store_name
      FROM orders o
      INNER JOIN zones z ON o.zone_id = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id = ds.store_id
      WHERE o.order_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/zone/:zoneId
 * Retrieve all orders for a specific zone
 */
const getOrdersByZone = async (req, res, next) => {
  try {
    const { zoneId } = req.params;
    const [rows] = await pool.query(`
      SELECT o.*, z.zone_name, z.city, ds.store_name
      FROM orders o
      INNER JOIN zones z ON o.zone_id = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id = ds.store_id
      WHERE o.zone_id = ?
      ORDER BY o.order_date DESC
    `, [zoneId]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/store/:storeId
 * Retrieve all orders for a specific store
 */
const getOrdersByStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const [rows] = await pool.query(`
      SELECT o.*, z.zone_name, z.city, ds.store_name
      FROM orders o
      INNER JOIN zones z ON o.zone_id = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id = ds.store_id
      WHERE o.store_id = ?
      ORDER BY o.order_date DESC
    `, [storeId]);

    res.json({ success: true, data: rows, count: rows.length });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/orders
 * Create a new order using a transaction for data integrity
 */
const createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { customer_name, customer_address, zone_id, store_id, order_amount } = req.body;

    if (!customer_name || !customer_address || !zone_id || !store_id || !order_amount) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: customer_name, customer_address, zone_id, store_id, order_amount'
      });
    }

    // Begin transaction
    await connection.beginTransaction();

    // Verify store exists and is active
    const [stores] = await connection.query(
      'SELECT store_id FROM dark_stores WHERE store_id = ? AND status = "Active"',
      [store_id]
    );

    if (stores.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Store is not active or does not exist'
      });
    }

    // Verify zone exists
    const [zones] = await connection.query(
      'SELECT zone_id FROM zones WHERE zone_id = ?',
      [zone_id]
    );

    if (zones.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Zone does not exist'
      });
    }

    // Insert the order
    const [result] = await connection.query(
      `INSERT INTO orders (customer_name, customer_address, zone_id, store_id, order_amount) 
       VALUES (?, ?, ?, ?, ?)`,
      [customer_name, customer_address, zone_id, store_id, order_amount]
    );

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order_id: result.insertId, ...req.body, delivery_status: 'Pending' }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

/**
 * PUT /api/orders/:id/status
 * Update order delivery status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { delivery_status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!delivery_status || !validStatuses.includes(delivery_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const [result] = await pool.query(
      'UPDATE orders SET delivery_status = ? WHERE order_id = ?',
      [delivery_status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order_id: parseInt(id), delivery_status }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/orders/:id
 * Delete an order
 */
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM orders WHERE order_id = ?', [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByZone,
  getOrdersByStore,
  createOrder,
  updateOrderStatus,
  deleteOrder
};
