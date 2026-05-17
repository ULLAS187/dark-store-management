/**
 * Orders Page
 * Full CRUD for order management with zone/store filtering and status updates.
 */

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ShoppingCart, Filter } from 'lucide-react';
import { orderAPI, storeAPI, zoneAPI } from '../../services/api';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import Loader from '../common/Loader';

const emptyForm = {
  customer_name: '', customer_address: '', zone_id: '',
  store_id: '', order_amount: ''
};

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterZone, setFilterZone] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchOrders();
    fetchStores();
    fetchZones();
  }, []);

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

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 3000);
  };

  const applyFilter = async (type, value) => {
    try {
      setLoading(true);
      if (type === 'zone') {
        setFilterZone(value);
        setFilterStore('');
        if (value) {
          const res = await orderAPI.getByZone(value);
          setOrders(res.data.data);
        } else {
          await fetchOrders();
        }
      } else {
        setFilterStore(value);
        setFilterZone('');
        if (value) {
          const res = await orderAPI.getByStore(value);
          setOrders(res.data.data);
        } else {
          await fetchOrders();
        }
      }
    } catch (err) {
      showToast('error', 'Failed to filter orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderAPI.create(form);
      showToast('success', 'Order created successfully');
      setShowModal(false);
      setForm(emptyForm);
      fetchOrders();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to create order');
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

  const getStatusBadge = (status) => {
    const classes = {
      'Pending': 'badge-pending',
      'Processing': 'badge-processing',
      'Shipped': 'badge-shipped',
      'Delivered': 'badge-delivered',
      'Cancelled': 'badge-cancelled',
    };
    return classes[status] || 'badge-pending';
  };

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
        <button onClick={() => { setForm(emptyForm); setShowModal(true); }} className="btn-primary flex items-center gap-2" id="btn-create-order">
          <Plus className="w-4 h-4" /> Create Order
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-dark-500" />
        <select className="select-dark max-w-xs" value={filterZone} onChange={(e) => applyFilter('zone', e.target.value)}>
          <option value="">All Zones</option>
          {zones.map((z) => (
            <option key={z.zone_id} value={z.zone_id}>{z.zone_name} - {z.city}</option>
          ))}
        </select>
        <select className="select-dark max-w-xs" value={filterStore} onChange={(e) => applyFilter('store', e.target.value)}>
          <option value="">All Stores</option>
          {stores.map((s) => (
            <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
          ))}
        </select>
        {(filterZone || filterStore) && (
          <button onClick={() => { setFilterZone(''); setFilterStore(''); fetchOrders(); }} className="btn-secondary text-xs">Clear</button>
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
                <tr><td colSpan="8" className="text-center py-12 text-dark-500">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id}>
                    <td className="text-white font-mono">#{order.order_id}</td>
                    <td>
                      <div>
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p className="text-xs text-dark-500 truncate max-w-[200px]">{order.customer_address}</p>
                      </div>
                    </td>
                    <td>{order.zone_name}</td>
                    <td>{order.store_name}</td>
                    <td className="text-white font-medium">₹{Number(order.order_amount).toLocaleString()}</td>
                    <td>
                      <button onClick={() => openStatusUpdate(order)} className={getStatusBadge(order.delivery_status)} title="Click to update status">
                        {order.delivery_status}
                      </button>
                    </td>
                    <td className="text-xs">{new Date(order.order_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openStatusUpdate(order)} className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Update Status">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(order.order_id)} className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
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

      {/* Create Order Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Order">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Customer Name</label>
            <input type="text" className="input-dark" placeholder="Customer name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Customer Address</label>
            <input type="text" className="input-dark" placeholder="Delivery address" value={form.customer_address} onChange={(e) => setForm({ ...form, customer_address: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Zone</label>
              <select className="select-dark" value={form.zone_id} onChange={(e) => setForm({ ...form, zone_id: e.target.value })} required>
                <option value="">Select Zone</option>
                {zones.map((z) => (
                  <option key={z.zone_id} value={z.zone_id}>{z.zone_name} - {z.city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Store</label>
              <select className="select-dark" value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value })} required>
                <option value="">Select Store</option>
                {stores.filter(s => s.status === 'Active').map((s) => (
                  <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Order Amount (₹)</label>
            <input type="number" step="0.01" className="input-dark" placeholder="e.g. 1500.00" value={form.order_amount} onChange={(e) => setForm({ ...form, order_amount: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Order</button>
          </div>
        </form>
      </Modal>

      {/* Update Status Modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Delivery Status" size="sm">
        <div className="space-y-4">
          <p className="text-dark-400 text-sm">
            Order <span className="text-white font-mono">#{selectedOrder?.order_id}</span> for <span className="text-white">{selectedOrder?.customer_name}</span>
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
