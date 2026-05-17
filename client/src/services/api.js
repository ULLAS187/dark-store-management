/**
 * API Service
 * Centralized HTTP client using Axios for all API calls.
 * Base URL is proxied through Vite dev server to backend.
 */

import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// =====================
// Zone API
// =====================
export const zoneAPI = {
  getAll: () => api.get('/zones'),
  getById: (id) => api.get(`/zones/${id}`),
  create: (data) => api.post('/zones', data),
  update: (id, data) => api.put(`/zones/${id}`, data),
  delete: (id) => api.delete(`/zones/${id}`),
};

// =====================
// Store API
// =====================
export const storeAPI = {
  getAll: () => api.get('/stores'),
  getById: (id) => api.get(`/stores/${id}`),
  search: (query) => api.get(`/stores/search?q=${encodeURIComponent(query)}`),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
};

// =====================
// Inventory API
// =====================
export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  getByStore: (storeId) => api.get(`/inventory/store/${storeId}`),
  getLowStock: () => api.get('/inventory/low-stock'),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
};

// =====================
// Employee API
// =====================
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  getByStore: (storeId) => api.get(`/employees/store/${storeId}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// =====================
// Order API
// =====================
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByZone: (zoneId) => api.get(`/orders/zone/${zoneId}`),
  getByStore: (storeId) => api.get(`/orders/store/${storeId}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { delivery_status: status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// =====================
// Analytics API
// =====================
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getOrdersPerZone: () => api.get('/analytics/orders-per-zone'),
  getRevenueByStore: () => api.get('/analytics/revenue-by-store'),
  getOrdersByCity: () => api.get('/analytics/orders-by-city'),
  getEmployeesPerStore: () => api.get('/analytics/employees-per-store'),
  getInventorySummary: () => api.get('/analytics/inventory-summary'),
  getOrderStatusDistribution: () => api.get('/analytics/order-status-distribution'),
};

export default api;
