/**
 * Employees Page
 * Full CRUD for employee management with store-wise filtering.
 */

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, Filter } from 'lucide-react';
import { employeeAPI, storeAPI } from '../../services/api';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import Loader from '../common/Loader';

const emptyForm = { name: '', role: '', salary: '', phone_number: '', store_id: '' };
const roles = ['Store Manager', 'Warehouse Associate', 'Delivery Executive', 'Inventory Clerk', 'Packing Associate'];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterStore, setFilterStore] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchEmployees();
    fetchStores();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      setEmployees(res.data.data);
    } catch (err) {
      showToast('error', 'Failed to load employees');
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
        const res = await employeeAPI.getByStore(storeId);
        setEmployees(res.data.data);
      } else {
        await fetchEmployees();
      }
    } catch (err) {
      showToast('error', 'Failed to filter employees');
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

  const openEdit = (emp) => {
    setForm({
      name: emp.name,
      role: emp.role,
      salary: emp.salary,
      phone_number: emp.phone_number,
      store_id: emp.store_id,
    });
    setEditingId(emp.employee_id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await employeeAPI.update(editingId, form);
        showToast('success', 'Employee updated successfully');
      } else {
        await employeeAPI.create(form);
        showToast('success', 'Employee added successfully');
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await employeeAPI.delete(id);
      showToast('success', 'Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFilterChange = (storeId) => {
    setFilterStore(storeId);
    fetchByStore(storeId);
  };

  if (loading) return <Loader />;

  // Role color mapping
  const getRoleColor = (role) => {
    const colors = {
      'Store Manager': 'bg-purple-500/15 text-purple-400',
      'Warehouse Associate': 'bg-blue-500/15 text-blue-400',
      'Delivery Executive': 'bg-green-500/15 text-green-400',
      'Inventory Clerk': 'bg-cyan-500/15 text-cyan-400',
      'Packing Associate': 'bg-amber-500/15 text-amber-400',
    };
    return colors[role] || 'bg-white/[0.06] text-dark-300';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Employees</h1>
          <p className="text-dark-500 mt-1">{employees.length} employees registered</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2" id="btn-add-employee">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
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
        {filterStore && (
          <button onClick={() => handleFilterChange('')} className="btn-secondary text-xs">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Store</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-dark-500">No employees found.</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td className="text-white font-mono">#{emp.employee_id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(emp.role)}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td>{emp.store_name}</td>
                    <td className="font-mono text-xs">{emp.phone_number}</td>
                    <td className="text-white">₹{Number(emp.salary).toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(emp)} className="p-2 text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(emp.employee_id)} className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Employee' : 'Add New Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-400 mb-2">Full Name</label>
            <input type="text" className="input-dark" placeholder="Employee name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Role</label>
              <select className="select-dark" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
                <option value="">Select Role</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
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
              <label className="block text-sm font-medium text-dark-400 mb-2">Salary (₹)</label>
              <input type="number" className="input-dark" placeholder="e.g. 25000" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-400 mb-2">Phone Number</label>
              <input type="text" className="input-dark" placeholder="10-digit number" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update Employee' : 'Add Employee'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
