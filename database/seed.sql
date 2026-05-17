-- ============================================================
-- Dark Store and Zone Registry Management System
-- Sample Data Insertion
-- ============================================================
USE dark_store_db;

-- ============================================================
-- Insert Zones
-- ============================================================
INSERT INTO zones (zone_name, city, pincode, delivery_radius) VALUES
('North Zone', 'Mumbai', '400001', 5.50),
('South Zone', 'Mumbai', '400005', 4.00),
('East Zone', 'Delhi', '110001', 6.00),
('West Zone', 'Delhi', '110005', 5.00),
('Central Zone', 'Bangalore', '560001', 7.50),
('IT Corridor', 'Bangalore', '560100', 3.50),
('Old City', 'Hyderabad', '500001', 4.50),
('Hi-Tech City', 'Hyderabad', '500081', 5.00),
('Anna Nagar', 'Chennai', '600040', 4.00),
('T Nagar', 'Chennai', '600017', 3.50);

-- ============================================================
-- Insert Dark Stores
-- ============================================================
INSERT INTO dark_stores (store_name, address, zone_id, manager_name, contact_number, capacity, status) VALUES
('DarkMart North Mumbai', '12 Andheri East, Mumbai', 1, 'Rahul Sharma', '9876543210', 500, 'Active'),
('DarkMart South Mumbai', '45 Dadar West, Mumbai', 2, 'Priya Patel', '9876543211', 350, 'Active'),
('QuickStore Delhi East', '78 Laxmi Nagar, Delhi', 3, 'Amit Kumar', '9876543212', 600, 'Active'),
('QuickStore Delhi West', '23 Rajouri Garden, Delhi', 4, 'Sneha Gupta', '9876543213', 400, 'Inactive'),
('BlinkStore Koramangala', '56 100ft Road, Bangalore', 5, 'Vikram Reddy', '9876543214', 550, 'Active'),
('BlinkStore Whitefield', '89 ITPL Main Road, Bangalore', 6, 'Anjali Nair', '9876543215', 450, 'Active'),
('RapidMart Old City', '34 Charminar Area, Hyderabad', 7, 'Mohammed Ali', '9876543216', 300, 'Active'),
('RapidMart HiTech', '67 Madhapur, Hyderabad', 8, 'Kavitha Rao', '9876543217', 500, 'Active'),
('SwiftStore Anna Nagar', '12 2nd Avenue, Chennai', 9, 'Karthik Subramanian', '9876543218', 400, 'Active'),
('SwiftStore T Nagar', '90 Usman Road, Chennai', 10, 'Lakshmi Iyer', '9876543219', 350, 'Inactive');

-- ============================================================
-- Insert Inventory
-- ============================================================
INSERT INTO inventory (product_name, category, quantity, price, store_id) VALUES
-- Store 1 inventory
('Basmati Rice 5kg', 'Groceries', 150, 450.00, 1),
('Toor Dal 1kg', 'Groceries', 200, 180.00, 1),
('Amul Butter 500g', 'Dairy', 80, 280.00, 1),
('Coca Cola 2L', 'Beverages', 120, 95.00, 1),
('Maggi Noodles Pack', 'Instant Food', 300, 56.00, 1),
-- Store 2 inventory
('Whole Wheat Atta 10kg', 'Groceries', 100, 520.00, 2),
('Milk 1L', 'Dairy', 50, 68.00, 2),
('Lays Chips 150g', 'Snacks', 8, 40.00, 2),
('Surf Excel 2kg', 'Household', 75, 380.00, 2),
('Colgate 200g', 'Personal Care', 90, 145.00, 2),
-- Store 3 inventory
('Sugar 5kg', 'Groceries', 180, 250.00, 3),
('Paneer 200g', 'Dairy', 5, 90.00, 3),
('Green Tea 100 bags', 'Beverages', 60, 320.00, 3),
('Hand Wash 250ml', 'Personal Care', 110, 120.00, 3),
('Biscuit Variety Pack', 'Snacks', 200, 75.00, 3),
-- Store 5 inventory
('Organic Honey 500g', 'Groceries', 40, 650.00, 5),
('Almond Milk 1L', 'Dairy', 3, 280.00, 5),
('Protein Bar Pack', 'Health', 7, 450.00, 5),
('Quinoa 500g', 'Groceries', 30, 380.00, 5),
('Olive Oil 1L', 'Groceries', 25, 750.00, 5),
-- Store 6 inventory
('Coffee Beans 500g', 'Beverages', 45, 550.00, 6),
('Oats 1kg', 'Groceries', 80, 220.00, 6),
('Yogurt 400g', 'Dairy', 60, 55.00, 6),
('Energy Drink 250ml', 'Beverages', 9, 125.00, 6),
('Dark Chocolate 100g', 'Snacks', 70, 180.00, 6),
-- Store 7 inventory
('Biryani Masala 200g', 'Spices', 150, 120.00, 7),
('Ghee 1L', 'Dairy', 40, 580.00, 7),
('Dates 500g', 'Dry Fruits', 65, 350.00, 7),
('Rose Water 200ml', 'Beverages', 2, 85.00, 7),
('Vermicelli 500g', 'Groceries', 90, 45.00, 7),
-- Store 8 inventory
('Soya Chunks 1kg', 'Groceries', 55, 160.00, 8),
('Muesli 750g', 'Health', 35, 420.00, 8),
('Coconut Oil 500ml', 'Groceries', 70, 210.00, 8),
('Peanut Butter 350g', 'Health', 4, 290.00, 8),
('Green Chilli Sauce 200ml', 'Condiments', 100, 65.00, 8),
-- Store 9 inventory
('Filter Coffee 500g', 'Beverages', 110, 380.00, 9),
('Idli Rice 5kg', 'Groceries', 85, 300.00, 9),
('Coconut Chutney Powder', 'Spices', 6, 95.00, 9),
('Tamarind 500g', 'Spices', 120, 110.00, 9),
('Jaggery 1kg', 'Groceries', 50, 130.00, 9);

