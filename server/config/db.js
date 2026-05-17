/**
 * Database Configuration
 * -----------------------
 * Creates a MySQL connection pool using mysql2/promise.
 * Uses environment variables for configuration.
 * Connection pooling improves performance by reusing connections.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dark_store_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,       // Maximum number of connections in pool
  queueLimit: 0,             // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test the database connection
 * Logs success or error message to console
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
