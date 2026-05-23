<<<<<<< HEAD
Dark Store and Zone Registry Management System
=======
# Dark Store and Zone Registry Management System
>>>>>>> 887c46c (create_order updated)

A full-stack **Database Management System (DBMS)** mini project that manages dark stores (warehouse-like fulfillment centers for quick commerce), delivery zones, inventory, employees, and orders — with **inventory-aware order creation** and automatic stock management.

<<<<<<< HEAD
=======
> **Built for:** Engineering DBMS Mini Project Submission & Demonstration

---

>>>>>>> 887c46c (create_order updated)
## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [ER Diagram](#er-diagram)
- [Relational Schema](#relational-schema)
- [Database Concepts Demonstrated](#database-concepts-demonstrated)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [SQL Queries Reference](#sql-queries-reference)

---

## Project Overview

This system manages the operations of **dark stores** — warehouse-style fulfillment centers used in quick commerce. It covers:

- **Dark Store Management** — Add, edit, delete, search dark stores
- **Zone Registry** — Manage delivery zones across cities
- **Inventory Management** — Track products, stock levels, low stock alerts
- **Employee Management** — Manage staff assignments across stores
- **Order Management** — Inventory-aware order creation with automatic stock deduction and delivery status tracking
- **Analytics Dashboard** — Charts, reports, and performance metrics

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Tailwind CSS + Vite    |
| Backend    | Node.js + Express.js              |
| Database   | MySQL 8.0                         |
| Charts     | Recharts                          |
| HTTP       | Axios                             |
| Icons      | Lucide React                      |
| Routing    | React Router DOM v6               |

---

<<<<<<< HEAD
##  Features
=======
## Features
>>>>>>> 887c46c (create_order updated)

### Core CRUD Operations
- **Dark Stores** — Create, Read, Update, Delete with search
- **Zones** — Full CRUD for delivery zones
<<<<<<< HEAD
- **Inventory** — Product management with store-wise filtering
- **Employees** — Staff management with role assignments
- **Orders** — Order creation with status tracking
=======
- **Inventory** — Product management with store-wise filtering and low-stock alerts
- **Employees** — Staff management with role assignments
- **Orders** — Inventory-aware order creation with delivery status tracking

### Inventory-Aware Order Creation (Latest Feature)
- **Product Dropdown** — Searchable product list populated dynamically from inventory, filtered by the selected store
- **Stock Validation** — Prevents orders when requested quantity exceeds available stock; shows real-time stock badge (green / yellow / red status)
- **Auto-Calculated Amount** — Order amount is automatically computed as `price * quantity`
- **Atomic Stock Deduction** — Inventory is reduced inside the same DB transaction as the order insert (no partial updates)
- **Negative Stock Prevention** — DB-level trigger `trg_check_inventory_quantity` rejects any update that would make quantity < 0
>>>>>>> 887c46c (create_order updated)

### Advanced Features
- **Dashboard** — Real-time statistics with 6 KPI cards
- **Analytics** — Bar, Pie, Area charts for data visualization
<<<<<<< HEAD
- **Search** — Store search by name, address, manager
- **Low Stock Alerts** — Inventory items below threshold
- **Status Badges** — Color-coded order and store statuses
- **SQL Injection Prevention** — Parameterized queries throughout
- **Transactions** — Order creation with transaction support
=======
- **Search** — Store search by name, address, manager; product search in order form
- **Low Stock Alerts** — Inventory items below threshold highlighted
- **Status Badges** — Color-coded order and store statuses
- **SQL Injection Prevention** — Parameterized queries throughout
- **Transactions** — Order creation with `BEGIN / COMMIT / ROLLBACK` and `FOR UPDATE` row locking
>>>>>>> 887c46c (create_order updated)
- **Dark Theme UI** — Premium glassmorphism design

---

## Folder Structure

```
dark-store-management/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx       # Main layout wrapper
│   │   │   │   └── Sidebar.jsx      # Navigation sidebar
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx    # Dashboard with charts
│   │   │   ├── Stores/
│   │   │   │   └── Stores.jsx       # Store CRUD page
│   │   │   ├── Zones/
│   │   │   │   └── Zones.jsx        # Zone CRUD page
│   │   │   ├── Inventory/
│   │   │   │   └── Inventory.jsx    # Inventory CRUD page
│   │   │   ├── Employees/
│   │   │   │   └── Employees.jsx    # Employee CRUD page
│   │   │   ├── Orders/
│   │   │   │   └── Orders.jsx       # Inventory-aware order CRUD page
│   │   │   ├── Analytics/
│   │   │   │   └── Analytics.jsx    # Analytics charts page
│   │   │   └── common/
│   │   │       ├── Modal.jsx        # Reusable modal dialog
│   │   │       ├── Toast.jsx        # Notification component
│   │   │       └── Loader.jsx       # Loading spinner
│   │   ├── services/
│   │   │   └── api.js               # Axios API service (all endpoints)
│   │   ├── App.jsx                  # Root component with routes
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles + Tailwind
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                          # Node.js Backend (MVC)
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── controllers/                 # Business logic (C in MVC)
│   │   ├── zoneController.js
│   │   ├── storeController.js
│   │   ├── inventoryController.js   # Includes getProductsByStore()
│   │   ├── employeeController.js
│   │   ├── orderController.js       # Inventory-aware order logic
│   │   └── analyticsController.js
│   ├── routes/                      # Route definitions
│   │   ├── zoneRoutes.js
│   │   ├── storeRoutes.js
│   │   ├── inventoryRoutes.js       # Includes /products/:storeId
│   │   ├── employeeRoutes.js
│   │   ├── orderRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js          # Centralized error handling
│   ├── app.js                       # Express application
│   ├── package.json
│   └── .env                         # Environment variables
│
├── database/                        # SQL Files
│   ├── schema.sql                   # Tables + Views + Triggers + Stored Procedures
│   ├── seed.sql                     # Sample data insertion
│   └── migrate_orders_inventory.sql # Migration: adds product_id & quantity to orders
│
├── .gitignore
└── README.md
```

---

## ER Diagram
<<<<<<< HEAD

### Entity-Relationship Description
=======
>>>>>>> 887c46c (create_order updated)

```
┌──────────────┐       1:M       ┌──────────────────┐
│    ZONES     │◄────────────────│   DARK_STORES    │
│              │                 │                  │
│ zone_id (PK) │                 │ store_id (PK)    │
│ zone_name    │                 │ store_name       │
│ city         │                 │ address          │
│ pincode      │                 │ zone_id (FK)     │
│ delivery_rad │                 │ manager_name     │
└──────┬───────┘                 │ contact_number   │
       │                         │ capacity         │
       │                         │ status           │
       │                         └──┬───────┬───────┘
       │                            │       │
       │ 1:M                   1:M  │       │ 1:M
       │                            │       │
       │    ┌────────────────┐      │       │    ┌──────────────┐
       │    │   INVENTORY    │◄─────┘       └───►│  EMPLOYEES   │
       │    │                │                    │              │
       │    │ product_id(PK) │◄──────────┐        │ emp_id (PK)  │
       │    │ product_name   │           │        │ name         │
       │    │ category       │           │ M:1    │ role         │
       │    │ quantity       │           │        │ salary       │
       │    │ price          │           │        │ phone_number │
       │    │ store_id (FK)  │           │        │ store_id(FK) │
       │    └────────────────┘           │        └──────────────┘
       │                                 │
       │         ┌────────────────┐      │
       └────────►│    ORDERS      │──────┘
                 │                │
                 │ order_id (PK)  │
                 │ customer_name  │
                 │ customer_addr  │
                 │ zone_id (FK)   │──── FK to ZONES
                 │ store_id (FK)  │──── FK to DARK_STORES
                 │ product_id(FK) │──── FK to INVENTORY
                 │ quantity       │
                 │ order_amount   │
                 │ delivery_status│
                 │ order_date     │
                 └────────────────┘
```

### Relationships

| Relationship             | Type | Description                                      |
|--------------------------|------|--------------------------------------------------|
| Zone → Dark Stores       | 1:M  | One zone has many stores                         |
| Dark Store → Inventory   | 1:M  | One store has many products                      |
| Dark Store → Employees   | 1:M  | One store has many employees                     |
| Zone → Orders            | 1:M  | One zone has many orders                         |
| Dark Store → Orders      | 1:M  | One store fulfills many orders                   |
| Inventory → Orders       | 1:M  | One product can appear in many orders            |

---

## Relational Schema

```sql
zones(zone_id PK, zone_name, city, pincode, delivery_radius)

dark_stores(store_id PK, store_name, address, zone_id FK→zones,
            manager_name, contact_number, capacity, status)

inventory(product_id PK, product_name, category, quantity, price,
          store_id FK→dark_stores)

employees(employee_id PK, name, role, salary, phone_number,
          store_id FK→dark_stores)

orders(order_id PK, customer_name, customer_address,
       zone_id FK→zones, store_id FK→dark_stores,
       product_id FK→inventory,
       quantity,
       order_amount, delivery_status, order_date)
```

---
<<<<<<< HEAD
=======

>>>>>>> 887c46c (create_order updated)
## Database Concepts Demonstrated

| Concept                | Where Implemented                                              |
|------------------------|----------------------------------------------------------------|
| **ER Model**           | 5 entities with proper relationships                           |
| **Relational Schema**  | Normalized tables in 3NF                                       |
| **Primary Keys**       | AUTO_INCREMENT IDs on all tables                               |
| **Foreign Keys**       | zone_id, store_id, product_id references with CASCADE rules    |
| **NOT NULL**           | All essential fields have NOT NULL constraints                  |
| **UNIQUE**             | store_name, contact_number, phone_number                       |
| **CHECK**              | capacity > 0, price > 0, quantity >= 0, order_amount > 0       |
| **ENUM**               | status (Active/Inactive), delivery_status                      |
| **CRUD Operations**    | Full Create, Read, Update, Delete for all entities             |
| **SQL JOINs**          | INNER JOIN, LEFT JOIN across up to 4 tables (orders query)     |
| **GROUP BY**           | Analytics queries with aggregation                             |
| **Aggregate Functions**| COUNT, SUM, AVG, COALESCE                                      |
| **Nested Queries**     | Subqueries in analytics controller                             |
| **Views**              | 5 database views for reporting                                 |
| **Indexes**            | 12 indexes for query performance (incl. idx_orders_product)    |
| **Triggers**           | trg_check_inventory_quantity — prevents negative stock         |
| **Stored Procedures**  | sp_create_order (with stock check), sp_dashboard_stats         |
| **Transactions**       | Order creation with BEGIN / COMMIT / ROLLBACK                  |
| **Row-Level Locking**  | FOR UPDATE on inventory row during order transaction         |
| **Normalization**      | All tables in 3NF (no partial/transitive dependencies)         |
| **Referential Integrity** | ON DELETE CASCADE / RESTRICT / SET NULL as appropriate      |

---

## Setup & Installation

### Prerequisites

- **Node.js** v18+ and npm
- **MySQL** 8.0+
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/dark-store-management.git
cd dark-store-management
```

### Step 2: Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Run the schema (tables, views, triggers, stored procedures)
source database/schema.sql

# Run seed data
source database/seed.sql
```

> **If upgrading an existing database** (orders table already exists without product_id/quantity):
> ```bash
> source database/migrate_orders_inventory.sql
> ```

### Step 3: Configure Backend

```bash
cd server
npm install
```

Edit `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dark_store_db
DB_PORT=3306
```

### Step 4: Configure Frontend

```bash
cd client
npm install
```

### Step 5: Run the Application

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm run dev
```

### Step 6: Open in Browser

Navigate to: **http://localhost:5173**

---

## API Documentation

### Base URL: `http://localhost:5000/api`

### Zones API

| Method | Endpoint         | Description    |
|--------|------------------|----------------|
| GET    | `/zones`         | Get all zones  |
| GET    | `/zones/:id`     | Get zone by ID |
| POST   | `/zones`         | Create zone    |
| PUT    | `/zones/:id`     | Update zone    |
| DELETE | `/zones/:id`     | Delete zone    |

### Stores API

| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| GET    | `/stores`           | Get all stores      |
| GET    | `/stores/:id`       | Get store by ID     |
| GET    | `/stores/search?q=` | Search stores       |
| POST   | `/stores`           | Create store        |
| PUT    | `/stores/:id`       | Update store        |
| DELETE | `/stores/:id`       | Delete store        |

### Inventory API

| Method | Endpoint                        | Description                                  |
|--------|---------------------------------|----------------------------------------------|
| GET    | `/inventory`                    | Get all products                             |
| GET    | `/inventory/:id`                | Get product by ID                            |
| GET    | `/inventory/store/:storeId`     | Get all products by store                    |
| GET    | `/inventory/products/:storeId`  | Get in-stock products by store               |
| GET    | `/inventory/low-stock`          | Get items with quantity < 10                 |
| POST   | `/inventory`                    | Add product                                  |
| PUT    | `/inventory/:id`                | Update product                               |
| DELETE | `/inventory/:id`                | Delete product                               |

### Employees API

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/employees`                | Get all employees        |
| GET    | `/employees/:id`            | Get employee by ID       |
| GET    | `/employees/store/:storeId` | Get employees by store   |
| POST   | `/employees`                | Add employee             |
| PUT    | `/employees/:id`            | Update employee          |
| DELETE | `/employees/:id`            | Delete employee          |

### Orders API

| Method | Endpoint                 | Description                                   |
|--------|--------------------------|-----------------------------------------------|
| GET    | `/orders`                | Get all orders (with product name via JOIN)   |
| GET    | `/orders/:id`            | Get order by ID                               |
| GET    | `/orders/zone/:zoneId`   | Get orders by zone                            |
| GET    | `/orders/store/:storeId` | Get orders by store                           |
| POST   | `/orders`                | Create order + validate stock + deduct inventory |
| PUT    | `/orders/:id/status`     | Update delivery status                        |
| DELETE | `/orders/:id`            | Delete order                                  |

**POST `/orders` — Request Body:**
```json
{
  "customer_name": "Raju",
  "customer_address": "12 MG Road, Bangalore",
  "zone_id": 1,
  "store_id": 2,
  "product_id": 5,
  "quantity": 3,
  "order_amount": 450.00
}
```

**POST `/orders` — Error Responses:**
| HTTP | Message |
|------|---------|
| 400  | Product out of stock. Available: N unit(s) |
| 400  | Product not found in inventory for this store |
| 400  | Store is not active or does not exist |
| 400  | Zone does not exist |

### Analytics API

| Method | Endpoint                                | Description                  |
|--------|-----------------------------------------|------------------------------|
| GET    | `/analytics/dashboard`                  | Dashboard statistics         |
| GET    | `/analytics/orders-per-zone`            | Orders count per zone        |
| GET    | `/analytics/revenue-by-store`           | Revenue ranking by store     |
| GET    | `/analytics/orders-by-city`             | Orders delivered per city    |
| GET    | `/analytics/employees-per-store`        | Employee count per store     |
| GET    | `/analytics/inventory-summary`          | Inventory value per store    |
| GET    | `/analytics/order-status-distribution`  | Order status breakdown       |

---

## SQL Queries Reference

### 1. JOIN Query — Orders with Product & Store Info
```sql
SELECT o.*, z.zone_name, z.city, ds.store_name,
       i.product_name, i.price AS unit_price
FROM orders o
INNER JOIN zones z        ON o.zone_id    = z.zone_id
INNER JOIN dark_stores ds ON o.store_id   = ds.store_id
LEFT  JOIN inventory i    ON o.product_id = i.product_id
ORDER BY o.order_date DESC;
```

### 2. Inventory Stock Check with Row Lock (inside transaction)
```sql
SELECT product_id, product_name, quantity, price
FROM inventory
WHERE product_id = ? AND store_id = ?
FOR UPDATE;
```

### 3. Atomic Stock Deduction
```sql
UPDATE inventory
SET quantity = quantity - ?
WHERE product_id = ? AND store_id = ?;
```

### 4. GROUP BY + Aggregate — Orders per Zone
```sql
SELECT z.zone_name, z.city,
       COUNT(o.order_id) AS total_orders,
       SUM(o.order_amount) AS total_revenue
FROM zones z
LEFT JOIN orders o ON z.zone_id = o.zone_id
GROUP BY z.zone_id, z.zone_name, z.city
ORDER BY total_revenue DESC;
```

### 5. Nested Query — Stores with Above-Average Orders
```sql
SELECT store_name FROM dark_stores
WHERE store_id IN (
    SELECT store_id FROM orders
    GROUP BY store_id
    HAVING COUNT(*) > (
        SELECT AVG(cnt) FROM (
            SELECT COUNT(*) AS cnt FROM orders GROUP BY store_id
        ) AS avg_tbl
    )
);
```

### 6. Highest Revenue Store
```sql
SELECT ds.store_name, SUM(o.order_amount) AS revenue
FROM dark_stores ds
JOIN orders o ON ds.store_id = o.store_id
GROUP BY ds.store_id, ds.store_name
ORDER BY revenue DESC LIMIT 1;
```

### 7. Low Stock Inventory Report
```sql
SELECT i.*, ds.store_name FROM inventory i
JOIN dark_stores ds ON i.store_id = ds.store_id
WHERE i.quantity < 10 ORDER BY i.quantity ASC;
```

### 8. Employees per Store
```sql
SELECT ds.store_name,
       COUNT(e.employee_id) AS total_employees,
       SUM(e.salary) AS total_salary
FROM dark_stores ds
LEFT JOIN employees e ON ds.store_id = e.store_id
GROUP BY ds.store_id, ds.store_name;
```

### 9. Orders Delivered per City
```sql
SELECT z.city,
       COUNT(o.order_id) AS total_orders,
       SUM(CASE WHEN o.delivery_status = 'Delivered' THEN 1 ELSE 0 END) AS delivered
FROM zones z
LEFT JOIN orders o ON z.zone_id = o.zone_id
GROUP BY z.city;
```
## Screenshots
<img width="1914" height="891" alt="Screenshot 2026-05-17 174119" src="https://github.com/user-attachments/assets/f26f57f7-e6b6-460c-b5cd-a938727dcdcf" />

<<<<<<< HEAD
<img width="1912" height="904" alt="Screenshot 2026-05-17 174217" src="https://github.com/user-attachments/assets/b9f71e2a-96f8-4428-8f25-590ccd08b8f7" />

<img width="1919" height="910" alt="Screenshot 2026-05-17 174236" src="https://github.com/user-attachments/assets/b1b0c16a-1f07-487c-9196-c285cde705b0" />
=======
### 10. In-Stock Products for a Store (Order Form Dropdown)
```sql
SELECT product_id, product_name, category, quantity, price
FROM inventory
WHERE store_id = ? AND quantity > 0
ORDER BY product_name ASC;
```

---

## Inventory-Aware Order Workflow

```
User opens "Create Order"
        │
        ▼
Select Zone + Store
        │
        ▼
Product dropdown loads (GET /inventory/products/:storeId)
        │
        ▼
User selects product → stock badge shown (green/yellow/red status)
        │
        ▼
User enters quantity → Order Amount auto-calculated (price * qty)
        │
        ▼
        ┌──────────────────────────────────────┐
        │        POST /orders (transaction)    │
        │  1. Verify store is Active           │
        │  2. Verify zone exists               │
        │  3. SELECT ... FOR UPDATE on product │
        │  4. Check quantity >= requested      │
        │  5. UPDATE inventory (deduct stock)  │
        │  6. INSERT into orders               │
        │  7. COMMIT                           │
        └──────────────────────────────────────┘
        │                    │
        ▼                    ▼
   Stock OK            Stock insufficient
   Order created       400: "Product out of stock"
   Inventory updated   Order not created
   Success toast       Error toast shown
```
>>>>>>> 887c46c (create_order updated)
