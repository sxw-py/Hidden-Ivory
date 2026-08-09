import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useProducts } from '../lib/useProducts';
import type { Product } from '../lib/products';
import ProductEditor from '../components/admin/ProductEditor';
import ImageUploader from '../components/admin/ImageUploader';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_id_number: string;
  shipping_address: string;
  status: string;
  total_amount: number;
  items: Array<{ product_id: string; quantity: number; size?: string }>;
  created_at: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'products' | 'orders' | 'settings'>('products');
  const { products, loading: productsLoading } = useProducts();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderToClear, setOrderToClear] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [selectedFeatured, setSelectedFeatured] = useState<string[]>([]);
  const [savingFeatured, setSavingFeatured] = useState(false);

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

  // Load featured products when entering settings tab
  useEffect(() => {
    if (tab === 'settings') {
      setSelectedFeatured(localProducts.filter(p => p.isFeatured).map(p => p.id));
    }
  }, [tab, localProducts]);

  if (authLoading || isAdmin === null) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: '"Cormorant SC",serif', letterSpacing: '0.2em', color: '#e5b876' }}>Loading…</p>
    </div>
  );

  if (!user || isAdmin === false) return <Navigate to="/" replace />;

  const onSaved = (updated: Product) => {
    setLocalProducts(ps => {
      const exists = ps.find(p => p.id === updated.id);
      if (exists) return ps.map(p => p.id === updated.id ? updated : p);
      return [updated, ...ps];
    });
    setEditProduct(null);
  };

  const handleAddProduct = () => {
    setEditProduct({
      id: crypto.randomUUID(),
      name: '',
      price: 0,
      description: '',
      category: 'tops',
      details: [],
      inStock: true,
      images: []
    } as Product);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    if (status === 'fulfilled') {
      setOrderToClear(id);
      return;
    }

    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      alert("Failed to update order status. Please ensure you have the correct database permissions.");
      console.error(error);
      return;
    }
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
  };

  const confirmClearOrder = async () => {
    if (!orderToClear) return;
    const { error } = await supabase.from('orders').delete().eq('id', orderToClear);
    if (error) {
      alert("Failed to delete order. Please ensure you have the correct database permissions.");
      console.error(error);
    } else {
      setOrders(os => os.filter(o => o.id !== orderToClear));
    }
    setOrderToClear(null);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    await supabase.from('products').delete().eq('id', productToDelete);
    setLocalProducts(ps => ps.filter(p => p.id !== productToDelete));
    setProductToDelete(null);
  };

  const handleSaveFeatured = async () => {
    if (selectedFeatured.length !== 4) {
      alert("Please select exactly 4 products.");
      return;
    }
    setSavingFeatured(true);
    for (const p of localProducts) {
      const isFeat = selectedFeatured.includes(p.id);
      if (p.isFeatured !== isFeat) {
        await supabase.from('products').update({ is_featured: isFeat }).eq('id', p.id);
      }
    }
    setLocalProducts(prev => prev.map(p => ({ ...p, isFeatured: selectedFeatured.includes(p.id) })));
    alert("Featured products updated successfully!");
    setSavingFeatured(false);
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
            <button style={tabStyle(tab === 'settings')} onClick={() => setTab('settings')}>Settings</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* -- Products Tab -- */}
        {tab === 'products' && (
          productsLoading ? (
            <p style={{ fontFamily: '"Cormorant SC",serif', letterSpacing: '0.2em', color: '#e5b876' }}>Loading products…</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button onClick={handleAddProduct}
                  style={{ background: '#e5b876', color: '#000000', border: 'none', fontFamily: '"Cormorant SC",serif', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.6rem 1.25rem', cursor: 'pointer', borderRadius: 4, fontWeight: 'bold' }}>
                  + New Product
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem' }}>
              {localProducts.map(p => (
                <div key={p.id} onClick={() => setEditProduct(p)}
                  style={{ background: '#111', border: '1px solid rgba(229,184,118,0.12)', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.3s ease, transform 0.2s ease', position: 'relative' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5b876'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(229,184,118,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setProductToDelete(p.id); }}
                    style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,107,107,0.5)', color: '#ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ff6b6b'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.6)'; (e.currentTarget as HTMLElement).style.color = '#ff6b6b'; }}
                    title="Delete Product"
                  >
                    ×
                  </button>
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
          </>
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
                      <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#e5b876' }}>ORD-{o.id.substring(0,8).toUpperCase()}</p>
                      <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1rem', color: '#ffffff', fontWeight: 500 }}>{o.customer_name} — {o.customer_email}</p>
                      <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{new Date(o.created_at).toLocaleDateString('en-ZA')}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem', color: '#ffffff', fontWeight: 700 }}>R{Number(o.total_amount || 0).toFixed(2)}</p>
                      <select value={(o.status || '').toLowerCase()} onChange={e => { e.stopPropagation(); updateOrderStatus(o.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: '#1a1a1a', border: '1px solid rgba(229,184,118,0.2)', color: statusColor((o.status || '').toLowerCase()), padding: '0.3rem 0.6rem', cursor: 'pointer', borderRadius: 4 }}>
                        {['pending','paid','fulfilled','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {expandedOrder === o.id && (
                    <div style={{ borderTop: '1px solid rgba(229,184,118,0.1)', padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem', background: '#0d0d0d' }}>
                      <div>
                        <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#e5b876', marginBottom: '0.4rem' }}>Contact</p>
                        <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.05rem', color: '#fff' }}>{o.customer_phone}</p>
                        <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.05rem', color: '#fff' }}>{o.customer_email}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#e5b876', marginBottom: '0.4rem' }}>Delivery Address</p>
                        <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.05rem', color: '#fff', whiteSpace: 'pre-line', lineHeight: '1.5' }}>{o.shipping_address}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#e5b876', marginBottom: '0.4rem' }}>Items</p>
                        {Array.isArray(o.items) && o.items.map((item, i) => {
                          const p = localProducts.find(prod => prod.id === item.product_id);
                          return (
                            <p key={i} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.05rem', color: '#fff', marginBottom: '0.25rem' }}>
                              {item.quantity}× {p ? p.name : 'Unknown Product'}{item.size ? ' (' + item.size + ')' : ''}
                            </p>
                          );
                        })}
                      </div>

                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* -- Settings Tab -- */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: '#111', border: '1px solid rgba(229,184,118,0.12)', borderRadius: 8, padding: '2rem' }}>
              <h2 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.2rem', letterSpacing: '0.15em', color: '#e5b876', textTransform: 'uppercase', marginBottom: '1rem' }}>Featured Products (Homepage)</h2>
              <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', maxWidth: 600 }}>
                Select exactly 4 products to display on the homepage. Currently selected: {selectedFeatured.length}/4
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {localProducts.map(p => {
                  const isSelected = selectedFeatured.includes(p.id);
                  return (
                    <div key={p.id} 
                         onClick={() => {
                           if (isSelected) setSelectedFeatured(prev => prev.filter(id => id !== p.id));
                           else if (selectedFeatured.length < 4) setSelectedFeatured(prev => [...prev, p.id]);
                         }}
                         style={{ background: isSelected ? 'rgba(229,184,118,0.15)' : '#1a1a1a', border: isSelected ? '2px solid #e5b876' : '1px solid rgba(229,184,118,0.2)', borderRadius: 8, padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 4, overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                        {p.images[0] && <img src={p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.85rem', color: '#fff', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: isSelected ? '6px solid #e5b876' : '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleSaveFeatured}
                disabled={selectedFeatured.length !== 4 || savingFeatured}
                style={{ background: selectedFeatured.length === 4 ? '#e5b876' : '#333', color: selectedFeatured.length === 4 ? '#000' : '#888', border: 'none', fontFamily: '"Cormorant SC",serif', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.8rem 1.5rem', cursor: selectedFeatured.length === 4 ? 'pointer' : 'not-allowed', borderRadius: 4, fontWeight: 'bold' }}>
                {savingFeatured ? 'Saving...' : 'Save Featured Products'}
              </button>
            </div>

            <div style={{ background: '#111', border: '1px solid rgba(229,184,118,0.12)', borderRadius: 8, padding: '2rem' }}>
              <h2 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.2rem', letterSpacing: '0.15em', color: '#e5b876', textTransform: 'uppercase', marginBottom: '1rem' }}>Hero Image (Brand Story)</h2>
              <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', maxWidth: 600 }}>
                Upload a new image to replace the signature shirt image on the home page. The site will automatically use the most recently uploaded image.
              </p>
              <div style={{ maxWidth: 300 }}>
                <ImageUploader productId="hero" onUploaded={(url) => alert("Hero image successfully updated! The home page will now show this new image.")} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {orderToClear && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(229,184,118,0.2)', borderRadius: 8, padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 450, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid #ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </div>
            
            <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.8rem', color: '#ff6b6b', marginBottom: '1rem' }}>Clear Order Record?</h3>
            <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', lineHeight: 1.5 }}>
              Are you sure you want to completely remove this order? This action permanently deletes it from your database and cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button onClick={() => setOrderToClear(null)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.8rem', fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                Cancel
              </button>
              <button onClick={confirmClearOrder} style={{ flex: 1, background: '#ff6b6b', border: 'none', color: '#000', padding: '0.8rem', fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s', fontWeight: 'bold' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
                Clear Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Deletion Modal */}
      {productToDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(229,184,118,0.2)', borderRadius: 8, padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 450, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid #ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </div>
            
            <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.8rem', color: '#ff6b6b', marginBottom: '1rem' }}>Delete Product?</h3>
            <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', lineHeight: 1.5 }}>
              Are you sure you want to completely remove this product? This action permanently deletes it from your store and cannot be undone.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button onClick={() => setProductToDelete(null)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.8rem', fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                Cancel
              </button>
              <button onClick={confirmDeleteProduct} style={{ flex: 1, background: '#ff6b6b', border: 'none', color: '#000', padding: '0.8rem', fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s', fontWeight: 'bold' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
