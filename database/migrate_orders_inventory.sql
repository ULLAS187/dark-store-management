-- ============================================================
-- Migration: Inventory-Aware Orders
-- Description: Adds product_id and quantity to orders table,
--              creates FK relationship with inventory table.
-- Run this ONCE on your existing dark_store_db database.
-- ============================================================

USE dark_store_db;

-- Step 1: Add product_id and quantity columns to orders table
ALTER TABLE orders
  ADD COLUMN product_id INT NOT NULL AFTER store_id,
  ADD COLUMN quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0) AFTER product_id;

-- Step 2: Add foreign key constraint linking orders -> inventory
ALTER TABLE orders
  ADD CONSTRAINT fk_orders_product
    FOREIGN KEY (product_id) REFERENCES inventory(product_id)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 3: Add index for performance
CREATE INDEX idx_orders_product ON orders(product_id);

-- Step 4: Update the stored procedure to include product_id and quantity,
--         and deduct stock atomically
DROP PROCEDURE IF EXISTS sp_create_order;

DELIMITER //
CREATE PROCEDURE sp_create_order(
    IN p_customer_name    VARCHAR(100),
    IN p_customer_address TEXT,
    IN p_zone_id          INT,
    IN p_store_id         INT,
    IN p_product_id       INT,
    IN p_quantity         INT,
    IN p_order_amount     DECIMAL(10,2)
)
BEGIN
    DECLARE v_stock INT DEFAULT 0;

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

    -- Check inventory stock
    SELECT quantity INTO v_stock
    FROM inventory
    WHERE product_id = p_product_id AND store_id = p_store_id
    FOR UPDATE;

    IF v_stock IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found in inventory for this store';
    END IF;

    IF v_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product out of stock';
    END IF;

    -- Deduct stock
    UPDATE inventory
    SET quantity = quantity - p_quantity
    WHERE product_id = p_product_id AND store_id = p_store_id;

    -- Insert the order
    INSERT INTO orders (customer_name, customer_address, zone_id, store_id, product_id, quantity, order_amount)
    VALUES (p_customer_name, p_customer_address, p_zone_id, p_store_id, p_product_id, p_quantity, p_order_amount);

    COMMIT;

    SELECT LAST_INSERT_ID() AS order_id;
END //
DELIMITER ;

SELECT 'Migration completed successfully.' AS status;
