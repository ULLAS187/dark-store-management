/**
 * Stores Page
 * Full CRUD interface for dark store management with search functionality.
 */

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Store as StoreIcon } from 'lucide-react';
import { storeAPI, zoneAPI } from '../../services/api';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import Loader from '../common/Loader';

const emptyForm = {
  store_name: '', address: '', zone_id: '', manager_name: '',
  contact_number: '', capacity: '', status: 'Active'
};

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchStores();
    fetchZones();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await storeAPI.getAll();
      setStores(res.data.data);
    } catch (err) {
      showToast('error', 'Failed to load stores');
    } finally {
      setLoading(false);
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchStores();
      return;
    }
    try {
      setLoading(true);
      const res = await storeAPI.search(searchQuery);
      setStores(res.data.data);
    } catch (err) {
      showToast('error', 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (store) => {
    setForm({
      store_name: store.store_name,
      address: store.address,
      zone_id: store.zone_id,
      manager_name: store.manager_name,
      contact_number: store.contact_number,
      capacity: store.capacity,
      status: store.status,
    });
    setEditingId(store.store_id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await storeAPI.update(editingId, form);
        showToast('success', 'Store updated successfully');
      } else {
        await storeAPI.create(form);
        showToast('success', 'Store created successfully');
      }
      setShowModal(false);
      fetchStores();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this store? All related inventory, employees, and orders will be removed.')) return;
    try {
      await storeAPI.delete(id);
      showToast('success', 'Store deleted successfully');
      fetchStores();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dark Stores</h1>
          <p className="text-dark-500 mt-1">{stores.length} stores registered</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2" id="btn-add-store">
          <Plus className="w-4 h-4" /> Add Store
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            className="input-dark pl-11"
            placeholder="Search stores by name, address, manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            id="search-stores"
          />
        </div>
        <button onClick={handleSearch} className="btn-secondary">Search</button>
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); fetchStores(); }} className="btn-secondary text-xs">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Store Name</th>
                <th>Zone</th>
                <th>City</th>
                <th>Manager</th>
                <th>Contact</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-12 text-dark-500">No stores found.</td></tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.store_id}>
                    <td className="text-white font-mono">#{store.store_id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <StoreIcon className="w-4 h-4 text-primary-400" />
                        <span className="text-white font-medium">{store.store_name}</span>
                      </div>
                    </td>
                    <td>{store.zone_name}</td>
                    <td>{store.city}</td>
                    <td>{store.manager_name}</td>
                    <td className="font-mono text-xs">{store.contact_number}</td>
                    <td>{store.capacity}</td>
                    <td>
                      <span className={store.status === 'Active' ? 'badge-active' : 'badge-inactive'}>
                        {store.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(store)} className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(store.store_id)} className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Store' : 'Add New Store'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Store Name</label>
            <input type="text" className="input-dark" placeholder="e.g. DarkMart North" value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Address</label>
            <input type="text" className="input-dark" placeholder="Full address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
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
              <label className="block text-sm font-medium text-dark-400 mb-2">Capacity</label>
              <input type="number" className="input-dark" placeholder="e.g. 500" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Manager Name</label>
              <input type="text" className="input-dark" placeholder="Manager name" value={form.manager_name} onChange={(e) => setForm({ ...form, manager_name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Contact Number</label>
              <input type="text" className="input-dark" placeholder="10-digit number" value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Status</label>
            <select className="select-dark" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update Store' : 'Create Store'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