-- ============================================================
-- Insert Employees
-- ============================================================
INSERT INTO employees (name, role, salary, phone_number, store_id) VALUES
-- Store 1 employees
('Rajesh Verma', 'Store Manager', 55000.00, '9800000001', 1),
('Sunil Yadav', 'Warehouse Associate', 25000.00, '9800000002', 1),
('Meena Kumari', 'Delivery Executive', 22000.00, '9800000003', 1),
('Arun Joshi', 'Inventory Clerk', 20000.00, '9800000004', 1),
-- Store 2 employees
('Deepa Nair', 'Store Manager', 52000.00, '9800000005', 2),
('Vishal Patil', 'Warehouse Associate', 24000.00, '9800000006', 2),
('Pooja Singh', 'Delivery Executive', 21000.00, '9800000007', 2),
-- Store 3 employees
('Manoj Tiwari', 'Store Manager', 58000.00, '9800000008', 3),
('Neha Agarwal', 'Warehouse Associate', 26000.00, '9800000009', 3),
('Ravi Shankar', 'Delivery Executive', 23000.00, '9800000010', 3),
('Preeti Mishra', 'Inventory Clerk', 21000.00, '9800000011', 3),
('Sanjay Dubey', 'Delivery Executive', 22000.00, '9800000012', 3),
-- Store 5 employees
('Divya Rao', 'Store Manager', 60000.00, '9800000013', 5),
('Harish Gowda', 'Warehouse Associate', 27000.00, '9800000014', 5),
('Swathi Hegde', 'Delivery Executive', 24000.00, '9800000015', 5),
('Naveen Kumar', 'Packing Associate', 20000.00, '9800000016', 5),
-- Store 6 employees
('Ashwin Prasad', 'Store Manager', 56000.00, '9800000017', 6),
('Lakshman Shetty', 'Warehouse Associate', 25000.00, '9800000018', 6),
('Radha Krishna', 'Delivery Executive', 22000.00, '9800000019', 6),
-- Store 7 employees
('Farooq Ahmed', 'Store Manager', 50000.00, '9800000020', 7),
('Suresh Babu', 'Warehouse Associate', 23000.00, '9800000021', 7),
('Ayesha Begum', 'Delivery Executive', 21000.00, '9800000022', 7),
-- Store 8 employees
('Ramesh Chandra', 'Store Manager', 57000.00, '9800000023', 8),
('Lavanya Devi', 'Warehouse Associate', 25000.00, '9800000024', 8),
('Venkat Rao', 'Delivery Executive', 23000.00, '9800000025', 8),
('Pradeep Reddy', 'Packing Associate', 19000.00, '9800000026', 8),
-- Store 9 employees
('Ganesh Raman', 'Store Manager', 54000.00, '9800000027', 9),
('Usha Devi', 'Warehouse Associate', 24000.00, '9800000028', 9),
('Murugan S', 'Delivery Executive', 22000.00, '9800000029', 9);

