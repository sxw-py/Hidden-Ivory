import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../lib/useProducts';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  const getProduct = (id: string) => products.find(p => p.id === id);

  const cartTotal = items.reduce((sum, item) => {
    const p = getProduct(item.product_id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 1000, transition: 'opacity 0.4s ease',
          opacity: isDrawerOpen ? 1 : 0, pointerEvents: isDrawerOpen ? 'auto' : 'none'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 450,
        background: '#0a0a0a', borderLeft: '1px solid rgba(229,184,118,0.15)',
        zIndex: 1001, transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(229,184,118,0.1)' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.5rem', color: '#e5b876', fontWeight: 500 }}>Your Cart</h2>
          <button onClick={closeDrawer} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {items.length === 0 ? (
            <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
          ) : (
            items.map(item => {
              const p = getProduct(item.product_id);
              if (!p) return null;
              return (
                <div key={item.id} style={{ display: 'flex', gap: '1rem' }}>
                  <img src={p.images[0]} alt={p.name} style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 4, background: '#111' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.3rem', color: '#ffffff', lineHeight: 1.2 }}>{p.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                    {item.size && <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>Size: {item.size}</p>}
                    
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(229,184,118,0.3)', borderRadius: 4, padding: '0.4rem 0.8rem' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#e5b876', cursor: 'pointer', padding: '0 6px', fontSize: '1.2rem' }}>-</button>
                        <span style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.1rem', color: '#ffffff', minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#e5b876', cursor: 'pointer', padding: '0 6px', fontSize: '1.2rem' }}>+</button>
                      </div>
                      <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.3rem', color: '#e5b876' }}>R{(p.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.5rem', background: '#111111', borderTop: '1px solid rgba(229,184,118,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontFamily: '"Cormorant SC",serif', fontSize: '1.4rem', color: '#ffffff' }}>
              <span>Subtotal</span>
              <span style={{ color: '#e5b876' }}>R{cartTotal.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              <span>Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
