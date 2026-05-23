/**
 * Orders Page
 * Full CRUD for order management with zone/store filtering, status updates,
 * and inventory-aware order creation (product selection + stock validation).
 */

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Filter, Package, Search } from 'lucide-react';
import { orderAPI, storeAPI, zoneAPI, inventoryAPI } from '../../services/api';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import Loader from '../common/Loader';

const emptyForm = {
  customer_name: '',
  customer_address: '',
  zone_id: '',
  store_id: '',
  product_id: '',
  quantity: '',
  order_amount: '',
};

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders]               = useState([]);
  const [stores, setStores]               = useState([]);
  const [zones, setZones]                 = useState([]);
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm]                   = useState(emptyForm);
  const [productSearch, setProductSearch] = useState('');
  const [filterZone, setFilterZone]       = useState('');
  const [filterStore, setFilterStore]     = useState('');
  const [newStatus, setNewStatus]         = useState('');
  const [toast, setToast]                 = useState({ type: '', message: '' });

  useEffect(() => {
    fetchOrders();
    fetchStores();
    fetchZones();
  }, []);

  // When store changes in the form, load products for that store
  useEffect(() => {
    if (form.store_id) {
      fetchProductsForStore(form.store_id);
    } else {
      setProducts([]);
    }
    // Reset product and computed amount whenever store changes
    setForm(prev => ({ ...prev, product_id: '', quantity: '', order_amount: '' }));
    setProductSearch('');
  }, [form.store_id]);

  // Auto-calculate order_amount when product or quantity changes
  useEffect(() => {
    const product = products.find(p => String(p.product_id) === String(form.product_id));
    if (product && form.quantity && parseInt(form.quantity) > 0) {
      const total = (parseFloat(product.price) * parseInt(form.quantity)).toFixed(2);
      setForm(prev => ({ ...prev, order_amount: total }));
    } else if (!form.quantity) {
      setForm(prev => ({ ...prev, order_amount: '' }));
    }
  }, [form.product_id, form.quantity, products]);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll();
      setOrders(res.data.data);
    } catch (err) {
      showToast('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await storeAPI.getAll();
      setStores(res.data.data);
    } catch (err) {
      console.error('Failed to load stores:', err);
    }
  };

  const fetchZones = async () => {
    try {
      const res = await zoneAPI.getAll();
      setZones(res.data.data);
    } catch (err) {
      console.error('Failed to load zones:', err);
    }
  };

  const fetchProductsForStore = async (storeId) => {
    setProductsLoading(true);
    try {
      const res = await inventoryAPI.getProductsByStore(storeId);
      setProducts(res.data.data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000);
  };

  const applyFilter = async (type, value) => {
    try {
      setLoading(true);
      if (type === 'zone') {
        setFilterZone(value);
        setFilterStore('');
        const res = value ? await orderAPI.getByZone(value) : await orderAPI.getAll();
        setOrders(res.data.data);
      } else {
        setFilterStore(value);
        setFilterZone('');
        const res = value ? await orderAPI.getByStore(value) : await orderAPI.getAll();
        setOrders(res.data.data);
      }
    } catch (err) {
      showToast('error', 'Failed to filter orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side stock check
    const selectedProduct = products.find(p => String(p.product_id) === String(form.product_id));
    if (selectedProduct && parseInt(form.quantity) > selectedProduct.quantity) {
      showToast('error', `Product out of stock. Available: ${selectedProduct.quantity} unit(s)`);
      return;
    }

    setSubmitting(true);
    try {
      await orderAPI.create({
        ...form,
        quantity: parseInt(form.quantity),
        order_amount: parseFloat(form.order_amount),
      });
      showToast('success', 'Order created successfully! Inventory updated.');
      setShowModal(false);
      setForm(emptyForm);
      setProducts([]);
      setProductSearch('');
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create order';
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const openStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.delivery_status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await orderAPI.updateStatus(selectedOrder.order_id, newStatus);
      showToast('success', 'Status updated successfully');
      setShowStatusModal(false);
      fetchOrders();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await orderAPI.delete(id);
      showToast('success', 'Order deleted successfully');
      fetchOrders();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed');
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setProducts([]);
    setProductSearch('');
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const classes = {
      'Pending':    'badge-pending',
      'Processing': 'badge-processing',
      'Shipped':    'badge-shipped',
      'Delivered':  'badge-delivered',
      'Cancelled':  'badge-cancelled',
    };
    return classes[status] || 'badge-pending';
  };

  // Filtered products based on search text
  const filteredProducts = products.filter(p =>
    p.product_name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectedProduct = products.find(p => String(p.product_id) === String(form.product_id));

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-dark-500 mt-1">{orders.length} orders</p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2"
          id="btn-create-order"
        >
          <Plus className="w-4 h-4" /> Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-dark-500" />
        <select
          className="select-dark max-w-xs"
          value={filterZone}
          onChange={(e) => applyFilter('zone', e.target.value)}
        >
          <option value="">All Zones</option>
          {zones.map((z) => (
            <option key={z.zone_id} value={z.zone_id}>{z.zone_name} - {z.city}</option>
          ))}
        </select>
        <select
          className="select-dark max-w-xs"
          value={filterStore}
          onChange={(e) => applyFilter('store', e.target.value)}
        >
          <option value="">All Stores</option>
          {stores.map((s) => (
            <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
          ))}
        </select>
        {(filterZone || filterStore) && (
          <button
            onClick={() => { setFilterZone(''); setFilterStore(''); fetchOrders(); }}
            className="btn-secondary text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Zone</th>
                <th>Store</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-dark-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="text-white font-mono">#{order.order_id}</td>
                    <td>
                      <div>
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p className="text-xs text-dark-500 truncate max-w-[180px]">{order.customer_address}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-primary-400 shrink-0" />
                        <span className="text-sm">{order.product_name || '—'}</span>
                      </div>
                    </td>
                    <td className="text-center font-mono">{order.quantity ?? '—'}</td>
                    <td>{order.zone_name}</td>
                    <td>{order.store_name}</td>
                    <td className="text-white font-medium">₹{Number(order.order_amount).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => openStatusUpdate(order)}
                        className={getStatusBadge(order.delivery_status)}
                        title="Click to update status"
                      >
                        {order.delivery_status}
                      </button>
                    </td>
                    <td className="text-xs">
                      {new Date(order.order_date).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openStatusUpdate(order)}
                          className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                          title="Update Status"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.order_id)}
                          className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create Order Modal ── */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Order">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Customer Name</label>
            <input
              type="text"
              className="input-dark"
              placeholder="Customer name"
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              required
            />
          </div>

          {/* Customer Address */}
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Customer Address</label>
            <input
              type="text"
              className="input-dark"
              placeholder="Delivery address"
              value={form.customer_address}
              onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
              required
            />
          </div>

          {/* Zone & Store */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Zone</label>
              <select
                className="select-dark"
                value={form.zone_id}
                onChange={(e) => setForm({ ...form, zone_id: e.target.value })}
                required
              >
                <option value="">Select Zone</option>
                {zones.map((z) => (
                  <option key={z.zone_id} value={z.zone_id}>{z.zone_name} - {z.city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Store</label>
              <select
                className="select-dark"
                value={form.store_id}
                onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                required
              >
                <option value="">Select Store</option>
                {stores.filter(s => s.status === 'Active').map((s) => (
                  <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">
              Product
              {productsLoading && (
                <span className="ml-2 text-xs text-primary-400 animate-pulse">Loading products…</span>
              )}
            </label>

            {!form.store_id ? (
              <div className="input-dark text-dark-500 cursor-not-allowed select-none flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Select a store first</span>
              </div>
            ) : productsLoading ? (
              <div className="input-dark text-dark-500 animate-pulse">Loading products…</div>
            ) : (
              <>
                {/* Searchable product list */}
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type="text"
                    className="input-dark pl-9"
                    placeholder="Search products…"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>

                <select
                  className="select-dark"
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  required
                  size={Math.min(filteredProducts.length + 1, 6)}
                  style={{ height: 'auto' }}
                >
                  <option value="">— Select Product —</option>
                  {filteredProducts.length === 0 ? (
                    <option disabled>No products available for this store</option>
                  ) : (
                    filteredProducts.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_name} ({p.category}) — ₹{Number(p.price).toLocaleString()} | Stock: {p.quantity}
                      </option>
                    ))
                  )}
                </select>

                {/* Selected product stock info badge */}
                {selectedProduct && (
                  <div className={`mt-2 text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${
                    selectedProduct.quantity > 10
                      ? 'bg-green-500/10 text-green-400'
                      : selectedProduct.quantity > 0
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    <Package className="w-3 h-3" />
                    {selectedProduct.quantity > 0
                      ? `In stock: ${selectedProduct.quantity} unit(s) · ₹${Number(selectedProduct.price).toLocaleString()} each`
                      : 'Out of stock'}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quantity & Order Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                max={selectedProduct?.quantity || undefined}
                className="input-dark"
                placeholder="e.g. 2"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
                disabled={!form.product_id}
              />
              {/* Stock-exceeded warning */}
              {selectedProduct && form.quantity && parseInt(form.quantity) > selectedProduct.quantity && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  ⚠ Exceeds available stock ({selectedProduct.quantity})
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Order Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                className="input-dark bg-dark-700/50 cursor-not-allowed"
                placeholder="Auto-calculated"
                value={form.order_amount}
                readOnly
                title="Calculated automatically from product price × quantity"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={
                submitting ||
                !form.product_id ||
                !form.quantity ||
                parseInt(form.quantity) <= 0 ||
                (selectedProduct && parseInt(form.quantity) > selectedProduct.quantity)
              }
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                'Create Order'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Update Status Modal ── */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Delivery Status" size="sm">
        <div className="space-y-4">
          <p className="text-dark-400 text-sm">
            Order <span className="text-white font-mono">#{selectedOrder?.order_id}</span> for{' '}
            <span className="text-white">{selectedOrder?.customer_name}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">New Status</label>
            <select className="select-dark" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowStatusModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleStatusUpdate} className="btn-primary">Update Status</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
