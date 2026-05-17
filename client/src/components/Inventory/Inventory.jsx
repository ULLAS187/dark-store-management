/**
 * Inventory Page
 * Full CRUD for inventory management with store-wise filtering and low stock alerts.
 */

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, AlertTriangle, Filter } from 'lucide-react';
import { inventoryAPI, storeAPI } from '../../services/api';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import Loader from '../common/Loader';

const emptyForm = { product_name: '', category: '', quantity: '', price: '', store_id: '' };

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterStore, setFilterStore] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchInventory();
    fetchStores();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await inventoryAPI.getAll();
      setInventory(res.data.data);
    } catch (err) {
      showToast('error', 'Failed to load inventory');
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

  const fetchByStore = async (storeId) => {
    try {
      setLoading(true);
      if (storeId) {
        const res = await inventoryAPI.getByStore(storeId);
        setInventory(res.data.data);
      } else {
        await fetchInventory();
      }
    } catch (err) {
      showToast('error', 'Failed to filter inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const res = await inventoryAPI.getLowStock();
      setInventory(res.data.data);
      setShowLowStock(true);
    } catch (err) {
      showToast('error', 'Failed to load low stock items');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 3000);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      product_name: item.product_name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      store_id: item.store_id,
    });
    setEditingId(item.product_id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await inventoryAPI.update(editingId, form);
        showToast('success', 'Product updated successfully');
      } else {
        await inventoryAPI.create(form);
        showToast('success', 'Product added successfully');
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await inventoryAPI.delete(id);
      showToast('success', 'Product deleted successfully');
      fetchInventory();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFilterChange = (storeId) => {
    setFilterStore(storeId);
    setShowLowStock(false);
    fetchByStore(storeId);
  };

  const clearFilters = () => {
    setFilterStore('');
    setShowLowStock(false);
    fetchInventory();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory</h1>
          <p className="text-dark-500 mt-1">{inventory.length} products {showLowStock ? '(low stock)' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchLowStock} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all">
            <AlertTriangle className="w-4 h-4" /> Low Stock
          </button>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2" id="btn-add-product">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-dark-500" />
        <select className="select-dark max-w-xs" value={filterStore} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="">All Stores</option>
          {stores.map((s) => (
            <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
          ))}
        </select>
        {(filterStore || showLowStock) && (
          <button onClick={clearFilters} className="btn-secondary text-xs">Clear Filters</button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Store</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-12 text-dark-500">No products found.</td></tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.product_id}>
                    <td className="text-white font-mono">#{item.product_id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary-400" />
                        <span className="text-white font-medium">{item.product_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-white/[0.04] rounded-lg text-xs">{item.category}</span>
                    </td>
                    <td>{item.store_name}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.quantity < 5 ? 'bg-red-500/15 text-red-400' :
                        item.quantity < 10 ? 'bg-amber-500/15 text-amber-400' :
                        'bg-green-500/15 text-green-400'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td>₹{Number(item.price).toLocaleString()}</td>
                    <td className="text-white">₹{(item.quantity * item.price).toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.product_id)} className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
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

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Product Name</label>
            <input type="text" className="input-dark" placeholder="e.g. Basmati Rice 5kg" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Category</label>
              <input type="text" className="input-dark" placeholder="e.g. Groceries" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Store</label>
              <select className="select-dark" value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value })} required>
                <option value="">Select Store</option>
                {stores.map((s) => (
                  <option key={s.store_id} value={s.store_id}>{s.store_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Quantity</label>
              <input type="number" className="input-dark" placeholder="e.g. 100" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Price (₹)</label>
              <input type="number" step="0.01" className="input-dark" placeholder="e.g. 450.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update Product' : 'Add Product'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
