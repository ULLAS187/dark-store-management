/**
 * Analytics Controller
 * ----------------------
 * Handles dashboard statistics and analytical queries.
 * Demonstrates advanced SQL: JOINs, GROUP BY, aggregates, nested queries.
 * Uses parameterized queries to prevent SQL injection.
 */

const { pool } = require('../config/db');

/**
 * GET /api/analytics/dashboard
 * Get overall dashboard statistics
 * Uses aggregate functions: COUNT, SUM, COALESCE
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM dark_stores) AS total_stores,
        (SELECT COUNT(*) FROM dark_stores WHERE status = 'Active') AS active_stores,
        (SELECT COUNT(*) FROM zones) AS total_zones,
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT COALESCE(SUM(order_amount), 0) FROM orders) AS total_revenue,
        (SELECT COUNT(*) FROM inventory) AS total_products,
        (SELECT COUNT(*) FROM inventory WHERE quantity < 10) AS low_stock_items,
        (SELECT COUNT(*) FROM orders WHERE delivery_status = 'Pending') AS pending_orders,
        (SELECT COUNT(*) FROM orders WHERE delivery_status = 'Delivered') AS delivered_orders
    `);

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/orders-per-zone
 * Total orders and revenue per zone (GROUP BY + aggregate)
 */
const getOrdersPerZone = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        z.zone_id,
        z.zone_name,
        z.city,
        COUNT(o.order_id) AS total_orders,
        COALESCE(SUM(o.order_amount), 0) AS total_revenue,
        COALESCE(AVG(o.order_amount), 0) AS avg_order_value
      FROM zones z
      LEFT JOIN orders o ON z.zone_id = o.zone_id
      GROUP BY z.zone_id, z.zone_name, z.city
      ORDER BY total_revenue DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/revenue-by-store
 * Revenue and order count per store (JOIN + GROUP BY)
 */
const getRevenueByStore = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        ds.store_id,
        ds.store_name,
        ds.status,
        z.zone_name,
        COUNT(o.order_id) AS total_orders,
        COALESCE(SUM(o.order_amount), 0) AS total_revenue,
        COALESCE(AVG(o.order_amount), 0) AS avg_order_value
      FROM dark_stores ds
      LEFT JOIN zones z ON ds.zone_id = z.zone_id
      LEFT JOIN orders o ON ds.store_id = o.store_id
      GROUP BY ds.store_id, ds.store_name, ds.status, z.zone_name
      ORDER BY total_revenue DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/orders-by-city
 * Orders delivered in each city (GROUP BY + CASE)
 */
const getOrdersByCity = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        z.city,
        COUNT(o.order_id) AS total_orders,
        SUM(CASE WHEN o.delivery_status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
        SUM(CASE WHEN o.delivery_status = 'Pending' THEN 1 ELSE 0 END) AS pending_orders,
        SUM(CASE WHEN o.delivery_status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
        COALESCE(SUM(o.order_amount), 0) AS total_revenue
      FROM zones z
      LEFT JOIN orders o ON z.zone_id = o.zone_id
      GROUP BY z.city
      ORDER BY total_revenue DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/employees-per-store
 * Employee count and salary info per store (GROUP BY + aggregate)
 */
const getEmployeesPerStore = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        ds.store_id,
        ds.store_name,
        ds.manager_name,
        COUNT(e.employee_id) AS total_employees,
        COALESCE(SUM(e.salary), 0) AS total_salary_expense,
        COALESCE(AVG(e.salary), 0) AS avg_salary
      FROM dark_stores ds
      LEFT JOIN employees e ON ds.store_id = e.store_id
      GROUP BY ds.store_id, ds.store_name, ds.manager_name
      ORDER BY total_employees DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/inventory-summary
 * Inventory summary per store with category breakdown
 */
const getInventorySummary = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        ds.store_id,
        ds.store_name,
        COUNT(i.product_id) AS total_products,
        COALESCE(SUM(i.quantity), 0) AS total_stock,
        COALESCE(SUM(i.quantity * i.price), 0) AS inventory_value,
        SUM(CASE WHEN i.quantity < 10 THEN 1 ELSE 0 END) AS low_stock_count
      FROM dark_stores ds
      LEFT JOIN inventory i ON ds.store_id = i.store_id
      GROUP BY ds.store_id, ds.store_name
      ORDER BY inventory_value DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/analytics/order-status-distribution
 * Distribution of order statuses
 */
const getOrderStatusDistribution = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        delivery_status,
        COUNT(*) AS count,
        COALESCE(SUM(order_amount), 0) AS total_amount
      FROM orders
      GROUP BY delivery_status
      ORDER BY count DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getOrdersPerZone,
  getRevenueByStore,
  getOrdersByCity,
  getEmployeesPerStore,
  getInventorySummary,
  getOrderStatusDistribution
};
