import React, { useState, useEffect } from 'react';
import api from '../../api';
import { IndianRupee, ShoppingBag, CalendarRange, TrendingUp } from 'lucide-react';

const FILTERS = [
  { key: 'daily',    label: 'Today' },
  { key: 'custom',   label: '📅 Custom Range' },
];

const RevenueAnalytics = () => {
  const [analytics, setAnalytics]     = useState({ totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading]         = useState(true);
  const [filterType, setFilterType]   = useState('daily');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const [appliedRange, setAppliedRange] = useState('');

  useEffect(() => {
    if (filterType !== 'custom') fetchAnalytics();
  }, [filterType]);

  const buildUrl = (type, start, end) => {
    if (type === 'overall') return '/admin/analytics';
    const now = new Date();
    let s = new Date();
    if (type === 'daily')   { s.setHours(0,0,0,0); }
    if (type === '2-days')  { s.setDate(s.getDate() - 2); }
    if (type === 'monthly') { s.setMonth(s.getMonth() - 1); }
    if (type === 'yearly')  { s.setFullYear(s.getFullYear() - 1); }
    if (type === 'custom')  {
      return `/admin/analytics?startDate=${new Date(start).toISOString()}&endDate=${new Date(end).toISOString()}`;
    }
    return `/admin/analytics?startDate=${s.toISOString()}&endDate=${now.toISOString()}`;
  };

  const fetchAnalytics = async (type = filterType, start = customDates.start, end = customDates.end) => {
    setLoading(true);
    try {
      const url = buildUrl(type, start, end);
      const res = await api.get(url);
      setAnalytics(res.data);
    } catch (e) {
      console.error('Error fetching analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    setAppliedRange(`${fmt(customDates.start)} → ${fmt(customDates.end)}`);
    fetchAnalytics('custom', customDates.start, customDates.end);
  };

  const label = FILTERS.find(f => f.key === filterType)?.label || '';

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
          Business Analytics
        </h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          {filterType === 'custom' && appliedRange ? `Showing: ${appliedRange}` : `Showing: ${label} Revenue`}
        </p>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setFilterType(key); setAppliedRange(''); }}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: filterType === key ? 'none' : '1px solid #e2e8f0',
              background: filterType === key ? 'linear-gradient(135deg,#0ea5e9,#6366f1)' : 'white',
              color: filterType === key ? 'white' : '#475569',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              boxShadow: filterType === key ? '0 4px 12px rgba(14,165,233,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Custom Date Range Picker */}
      {filterType === 'custom' && (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', marginBottom: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <CalendarRange size={18} color="#0284c7" />
            <span style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>Set Date Range</span>
          </div>
          <form onSubmit={handleCustomSubmit}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '180px' }}>
                <label style={labelStyle}>From Date</label>
                <input
                  type="date"
                  style={dateInput}
                  value={customDates.start}
                  onChange={e => setCustomDates({ ...customDates, start: e.target.value })}
                  required
                  onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '180px' }}>
                <label style={labelStyle}>To Date</label>
                <input
                  type="date"
                  style={dateInput}
                  value={customDates.end}
                  min={customDates.start}
                  onChange={e => setCustomDates({ ...customDates, end: e.target.value })}
                  required
                  onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                  onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              <button
                type="submit"
                style={applyBtn}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <TrendingUp size={16} /> Show Revenue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading data...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>

          <div style={cardStyle}>
            <div style={iconBox('#dbeafe', '#2563eb')}>
              <IndianRupee size={28} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue</p>
              <h3 style={{ margin: '6px 0 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>
                ₹{Number(analytics.totalRevenue).toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={iconBox('#dcfce7', '#16a34a')}>
              <ShoppingBag size={28} />
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Successful Orders</p>
              <h3 style={{ margin: '6px 0 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>
                {analytics.totalOrders}
              </h3>
            </div>
          </div>

          {analytics.totalOrders > 0 && (
            <div style={cardStyle}>
              <div style={iconBox('#fef3c7', '#d97706')}>
                <TrendingUp size={28} />
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg. Order Value</p>
                <h3 style={{ margin: '6px 0 0', fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>
                  ₹{Math.round(analytics.totalRevenue / analytics.totalOrders).toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#475569' };
const dateInput  = { padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };
const applyBtn   = { display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s', whiteSpace: 'nowrap' };
const cardStyle  = { backgroundColor: 'white', padding: '28px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9' };
const iconBox    = (bg, color) => ({ backgroundColor: bg, color, padding: '18px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });

export default RevenueAnalytics;
