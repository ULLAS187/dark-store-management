/**
 * Dashboard Page
 * Displays overview statistics, charts, and key metrics.
 * Demonstrates analytical queries from the backend.
 */

import { useState, useEffect } from 'react';
import {
  Store, MapPin, Users, ShoppingCart, Package, TrendingUp,
  AlertTriangle, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { analyticsAPI, inventoryAPI } from '../../services/api';
import Loader from '../common/Loader';

// Color palette for charts
const CHART_COLORS = ['#5c7cfa', '#cc5de8', '#51cf66', '#ffd43b', '#ff922b', '#22b8cf', '#ff6b6b'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [ordersPerZone, setOrdersPerZone] = useState([]);
  const [revenueByStore, setRevenueByStore] = useState([]);
  const [orderStatusDist, setOrderStatusDist] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, zoneRes, storeRes, statusRes, lowStockRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getOrdersPerZone(),
        analyticsAPI.getRevenueByStore(),
        analyticsAPI.getOrderStatusDistribution(),
        inventoryAPI.getLowStock(),
      ]);

      setStats(dashRes.data.data);
      setOrdersPerZone(zoneRes.data.data);
      setRevenueByStore(storeRes.data.data);
      setOrderStatusDist(statusRes.data.data);
      setLowStock(lowStockRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // Stat cards data
  const statCards = [
    { label: 'Total Stores', value: stats?.total_stores || 0, icon: Store, color: 'from-blue-500 to-blue-600', change: `${stats?.active_stores || 0} active` },
    { label: 'Delivery Zones', value: stats?.total_zones || 0, icon: MapPin, color: 'from-purple-500 to-purple-600', change: 'Across cities' },
    { label: 'Employees', value: stats?.total_employees || 0, icon: Users, color: 'from-cyan-500 to-cyan-600', change: 'All stores' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'from-green-500 to-green-600', change: `${stats?.pending_orders || 0} pending` },
    { label: 'Total Revenue', value: `₹${Number(stats?.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'from-amber-500 to-orange-500', change: 'All time' },
    { label: 'Products', value: stats?.total_products || 0, icon: Package, color: 'from-pink-500 to-rose-500', change: `${stats?.low_stock_items || 0} low stock` },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-900 border border-white/10 rounded-xl px-4 py-3 shadow-xl">
          <p className="text-white text-sm font-medium mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs text-dark-400">
              {p.name}: <span className="text-white font-medium">
                {p.name.includes('revenue') || p.name.includes('Revenue') ? `₹${Number(p.value).toLocaleString()}` : p.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-dark-500 mt-1">Overview of your dark store operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <div key={i} className="card-stat group animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-dark-500 text-sm font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
                <p className="text-xs text-dark-600 mt-1">{card.change}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders per Zone - Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">Orders by Zone</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersPerZone}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="zone_name" tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_orders" fill="#5c7cfa" radius={[6, 6, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution - Pie Chart */}
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
                {orderStatusDist.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Store - Area Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-6">Revenue by Store</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueByStore.filter(s => s.total_revenue > 0)}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="store_name" tick={{ fill: '#868e96', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
            <YAxis tick={{ fill: '#868e96', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="total_revenue" stroke="#5c7cfa" fill="url(#revenueGradient)" name="Revenue" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock Alerts */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Low Stock Alerts</h3>
          <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-full text-xs font-medium">
            {lowStock.length} items
          </span>
        </div>
        {lowStock.length === 0 ? (
          <div className="flex items-center gap-3 py-8 justify-center text-dark-500">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>All products are well stocked!</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Store</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.slice(0, 10).map((item) => (
                  <tr key={item.product_id}>
                    <td className="text-white font-medium">{item.product_name}</td>
                    <td>{item.category}</td>
                    <td>{item.store_name}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.quantity <= 3
                          ? 'bg-red-500/15 text-red-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {item.quantity} left
                      </span>
                    </td>
                    <td>₹{Number(item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
