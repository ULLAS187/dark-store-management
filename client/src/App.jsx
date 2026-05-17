/**
 * App Component
 * Root component with React Router configuration.
 * Defines all routes and wraps them with the Layout.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Stores from './components/Stores/Stores';
import Zones from './components/Zones/Zones';
import Inventory from './components/Inventory/Inventory';
import Employees from './components/Employees/Employees';
import Orders from './components/Orders/Orders';
import Analytics from './components/Analytics/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="stores" element={<Stores />} />
          <Route path="zones" element={<Zones />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="employees" element={<Employees />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
