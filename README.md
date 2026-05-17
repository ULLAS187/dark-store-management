mysudo # 🏪 Dark Store and Zone Registry Management System

A full-stack **Database Management System (DBMS)** mini project that manages dark stores (warehouse-like stores for quick commerce), delivery zones, inventory, employees, and orders.

> **Built for:** Engineering DBMS Mini Project Submission & Demonstration

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [ER Diagram](#-er-diagram)
- [Relational Schema](#-relational-schema)
- [Database Concepts Demonstrated](#-database-concepts-demonstrated)
- [Setup & Installation](#-setup--installation)
- [API Documentation](#-api-documentation)
- [SQL Queries Reference](#-sql-queries-reference)
- [Screenshots](#-screenshots)

---

## 🎯 Project Overview

This system manages the operations of **dark stores** — warehouse-style fulfillment centers used in quick commerce. It covers:

- **Dark Store Management** — Add, edit, delete, search dark stores
- **Zone Registry** — Manage delivery zones across cities
- **Inventory Management** — Track products, stock levels, low stock alerts
- **Employee Management** — Manage staff assignments across stores
- **Order Management** — Create orders, track delivery status
- **Analytics Dashboard** — Charts, reports, and performance metrics

---

## 🛠️ Tech Stack

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

## ✨ Features

### Core CRUD Operations
- ✅ **Dark Stores** — Create, Read, Update, Delete with search
- ✅ **Zones** — Full CRUD for delivery zones
- ✅ **Inventory** — Product management with store-wise filtering
- ✅ **Employees** — Staff management with role assignments
- ✅ **Orders** — Order creation with status tracking

### Advanced Features
- 📊 **Dashboard** — Real-time statistics with 6 KPI cards
- 📈 **Analytics** — Bar, Pie, Area charts for data visualization
- 🔍 **Search** — Store search by name, address, manager
- 🔔 **Low Stock Alerts** — Inventory items below threshold
- 🏷️ **Status Badges** — Color-coded order and store statuses
- 🔐 **SQL Injection Prevention** — Parameterized queries throughout
- 🔄 **Transactions** — Order creation with transaction support
- 🎨 **Dark Theme UI** — Premium glassmorphism design

---

## 📁 Folder Structure

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
│   │   │   │   └── Orders.jsx       # Order CRUD page
│   │   │   ├── Analytics/
│   │   │   │   └── Analytics.jsx    # Analytics charts page
│   │   │   └── common/
│   │   │       ├── Modal.jsx        # Reusable modal dialog
│   │   │       ├── Toast.jsx        # Notification component
│   │   │       └── Loader.jsx       # Loading spinner
│   │   ├── services/
│   │   │   └── api.js               # Axios API service
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
│   │   ├── inventoryController.js
│   │   ├── employeeController.js
│   │   ├── orderController.js
│   │   └── analyticsController.js
│   ├── routes/                      # Route definitions
│   │   ├── zoneRoutes.js
│   │   ├── storeRoutes.js
│   │   ├── inventoryRoutes.js
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
│   ├── schema.sql                   # Table creation + Views + Triggers
│   └── seed.sql                     # Sample data insertion
│
├── .gitignore
└── README.md
```

---

## 📐 ER Diagram

### Entity-Relationship Description

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
       │    │ product_id(PK) │                    │ emp_id (PK)  │
       │    │ product_name   │                    │ name         │
       │    │ category       │                    │ role         │
       │    │ quantity       │                    │ salary       │
       │    │ price          │                    │ phone_number │
       │    │ store_id (FK)  │                    │ store_id(FK) │
       │    └────────────────┘                    └──────────────┘
       │
       │         ┌────────────────┐
       └────────►│    ORDERS      │
                 │                │
                 │ order_id (PK)  │
                 │ customer_name  │
                 │ customer_addr  │
                 │ zone_id (FK)   │
                 │ store_id (FK)  │◄──── FK to DARK_STORES
                 │ order_amount   │
                 │ delivery_status│
                 │ order_date     │
                 └────────────────┘
```

### Relationships

| Relationship           | Type | Description                              |
|------------------------|------|------------------------------------------|
| Zone → Dark Stores     | 1:M  | One zone has many stores                 |
| Dark Store → Inventory | 1:M  | One store has many products              |
| Dark Store → Employees | 1:M  | One store has many employees             |
| Zone → Orders          | 1:M  | One zone has many orders                 |
| Dark Store → Orders    | 1:M  | One store fulfills many orders           |

---

## 📊 Relational Schema

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
       order_amount, delivery_status, order_date)
```

---

## 🎓 Database Concepts Demonstrated

| Concept                | Where Implemented                                    |
|------------------------|------------------------------------------------------|
| **ER Model**           | 5 entities with proper relationships                 |
| **Relational Schema**  | Normalized tables in 3NF                             |
| **Primary Keys**       | AUTO_INCREMENT IDs on all tables                     |
| **Foreign Keys**       | zone_id, store_id references with ON DELETE CASCADE  |
| **NOT NULL**           | All essential fields have NOT NULL constraints        |
| **UNIQUE**             | store_name, contact_number, phone_number             |
| **CHECK**              | capacity > 0, price > 0, quantity >= 0               |
| **ENUM**               | status (Active/Inactive), delivery_status            |
| **CRUD Operations**    | Full Create, Read, Update, Delete for all entities   |
| **SQL JOINs**          | INNER JOIN, LEFT JOIN across multiple tables          |
| **GROUP BY**           | Analytics queries with aggregation                   |
| **Aggregate Functions**| COUNT, SUM, AVG, COALESCE                            |
| **Nested Queries**     | Subqueries in analytics controller                   |
| **Views**              | 5 database views for reporting                       |
| **Indexes**            | 11 indexes for query performance                     |
| **Triggers**           | Inventory quantity validation trigger                |
| **Stored Procedures**  | sp_create_order, sp_dashboard_stats                  |
| **Transactions**       | Order creation with BEGIN/COMMIT/ROLLBACK            |
| **Normalization**      | All tables in 3NF (no partial/transitive deps)       |

---

## 🚀 Setup & Installation

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

# Run the schema file
source database/schema.sql

# Run the seed data file
source database/seed.sql
```

### Step 3: Configure Backend

```bash
cd server

# Install dependencies
npm install

# Edit .env file with your MySQL credentials
# Update DB_PASSWORD with your MySQL root password
```

Edit `server/.env`:
```
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

# Install dependencies
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

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Zones API

| Method | Endpoint         | Description       |
|--------|------------------|-------------------|
| GET    | `/zones`         | Get all zones     |
| GET    | `/zones/:id`     | Get zone by ID    |
| POST   | `/zones`         | Create zone       |
| PUT    | `/zones/:id`     | Update zone       |
| DELETE | `/zones/:id`     | Delete zone       |

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

| Method | Endpoint                   | Description             |
|--------|----------------------------|-------------------------|
| GET    | `/inventory`               | Get all products        |
| GET    | `/inventory/:id`           | Get product by ID       |
| GET    | `/inventory/store/:storeId`| Get products by store   |
| GET    | `/inventory/low-stock`     | Get low stock items     |
| POST   | `/inventory`               | Add product             |
| PUT    | `/inventory/:id`           | Update product          |
| DELETE | `/inventory/:id`           | Delete product          |

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

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | `/orders`                | Get all orders        |
| GET    | `/orders/:id`            | Get order by ID       |
| GET    | `/orders/zone/:zoneId`   | Get orders by zone    |
| GET    | `/orders/store/:storeId` | Get orders by store   |
| POST   | `/orders`                | Create order          |
| PUT    | `/orders/:id/status`     | Update delivery status|
| DELETE | `/orders/:id`            | Delete order          |

### Analytics API

| Method | Endpoint                              | Description                  |
|--------|---------------------------------------|------------------------------|
| GET    | `/analytics/dashboard`                | Dashboard statistics         |
| GET    | `/analytics/orders-per-zone`          | Orders count per zone        |
| GET    | `/analytics/revenue-by-store`         | Revenue ranking by store     |
| GET    | `/analytics/orders-by-city`           | Orders delivered per city    |
| GET    | `/analytics/employees-per-store`      | Employee count per store     |
| GET    | `/analytics/inventory-summary`        | Inventory value per store    |
| GET    | `/analytics/order-status-distribution`| Order status breakdown       |

---

## 🔍 SQL Queries Reference

### 1. JOIN Query — Stores with Zone Info
```sql
SELECT ds.*, z.zone_name, z.city, z.pincode
FROM dark_stores ds
INNER JOIN zones z ON ds.zone_id = z.zone_id;
```

### 2. GROUP BY + Aggregate — Orders per Zone
```sql
SELECT z.zone_name, z.city, COUNT(o.order_id) AS total_orders, 
       SUM(o.order_amount) AS total_revenue
FROM zones z
LEFT JOIN orders o ON z.zone_id = o.zone_id
GROUP BY z.zone_id, z.zone_name, z.city
ORDER BY total_revenue DESC;
```

### 3. Nested Query — Stores with Above-Average Orders
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

### 4. Highest Revenue Store
```sql
SELECT ds.store_name, SUM(o.order_amount) AS revenue
FROM dark_stores ds
JOIN orders o ON ds.store_id = o.store_id
GROUP BY ds.store_id, ds.store_name
ORDER BY revenue DESC LIMIT 1;
```

### 5. Low Stock Inventory Report
```sql
SELECT i.*, ds.store_name FROM inventory i
JOIN dark_stores ds ON i.store_id = ds.store_id
WHERE i.quantity < 10 ORDER BY i.quantity ASC;
```

### 6. Employees per Store
```sql
SELECT ds.store_name, COUNT(e.employee_id) AS total_employees,
       SUM(e.salary) AS total_salary
FROM dark_stores ds
LEFT JOIN employees e ON ds.store_id = e.store_id
GROUP BY ds.store_id, ds.store_name;
```

### 7. Orders Delivered per City
```sql
SELECT z.city, COUNT(o.order_id) AS total_orders,
       SUM(CASE WHEN o.delivery_status = 'Delivered' THEN 1 ELSE 0 END) AS delivered
FROM zones z LEFT JOIN orders o ON z.zone_id = o.zone_id
GROUP BY z.city;
```

---

## 📸 Screenshots

> After running the project, you can capture screenshots of:

1. **Dashboard** — Overview with stat cards and charts
2. **Dark Stores** — Store listing with search
3. **Zones** — Zone management table
4. **Inventory** — Product list with low stock alerts
5. **Employees** — Employee listing by store
6. **Orders** — Order management with status updates
7. **Analytics** — Detailed charts and performance metrics
