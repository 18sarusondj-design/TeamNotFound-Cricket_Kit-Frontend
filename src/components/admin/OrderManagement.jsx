import React, { useState, useEffect } from 'react';
import { X, Package, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api';

const DELIVERY_FLOW = ['PENDING', 'PACKING', 'OUT_FOR_DELIVERY', 'COMPLETED'];

const getNextStatus = (current) => {
  const idx = DELIVERY_FLOW.indexOf(current || 'PENDING');
  return idx < DELIVERY_FLOW.length - 1 ? DELIVERY_FLOW[idx + 1] : null;
};

const getButtonLabel = (current) => {
  if (!current || current === 'PENDING') return 'Confirm Order';
  if (current === 'PACKING') return 'Mark Out for Delivery';
  if (current === 'OUT_FOR_DELIVERY') return 'Mark Completed';
  return null;
};

const statusColors = {
  PENDING:          { bg: '#fef9c3', color: '#854d0e' },
  PACKING:          { bg: '#dbeafe', color: '#1d4ed8' },
  OUT_FOR_DELIVERY: { bg: '#ede9fe', color: '#6d28d9' },
  COMPLETED:        { bg: '#dcfce7', color: '#166534' },
};

const StatusBadge = ({ status }) => {
  const s = status || 'PENDING';
  const c = statusColors[s] || statusColors.PENDING;
  return (
    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: c.bg, color: c.color }}>
      {s.replace(/_/g, ' ')}
    </span>
  );
};

