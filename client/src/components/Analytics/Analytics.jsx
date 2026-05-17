/**
 * Analytics Page
 * Comprehensive charts and analytics dashboard.
 * Demonstrates advanced SQL queries via API endpoints.
 */

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import { TrendingUp, MapPin, Users, Store, Package } from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import Loader from '../common/Loader';

const COLORS = ['#5c7cfa', '#cc5de8', '#51cf66', '#ffd43b', '#ff922b', '#22b8cf', '#ff6b6b', '#845ef7', '#20c997'];

export default function Analytics() {
  const [ordersPerZone, setOrdersPerZone] = useState([]);
  const [revenueByStore, setRevenueByStore] = useState([]);
  const [ordersByCity, setOrdersByCity] = useState([]);
  const [employeesPerStore, setEmployeesPerStore] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [orderStatusDist, setOrderStatusDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [zone, store, city, emp, inv, status] = await Promise.all([
        analyticsAPI.getOrdersPerZone(),
        analyticsAPI.getRevenueByStore(),
        analyticsAPI.getOrdersByCity(),
        analyticsAPI.getEmployeesPerStore(),
        analyticsAPI.getInventorySummary(),
        analyticsAPI.getOrderStatusDistribution(),
      ]);

      setOrdersPerZone(zone.data.data);
      setRevenueByStore(store.data.data);
      setOrdersByCity(city.data.data);
      setEmployeesPerStore(emp.data.data);
      setInventorySummary(inv.data.data);
      setOrderStatusDist(status.data.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-900 border border-white/10 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-medium mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs text-dark-400">
              {p.name}: <span className="text-white font-medium">
                {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue')
                  ? `₹${p.value.toLocaleString()}`
                  : typeof p.value === 'number' && p.name.toLowerCase().includes('salary')
                  ? `₹${p.value.toLocaleString()}`
                  : p.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-dark-500 mt-1">Detailed performance metrics and reports</p>
      </div>

      {/* Row 1: Orders per Zone + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Total Orders per Zone</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersPerZone}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="zone_name" tick={{ fill: '#868e96', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_orders" name="Orders" radius={[6, 6, 0, 0]}>
                {ordersPerZone.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusDist}
                dataKey="count"
                nameKey="delivery_status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={55}
                strokeWidth={0}
                label={({ delivery_status, count }) => `${delivery_status}: ${count}`}
              >
                {orderStatusDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Revenue by Store */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Revenue by Store (Highest Revenue Analysis)</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={revenueByStore.filter(s => Number(s.total_revenue) > 0)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis type="number" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
            <YAxis dataKey="store_name" type="category" width={180} tick={{ fill: '#868e96', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total_revenue" name="Revenue" radius={[0, 6, 6, 0]}>
              {revenueByStore.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3: Orders by City + Employees per Store */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Orders by City</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ordersByCity}>
              <defs>
                <linearGradient id="cityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cc5de8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#cc5de8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="city" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="total_orders" name="Total Orders" stroke="#cc5de8" fill="url(#cityGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="delivered_orders" name="Delivered" stroke="#51cf66" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Employees per Store</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeesPerStore.filter(s => s.total_employees > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="store_name" tick={{ fill: '#868e96', fontSize: 9 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_employees" name="Employees" fill="#22b8cf" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Inventory Summary */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Inventory Value & Stock Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>Store</th>
                <th>Products</th>
                <th>Total Stock</th>
                <th>Inventory Value</th>
                <th>Low Stock Items</th>
              </tr>
            </thead>
            <tbody>
              {inventorySummary.map((item, i) => (
                <tr key={i}>
                  <td className="text-white font-medium">{item.store_name}</td>
                  <td>{item.total_products}</td>
                  <td>{Number(item.total_stock).toLocaleString()}</td>
                  <td className="text-green-400 font-medium">₹{Number(item.inventory_value).toLocaleString()}</td>
                  <td>
                    {Number(item.low_stock_count) > 0 ? (
                      <span className="bg-red-500/15 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                        {item.low_stock_count} items
                      </span>
                    ) : (
                      <span className="bg-green-500/15 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        All stocked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