-- ============================================================
-- Insert Orders
-- ============================================================
INSERT INTO orders (customer_name, customer_address, zone_id, store_id, order_amount, delivery_status, order_date) VALUES
-- Orders for Store 1, Zone 1
('Amit Shah', '15 Andheri West, Mumbai', 1, 1, 1250.00, 'Delivered', '2025-05-01 10:30:00'),
('Priya Kapoor', '22 Juhu Beach Road, Mumbai', 1, 1, 890.00, 'Delivered', '2025-05-02 14:15:00'),
('Vikram Mehta', '8 Versova, Mumbai', 1, 1, 2100.00, 'Shipped', '2025-05-10 09:00:00'),
('Neeta Ambani', '45 Powai Lake Road, Mumbai', 1, 1, 3500.00, 'Processing', '2025-05-14 16:45:00'),
-- Orders for Store 2, Zone 2
('Rohan Desai', '67 Worli Sea Face, Mumbai', 2, 2, 750.00, 'Delivered', '2025-05-03 11:00:00'),
('Sunita More', '34 Prabhadevi, Mumbai', 2, 2, 1580.00, 'Delivered', '2025-05-05 13:30:00'),
('Ajay Devgan', '12 Lower Parel, Mumbai', 2, 2, 920.00, 'Cancelled', '2025-05-08 10:00:00'),
-- Orders for Store 3, Zone 3
('Gaurav Tandon', '56 Preet Vihar, Delhi', 3, 3, 1800.00, 'Delivered', '2025-05-01 08:00:00'),
('Simran Kaur', '89 Mayur Vihar, Delhi', 3, 3, 2350.00, 'Delivered', '2025-05-04 15:00:00'),
('Rakesh Bhatia', '23 Patparganj, Delhi', 3, 3, 670.00, 'Shipped', '2025-05-09 12:30:00'),
('Anita Sinha', '45 IP Extension, Delhi', 3, 3, 4200.00, 'Pending', '2025-05-13 09:45:00'),
('Karan Malhotra', '78 Laxmi Nagar, Delhi', 3, 3, 1100.00, 'Processing', '2025-05-15 14:00:00'),
-- Orders for Store 5, Zone 5
('Deepak Shenoy', '12 Koramangala 4th Block, Bangalore', 5, 5, 3200.00, 'Delivered', '2025-05-02 10:00:00'),
('Meghna Raj', '45 Indiranagar, Bangalore', 5, 5, 1950.00, 'Delivered', '2025-05-06 16:00:00'),
('Suresh Raina', '78 HSR Layout, Bangalore', 5, 5, 2800.00, 'Shipped', '2025-05-11 11:30:00'),
-- Orders for Store 6, Zone 6
('Anil Kumble', '23 Whitefield Main, Bangalore', 6, 6, 1450.00, 'Delivered', '2025-05-03 09:00:00'),
('Rashmi Hegde', '56 ITPL Road, Bangalore', 6, 6, 2100.00, 'Pending', '2025-05-12 13:00:00'),
-- Orders for Store 7, Zone 7
('Imran Khan', '34 Charminar Road, Hyderabad', 7, 7, 980.00, 'Delivered', '2025-05-01 12:00:00'),
('Padma Lakshmi', '67 Nampally, Hyderabad', 7, 7, 1650.00, 'Delivered', '2025-05-07 10:30:00'),
('Ravi Teja', '89 Abids, Hyderabad', 7, 7, 2300.00, 'Shipped', '2025-05-10 15:00:00'),
-- Orders for Store 8, Zone 8
('Srinivas Reddy', '12 Madhapur Main, Hyderabad', 8, 8, 1780.00, 'Delivered', '2025-05-04 11:00:00'),
('Anushka Shetty', '45 Kondapur, Hyderabad', 8, 8, 3100.00, 'Processing', '2025-05-13 14:30:00'),
-- Orders for Store 9, Zone 9
('Rajinikanth S', '23 Anna Nagar East, Chennai', 9, 9, 2500.00, 'Delivered', '2025-05-02 08:30:00'),
('Vijay Kumar', '56 Mogappair, Chennai', 9, 9, 1200.00, 'Delivered', '2025-05-05 12:00:00'),
('Suriya Sivakumar', '89 Ambattur, Chennai', 9, 9, 1850.00, 'Shipped', '2025-05-11 16:00:00'),
('Nayanthara R', '12 Kilpauk, Chennai', 9, 9, 950.00, 'Pending', '2025-05-14 10:00:00');

-- ============================================================
-- Advanced SQL Queries (for reference & demonstration)
-- ============================================================

-- 1. JOIN: Get all stores with their zone information
-- SELECT ds.*, z.zone_name, z.city, z.pincode
-- FROM dark_stores ds
-- INNER JOIN zones z ON ds.zone_id = z.zone_id;

-- 2. GROUP BY + Aggregate: Total orders and revenue per zone
-- SELECT z.zone_name, z.city, COUNT(o.order_id) AS total_orders, SUM(o.order_amount) AS total_revenue
-- FROM zones z
-- LEFT JOIN orders o ON z.zone_id = o.zone_id
-- GROUP BY z.zone_id, z.zone_name, z.city
-- ORDER BY total_revenue DESC;

-- 3. Nested Query: Find stores with more orders than average
-- SELECT store_name FROM dark_stores
-- WHERE store_id IN (
--     SELECT store_id FROM orders
--     GROUP BY store_id
--     HAVING COUNT(*) > (SELECT AVG(cnt) FROM (SELECT COUNT(*) AS cnt FROM orders GROUP BY store_id) AS avg_tbl)
-- );

-- 4. Highest revenue dark store
-- SELECT ds.store_name, SUM(o.order_amount) AS revenue
-- FROM dark_stores ds
-- JOIN orders o ON ds.store_id = o.store_id
-- GROUP BY ds.store_id, ds.store_name
-- ORDER BY revenue DESC
-- LIMIT 1;

-- 5. Inventory shortage report (products with quantity < 10)
-- SELECT * FROM vw_low_stock;

-- 6. Employees working in each store
-- SELECT * FROM vw_employees_per_store;

-- 7. Orders delivered in each city
-- SELECT * FROM vw_orders_by_city;
