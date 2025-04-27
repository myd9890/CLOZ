import { Link, Routes, Route } from 'react-router-dom';

function MainDashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{ 
        width: '250px', 
        backgroundColor: '#1a1a1a', 
        color: 'white',
        padding: '20px'
      }}>
        <h2>Dashboards</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/InventoryDashboard" style={linkStyle}>Inventory</Link></li>
          <li><Link to="/FinanceDashboard" style={linkStyle}>Finance</Link></li>
          <li><Link to="/SalesDashboard" style={linkStyle}>Sales</Link></li>
          <li><Link to="/CustomerDashboard" style={linkStyle}>Customer</Link></li>
          <li><Link to="/HRdashboard" style={linkStyle}>HR</Link></li>
        </ul>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/InventoryDashboard/*" element={<InventoryDashboard />} />
          <Route path="/FinanceDashboard/*" element={<FinanceDashboard />} />
          <Route path="/SalesDashboard/*" element={<SalesDashboard />} />
          <Route path="/CustomerDashboard/*" element={<CustomerDashboard />} />
          <Route path="/HRdashboard/*" element={<HRDashboard user={{ name: "" }} />} />
        </Routes>
      </div>
    </div>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  display: 'block',
  margin: '10px 0',
  padding: '8px 12px',
  borderRadius: '5px',
  backgroundColor: '#333',
};

export default MainDashboardLayout;