/* ─── Detail Modal ─────────────────────────────────────────────── */
const OrderDetailModal = ({ order, onClose }) => (
  <div style={overlay} onClick={onClose}>
    <div style={modal} onClick={e => e.stopPropagation()}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'20px' }}>
        <div>
          <h3 style={{ margin:'0 0 4px', fontSize:'18px', fontWeight:'700', color:'#0f172a' }}>Order Details</h3>
          <p style={{ margin:0, fontSize:'13px', color:'#64748b' }}>ID: {order.orderId}</p>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', padding:'4px' }}>
          <X size={22} />
        </button>
      </div>

      {/* Customer Info */}
      <div style={{ backgroundColor:'#f8fafc', borderRadius:'10px', padding:'14px 16px', marginBottom:'18px' }}>
        <p style={{ margin:'0 0 3px', fontWeight:'600', color:'#0f172a' }}>{order.user?.fullName}</p>
        <p style={{ margin:0, fontSize:'13px', color:'#64748b' }}>{order.user?.email}</p>
        <p style={{ margin:'6px 0 0', fontSize:'13px', color:'#64748b' }}>
          📅 {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Items */}
      <p style={{ margin:'0 0 10px', fontSize:'13px', fontWeight:'600', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' }}>Items Ordered</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'12px', maxHeight:'300px', overflowY:'auto', marginBottom:'18px' }}>
        {order.items?.map(item => (
          <div key={item.id} style={{ display:'flex', gap:'12px', alignItems:'center', padding:'10px', border:'1px solid #e2e8f0', borderRadius:'8px' }}>
            {item.product?.images?.[0]?.imageUrl
              ? <img src={item.product.images[0].imageUrl} alt="" style={{ width:'48px', height:'48px', borderRadius:'6px', objectFit:'cover' }} />
              : <div style={{ width:'48px', height:'48px', borderRadius:'6px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center' }}><ShoppingBag size={18} color="#94a3b8" /></div>
            }
            <div style={{ flex:1 }}>
              <p style={{ margin:'0 0 2px', fontWeight:'600', fontSize:'14px', color:'#0f172a' }}>{item.product?.name}</p>
              <p style={{ margin:0, fontSize:'13px', color:'#64748b' }}>Qty: {item.quantity} × ₹{item.pricePerUnit}</p>
            </div>
            <p style={{ margin:0, fontWeight:'700', fontSize:'14px', color:'#0f172a' }}>₹{item.totalPrice}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', backgroundColor:'#0f172a', borderRadius:'10px' }}>
        <span style={{ color:'white', fontWeight:'600' }}>Total Amount</span>
        <span style={{ color:'white', fontWeight:'800', fontSize:'18px' }}>₹{order.totalAmount}</span>
      </div>
    </div>
  </div>
);

/* ─── Main Component ───────────────────────────────────────────── */
const OrderManagement = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try { const res = await api.get('/admin/orders'); setOrders(res.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAdvanceStatus = (order) => {
    const next = getNextStatus(order.deliveryStatus);
    if (!next) return;
    const label = getButtonLabel(order.deliveryStatus);
    const messages = {
      PACKING:          '✅ Order confirmed! Packing started.',
      OUT_FOR_DELIVERY: '🚚 Order is out for delivery!',
      COMPLETED:        '🎉 Order marked as Completed!',
    };

    toast.custom((toastId) => (
      <div style={{ background:'#0f172a', borderRadius:'10px', padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.2)', display:'flex', alignItems:'center', gap:'12px', fontFamily:"'Inter','Segoe UI',sans-serif", whiteSpace:'nowrap' }}>
        <span style={{ fontSize:'13px', color:'#e2e8f0', fontWeight:'500' }}>
          {label} — <strong style={{ color:'white' }}>{order.user?.fullName}</strong>?
        </span>
        <button
          onClick={() => toast.dismiss(toastId)}
          style={{ padding:'5px 12px', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'6px', background:'transparent', color:'#f87171', fontWeight:'700', fontSize:'12px', cursor:'pointer' }}
        >✕ Reject</button>
        <button
          onClick={async () => {
            toast.dismiss(toastId);
            try {
              await api.put(`/admin/orders/${order.orderId}/status`, { deliveryStatus: next });
              toast.success(messages[next] || 'Status updated!');
              fetchOrders();
            } catch { toast.error('Failed to update status.'); }
          }}
          style={{ padding:'5px 12px', border:'none', borderRadius:'6px', background:'linear-gradient(135deg,#0ea5e9,#6366f1)', color:'white', fontWeight:'700', fontSize:'12px', cursor:'pointer' }}
        >✓ Confirm</button>
      </div>
    ), { duration: Infinity });
  };

  // Only show SUCCESS payment orders in the action flow; show all orders
  const successOrders = orders.filter(o => o.status === 'SUCCESS');

  return (
    <div>
      <h2 style={{ fontSize:'24px', fontWeight:'800', marginBottom:'6px', color:'#0f172a' }}>Order Management</h2>
      <p style={{ color:'#64748b', marginBottom:'24px', marginTop:0 }}>{successOrders.length} paid order(s) to process</p>

      {loading ? <p>Loading orders...</p> : (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {successOrders.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px', color:'#94a3b8' }}>
              <Package size={48} style={{ margin:'0 auto 12px' }} />
              <p>No paid orders yet.</p>
            </div>
          )}

          {successOrders.map(order => {
            const nextStatus = getNextStatus(order.deliveryStatus);
            const btnLabel   = getButtonLabel(order.deliveryStatus);
            const isCompleted = order.deliveryStatus === 'COMPLETED';

            return (
              <div key={order.orderId} style={cardStyle}>
                {/* Left: Customer */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin:'0 0 2px', fontWeight:'700', fontSize:'16px', color:'#0f172a' }}>
                    {order.user?.fullName}
                  </p>
                  <p style={{ margin:'0 0 2px', fontSize:'13px', color:'#0284c7' }}>
                    {order.user?.email}
                  </p>
                  <p style={{ margin:0, fontSize:'13px', color:'#64748b' }}>
                    {new Date(order.createdAt).toLocaleDateString()} &nbsp;·&nbsp; ₹{order.totalAmount}
                  </p>
                </div>

                {/* Middle: Delivery Status */}
                <StatusBadge status={order.deliveryStatus} />

                {/* Right: Buttons */}
                <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={viewBtn}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#0284c7'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  >
                    View Details
                  </button>

                  {!isCompleted && btnLabel && (
                    <button
                      onClick={() => handleAdvanceStatus(order)}
                      style={confirmBtn}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {btnLabel}
                    </button>
                  )}

                  {isCompleted && (
                    <span style={{ display:'flex', alignItems:'center', gap:'6px', color:'#16a34a', fontWeight:'600', fontSize:'13px' }}>
                      <CheckCircle size={16} /> Delivered
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '18px 22px',
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const viewBtn = {
  padding: '8px 16px',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  background: 'white',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  color: '#334155',
  transition: 'border-color 0.15s',
  whiteSpace: 'nowrap',
};

const confirmBtn = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
  color: 'white',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '600',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.15s',
};

const overlay = {
  position: 'fixed', inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 500, backdropFilter: 'blur(4px)',
};

const modal = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '28px',
  width: '520px',
  maxWidth: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
};

export default OrderManagement;
