import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useProducts } from '../lib/useProducts';
import type { Product } from '../lib/products';
import ProductEditor from '../components/admin/ProductEditor';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  status: string;
  total_zar: number;
  items: Array<{ name: string; quantity: number; size?: string; price: number }>;
  created_at: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const { products, loading: productsLoading } = useProducts();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => { setLocalProducts(products); }, [products]);

  // Check admin status
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('is_admin').eq('id', user.id).single()
      .then(({ data }) => setIsAdmin(!!data?.is_admin));
  }, [user]);

  // Load orders when on orders tab
  useEffect(() => {
    if (tab !== 'orders') return;
    setOrdersLoading(true);
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders((data ?? []) as Order[]); setOrdersLoading(false); });
  }, [tab]);

  if (authLoading || isAdmin === null) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: '"Cormorant SC",serif', letterSpacing: '0.2em', color: '#e5b876' }}>Loading…</p>
    </div>
  );

  if (!user || isAdmin === false) return <Navigate to="/" replace />;

  const onSaved = (updated: Product) => {
    setLocalProducts(ps => ps.map(p => p.id === updated.id ? updated : p));
    setEditProduct(null);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: '"Cormorant SC",serif', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
    color: active ? '#000' : '#e5b876', background: active ? '#e5b876' : 'transparent',
    border: '1px solid rgba(229,184,118,0.4)', padding: '0.5rem 1.5rem', cursor: 'pointer', transition: 'all 0.3s ease',
  });

  const statusColor = (s: string) => ({ paid: '#4caf82', pending: '#e5b876', fulfilled: '#9b9b9b', cancelled: '#ff6b6b' }[s] ?? '#fff');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: 130 }}>
      {editProduct && <ProductEditor product={editProduct} onSaved={onSaved} onClose={() => setEditProduct(null)} />}

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(229,184,118,0.12)', padding: '2rem 2rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.3em', color: '#e5b876', marginBottom: '0.5rem' }}>Hidden Ivory</p>
          <h1 style={{ fontFamily: '"Cormorant SC",serif', fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: '#ffffff', marginBottom: '1.5rem' }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={tabStyle(tab === 'products')} onClick={() => setTab('products')}>Products</button>
            <button style={tabStyle(tab === 'orders')} onClick={() => setTab('orders')}>Orders</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* -- Products Tab -- */}
        {tab === 'products' && (
          productsLoading ? (
            <p style={{ fontFamily: '"Cormorant SC",serif', letterSpacing: '0.2em', color: '#e5b876' }}>Loading products…</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem' }}>
              {localProducts.map(p => (
                <div key={p.id} onClick={() => setEditProduct(p)}
                  style={{ background: '#111', border: '1px solid rgba(229,184,118,0.12)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.3s ease, transform 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5b876'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,184,118,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#1a1a1a' }}>
                    {p.images[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.1em', color: '#ffffff', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#e5b876', fontWeight: 700 }}>R{p.price.toFixed(2)}</p>
                    <span style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: p.inStock ? '#4caf82' : '#ff6b6b', textTransform: 'uppercase' }}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* -- Orders Tab -- */}
        {tab === 'orders' && (
          ordersLoading ? (
            <p style={{ fontFamily: '"Cormorant SC",serif', letterSpacing: '0.2em', color: '#e5b876' }}>Loading orders…</p>
          ) : orders.length === 0 ? (
            <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: '#111', border: '1px solid rgba(229,184,118,0.12)', borderRadius: 8, overflow: 'hidden' }}>
                  {/* Order row */}
                  <div onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                    style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#e5b876' }}>{o.order_number}</p>
                      <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#ffffff' }}>{o.customer_name} — {o.customer_email}</p>
                      <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{new Date(o.created_at).toLocaleDateString('en-ZA')}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>R{o.total_zar.toFixed(2)}</p>
                      <select value={o.status} onChange={e => { e.stopPropagation(); updateOrderStatus(o.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: '#1a1a1a', border: '1px solid rgba(229,184,118,0.2)', color: statusColor(o.status), padding: '0.3rem 0.6rem', cursor: 'pointer', borderRadius: 4 }}>
                        {['pending','paid','fulfilled','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedOrder === o.id && (
                    <div style={{ borderTop: '1px solid rgba(229,184,118,0.1)', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem', background: '#0d0d0d' }}>
                      <div>
                        <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#e5b876', marginBottom: '0.4rem' }}>Contact</p>
                        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#fff' }}>{o.customer_phone}</p>
                        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#fff' }}>{o.customer_email}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#e5b876', marginBottom: '0.4rem' }}>Delivery Address</p>
                        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#fff', whiteSpace: 'pre-line' }}>{o.delivery_address}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#e5b876', marginBottom: '0.4rem' }}>Items</p>
                        {Array.isArray(o.items) && o.items.map((item, i) => (
                          <p key={i} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#fff' }}>
                            {item.quantity}× {item.name}{item.size ? ' (' + item.size + ')' : ''} — R{item.price}
                          </p>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <a href="https://dashboard.yoco.com" target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', background: '#e5b876', padding: '0.5rem 1rem', textDecoration: 'none', borderRadius: 4, display: 'inline-block' }}>
                          Yoco Dashboard ?
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
