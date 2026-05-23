/**
 * Order Controller
 * ------------------
 * Handles all CRUD operations for order management.
 * Includes zone-wise and store-wise filtering with JOIN queries.
 * Demonstrates transactions for order creation with inventory validation.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/db');

/**
 * GET /api/orders
 * Retrieve all orders with zone, store, and product details (multi-table JOIN)
 */
const getAllOrders = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*,
             z.zone_name, z.city,
             ds.store_name,
             i.product_name, i.price AS unit_price
      FROM orders o
      INNER JOIN zones z        ON o.zone_id    = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id   = ds.store_id
      LEFT  JOIN inventory i    ON o.product_id = i.product_id
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
      SELECT o.*,
             z.zone_name, z.city,
             ds.store_name,
             i.product_name, i.price AS unit_price
      FROM orders o
      INNER JOIN zones z        ON o.zone_id    = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id   = ds.store_id
      LEFT  JOIN inventory i    ON o.product_id = i.product_id
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
      SELECT o.*,
             z.zone_name, z.city,
             ds.store_name,
             i.product_name
      FROM orders o
      INNER JOIN zones z        ON o.zone_id    = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id   = ds.store_id
      LEFT  JOIN inventory i    ON o.product_id = i.product_id
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
      SELECT o.*,
             z.zone_name, z.city,
             ds.store_name,
             i.product_name
      FROM orders o
      INNER JOIN zones z        ON o.zone_id    = z.zone_id
      INNER JOIN dark_stores ds ON o.store_id   = ds.store_id
      LEFT  JOIN inventory i    ON o.product_id = i.product_id
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
 * Create a new order using a transaction for data integrity.
 * - Validates product existence in inventory for the selected store.
 * - Checks sufficient stock quantity.
 * - Atomically deducts stock on success.
 */
const createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { customer_name, customer_address, zone_id, store_id, product_id, quantity, order_amount } = req.body;

    // Field validation
    if (!customer_name || !customer_address || !zone_id || !store_id || !product_id || !quantity || !order_amount) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: customer_name, customer_address, zone_id, store_id, product_id, quantity, order_amount'
      });
    }

    if (parseInt(quantity) <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    // Begin transaction
    await connection.beginTransaction();

    // 1. Verify store exists and is active
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

    // 2. Verify zone exists
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

    // 3. Check inventory stock — lock the row to prevent race conditions
    const [inventoryRows] = await connection.query(
      'SELECT product_id, product_name, quantity, price FROM inventory WHERE product_id = ? AND store_id = ? FOR UPDATE',
      [product_id, store_id]
    );

    if (inventoryRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Product not found in inventory for this store'
      });
    }

    const inventoryItem = inventoryRows[0];

    if (inventoryItem.quantity < parseInt(quantity)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Product out of stock. Available: ${inventoryItem.quantity} unit(s)`
      });
    }

    // 4. Deduct inventory stock
    await connection.query(
      'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND store_id = ?',
      [parseInt(quantity), product_id, store_id]
    );

    // 5. Insert the order
    const [result] = await connection.query(
      `INSERT INTO orders (customer_name, customer_address, zone_id, store_id, product_id, quantity, order_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_name, customer_address, zone_id, store_id, product_id, parseInt(quantity), order_amount]
    );

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order_id: result.insertId,
        ...req.body,
        product_name: inventoryItem.product_name,
        delivery_status: 'Pending',
        remaining_stock: inventoryItem.quantity - parseInt(quantity)
      }
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
