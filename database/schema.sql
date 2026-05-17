-- ============================================================
-- Dark Store and Zone Registry Management System
-- Database Schema
-- ============================================================
-- This SQL file creates the complete database schema including:
--   - Tables with primary keys, foreign keys, constraints
--   - Views for analytical queries
--   - Indexes for performance optimization
--   - Triggers for automated operations
--   - Stored procedures for complex transactions
-- ============================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS dark_store_db;
USE dark_store_db;

-- ============================================================
-- TABLE: zones
-- Description: Stores delivery zone information
-- Normalization: 1NF, 2NF, 3NF - No partial or transitive dependencies
-- ============================================================
CREATE TABLE IF NOT EXISTS zones (
    zone_id INT AUTO_INCREMENT PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    delivery_radius DECIMAL(5,2) NOT NULL CHECK (delivery_radius > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_zone_name_city (zone_name, city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: dark_stores
-- Description: Stores dark store (warehouse) information
-- Foreign Key: zone_id references zones(zone_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS dark_stores (
    store_id INT AUTO_INCREMENT PRIMARY KEY,
    store_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    zone_id INT NOT NULL,
    manager_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_store_name (store_name),
    UNIQUE KEY uk_contact (contact_number),
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: inventory
-- Description: Stores product inventory for each dark store
-- Foreign Key: store_id references dark_stores(store_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    store_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES dark_stores(store_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: employees
-- Description: Stores employee information for each dark store
-- Foreign Key: store_id references dark_stores(store_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL CHECK (salary > 0),
    phone_number VARCHAR(15) NOT NULL,
    store_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_phone (phone_number),
    FOREIGN KEY (store_id) REFERENCES dark_stores(store_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: orders
-- Description: Stores order information linked to zones and stores
-- Foreign Keys: zone_id -> zones, store_id -> dark_stores
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_address TEXT NOT NULL,
    zone_id INT NOT NULL,
    store_id INT NOT NULL,
    order_amount DECIMAL(10,2) NOT NULL CHECK (order_amount > 0),
    delivery_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (store_id) REFERENCES dark_stores(store_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INDEXES for performance optimization
-- ============================================================
CREATE INDEX idx_stores_zone ON dark_stores(zone_id);
CREATE INDEX idx_stores_status ON dark_stores(status);
CREATE INDEX idx_inventory_store ON inventory(store_id);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);
CREATE INDEX idx_employees_store ON employees(store_id);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_orders_zone ON orders(zone_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(delivery_status);
CREATE INDEX idx_orders_date ON orders(order_date);

-- ============================================================
-- VIEWS for analytical queries
-- ============================================================

-- View: Total orders per zone with revenue
CREATE OR REPLACE VIEW vw_orders_per_zone AS
SELECT 
    z.zone_id,
    z.zone_name,
    z.city,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.order_amount), 0) AS total_revenue
FROM zones z
LEFT JOIN orders o ON z.zone_id = o.zone_id
GROUP BY z.zone_id, z.zone_name, z.city;

-- View: Store performance with revenue ranking
CREATE OR REPLACE VIEW vw_store_performance AS
SELECT 
    ds.store_id,
    ds.store_name,
    ds.status,
    z.zone_name,
    z.city,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.order_amount), 0) AS total_revenue,
    COUNT(DISTINCT e.employee_id) AS employee_count
FROM dark_stores ds
LEFT JOIN zones z ON ds.zone_id = z.zone_id
LEFT JOIN orders o ON ds.store_id = o.store_id
LEFT JOIN employees e ON ds.store_id = e.store_id
GROUP BY ds.store_id, ds.store_name, ds.status, z.zone_name, z.city;

-- View: Low stock inventory report (quantity < 10)
CREATE OR REPLACE VIEW vw_low_stock AS
SELECT 
    i.product_id,
    i.product_name,
    i.category,
    i.quantity,
    i.price,
    ds.store_name,
    ds.store_id
FROM inventory i
JOIN dark_stores ds ON i.store_id = ds.store_id
WHERE i.quantity < 10
ORDER BY i.quantity ASC;

-- View: Employees per store with store details
CREATE OR REPLACE VIEW vw_employees_per_store AS
SELECT 
    ds.store_id,
    ds.store_name,
    ds.manager_name,
    COUNT(e.employee_id) AS total_employees,
    COALESCE(SUM(e.salary), 0) AS total_salary_expense
FROM dark_stores ds
LEFT JOIN employees e ON ds.store_id = e.store_id
GROUP BY ds.store_id, ds.store_name, ds.manager_name;

-- View: Orders delivered in each city
CREATE OR REPLACE VIEW vw_orders_by_city AS
SELECT 
    z.city,
    COUNT(o.order_id) AS total_orders,
    SUM(CASE WHEN o.delivery_status = 'Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
    COALESCE(SUM(o.order_amount), 0) AS total_revenue
FROM zones z
LEFT JOIN orders o ON z.zone_id = o.zone_id
GROUP BY z.city;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger: Log when a store status changes to Inactive
DELIMITER //
CREATE TRIGGER trg_before_store_delete
BEFORE DELETE ON dark_stores
FOR EACH ROW
BEGIN
    -- Automatically handled by ON DELETE CASCADE for related records
    -- This trigger can be extended for audit logging
    SIGNAL SQLSTATE '01000' SET MESSAGE_TEXT = 'Store and related records will be deleted';
END //
DELIMITER ;

-- Trigger: Prevent negative inventory quantity
DELIMITER //
CREATE TRIGGER trg_check_inventory_quantity
BEFORE UPDATE ON inventory
FOR EACH ROW
BEGIN
    IF NEW.quantity < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory quantity cannot be negative';
    END IF;
END //
DELIMITER ;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- Procedure: Create order with transaction
DELIMITER //
CREATE PROCEDURE sp_create_order(
    IN p_customer_name VARCHAR(100),
    IN p_customer_address TEXT,
    IN p_zone_id INT,
    IN p_store_id INT,
    IN p_order_amount DECIMAL(10,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Verify store exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM dark_stores 
        WHERE store_id = p_store_id AND status = 'Active'
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Store is not active or does not exist';
    END IF;
    
    -- Verify zone exists
    IF NOT EXISTS (
        SELECT 1 FROM zones WHERE zone_id = p_zone_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Zone does not exist';
    END IF;
    
    -- Insert the order
    INSERT INTO orders (customer_name, customer_address, zone_id, store_id, order_amount)
    VALUES (p_customer_name, p_customer_address, p_zone_id, p_store_id, p_order_amount);
    
    COMMIT;
    
    SELECT LAST_INSERT_ID() AS order_id;
END //
DELIMITER ;

-- Procedure: Get dashboard statistics
DELIMITER //
CREATE PROCEDURE sp_dashboard_stats()
BEGIN
    -- Total counts
    SELECT 
        (SELECT COUNT(*) FROM dark_stores) AS total_stores,
        (SELECT COUNT(*) FROM dark_stores WHERE status = 'Active') AS active_stores,
        (SELECT COUNT(*) FROM zones) AS total_zones,
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT COALESCE(SUM(order_amount), 0) FROM orders) AS total_revenue,
        (SELECT COUNT(*) FROM inventory) AS total_products,
        (SELECT COUNT(*) FROM inventory WHERE quantity < 10) AS low_stock_items;
END //
DELIMITER ;
