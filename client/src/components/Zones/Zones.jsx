/**
 * Zones Page
 * Full CRUD interface for delivery zone management.
 */

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { zoneAPI } from '../../services/api';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import Loader from '../common/Loader';

const emptyForm = { zone_name: '', city: '', pincode: '', delivery_radius: '' };

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => { fetchZones(); }, []);

  const fetchZones = async () => {
    try {
      const res = await zoneAPI.getAll();
      setZones(res.data.data);
    } catch (err) {
      showToast('error', 'Failed to load zones');
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

  const openEdit = (zone) => {
    setForm({
      zone_name: zone.zone_name,
      city: zone.city,
      pincode: zone.pincode,
      delivery_radius: zone.delivery_radius,
    });
    setEditingId(zone.zone_id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await zoneAPI.update(editingId, form);
        showToast('success', 'Zone updated successfully');
      } else {
        await zoneAPI.create(form);
        showToast('success', 'Zone created successfully');
      }
      setShowModal(false);
      fetchZones();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete all related stores, orders, and data.')) return;
    try {
      await zoneAPI.delete(id);
      showToast('success', 'Zone deleted successfully');
      fetchZones();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Delivery Zones</h1>
          <p className="text-dark-500 mt-1">{zones.length} zones registered</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2" id="btn-add-zone">
          <Plus className="w-4 h-4" /> Add Zone
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Zone Name</th>
                <th>City</th>
                <th>Pincode</th>
                <th>Delivery Radius</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-dark-500">No zones found. Add your first zone.</td></tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone.zone_id}>
                    <td className="text-white font-mono">#{zone.zone_id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary-400" />
                        <span className="text-white font-medium">{zone.zone_name}</span>
                      </div>
                    </td>
                    <td>{zone.city}</td>
                    <td className="font-mono">{zone.pincode}</td>
                    <td>{zone.delivery_radius} km</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(zone)} className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(zone.zone_id)} className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Zone' : 'Add New Zone'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Zone Name</label>
            <input type="text" className="input-dark" placeholder="e.g. North Zone" value={form.zone_name} onChange={(e) => setForm({ ...form, zone_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">City</label>
              <input type="text" className="input-dark" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Pincode</label>
              <input type="text" className="input-dark" placeholder="e.g. 400001" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Delivery Radius (km)</label>
            <input type="number" step="0.1" className="input-dark" placeholder="e.g. 5.0" value={form.delivery_radius} onChange={(e) => setForm({ ...form, delivery_radius: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update Zone' : 'Create Zone'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
