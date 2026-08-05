import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Users, ShoppingBag, LayoutDashboard } from 'lucide-react';

const DashboardSummary = () => {
  const [summary, setSummary] = useState({ usersCount: 0, productsCount: 0, ordersCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/admin/dashboard-summary');
      setSummary(res.data);
    } catch (e) {
      console.error('Error fetching dashboard summary:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: '0 0 4px' }}>
          Dashboard
        </h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Overview of your store's performance.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading data...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>


          <div style={cardStyle}>
            <div style={iconBox('#fce7f3', '#db2777')}>
              <ShoppingBag size={28} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Products</p>
              <h3 style={{ margin: '6px 0 0', fontSize: '32px', fontWeight: '800', color: '#111827' }}>
                {summary.productsCount}
              </h3>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconBox('#dcfce7', '#16a34a')}>
              <LayoutDashboard size={28} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</p>
              <h3 style={{ margin: '6px 0 0', fontSize: '32px', fontWeight: '800', color: '#111827' }}>
                {summary.ordersCount}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const cardStyle  = { backgroundColor: 'white', padding: '28px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0' };
const iconBox    = (bg, color) => ({ backgroundColor: bg, color, padding: '18px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export default DashboardSummary;
