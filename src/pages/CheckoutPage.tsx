import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../lib/useProducts';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { products } = useProducts();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMockPayment, setShowMockPayment] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    idNumber: '',
    address: ''
  });

  const cartTotal = items.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.product_id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const SHIPPING_COST = 100;
  const grandTotal = cartTotal > 0 ? cartTotal + SHIPPING_COST : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (items.length === 0 && !success) {
      navigate('/shop', { replace: true });
    }
  }, [items, navigate, success]);

  const handleSuccessfulPayment = async (tokenId: string) => {
    try {
      const { data, error: dbError } = await supabase.from('orders').insert({
        user_id: user?.id || null, // Allow guest checkout if needed
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_id_number: formData.idNumber,
        shipping_address: formData.address,
        items: items, // JSONB
        total_amount: grandTotal,
        payment_token: tokenId,
        status: 'Paid'
      }).select().single();

      if (dbError) throw dbError;

      clearCart();
      setShowMockPayment(false);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to process order. Please contact support.');
      setShowMockPayment(false);
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.idNumber.trim() || !formData.address.trim()) {
      setError('Please fill in all shipping details.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid South African phone number (e.g. 082 123 4567).');
      return;
    }

    const cleanId = formData.idNumber.replace(/[\s-]/g, '');
    const idRegex = /^[0-9]{13}$/;
    if (!idRegex.test(cleanId)) {
      setError('Please enter a valid 13-digit South African ID number.');
      return;
    }

    setError(null);
    setLoading(true);
    
    // Simulate Opening the Payment Gateway Overlay
    setShowMockPayment(true);
    
    // Simulate a successful payment after 3 seconds
    setTimeout(() => {
      handleSuccessfulPayment('tok_mock_payment_success_123');
    }, 3000);
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130, paddingBottom: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '3rem', color: '#e5b876', marginBottom: '1rem' }}>Thank You</h1>
        <p style={{ color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', marginBottom: '2rem' }}>Your order has been placed successfully.</p>
        <button onClick={() => navigate('/shop')} className="btn-gold">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(450px,100%),1fr))', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left Column: Form */}
        <div style={{ background: '#0a0a0a', padding: '2.5rem', border: '1px solid rgba(229,184,118,0.15)', borderRadius: 4 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', color: '#e5b876', marginBottom: '2rem' }}>Shipping Details</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input type="text" placeholder="Full Name" required className="auth-input"
              value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            
            <input type="email" placeholder="Email Address" required className="auth-input"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            
            <input type="tel" placeholder="Phone Number" required className="auth-input"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            
            <input type="text" placeholder="SA ID Number" required className="auth-input"
              value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
            
            <textarea placeholder="Full Delivery Address" required className="auth-input" rows={4}
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />

            {error && <p style={{ color: '#ff6b6b', marginTop: '0.5rem', fontSize: '0.9rem', fontFamily: '"Cormorant SC",serif' }}>{error}</p>}
            
            <div style={{ height: 1, background: 'rgba(229,184,118,0.2)', margin: '1.5rem 0' }} />
            
            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              <span>{loading ? 'Processing...' : 'Checkout'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div style={{ position: 'sticky', top: 150 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', color: '#e5b876', marginBottom: '2rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {items.map(item => {
              const p = products.find(prod => prod.id === item.product_id);
              if (!p) return null;
              return (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={p.images[0]} alt={p.name} style={{ width: 60, height: 75, objectFit: 'cover', borderRadius: 4 }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>{p.name}</h4>
                    {item.size && <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Size: {item.size}</p>}
                    <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.1rem', color: '#e5b876' }}>R{(p.price * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          <div style={{ height: 1, background: 'rgba(229,184,118,0.2)', marginBottom: '1.5rem' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem' }}>
            <span>Subtotal</span>
            <span>R{cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem' }}>
            <span>Shipping</span>
            <span>R{SHIPPING_COST.toFixed(2)}</span>
          </div>
          
          <div style={{ height: 1, background: 'rgba(229,184,118,0.2)', marginBottom: '1.5rem' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e5b876', fontFamily: '"Cormorant SC",serif', fontSize: '1.8rem', fontWeight: 600 }}>
            <span>Total</span>
            <span>R{grandTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Mock Payment Overlay */}
      {showMockPayment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #e5b876', borderRadius: 8, padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400, width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #e5b876', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginBottom: '2rem' }} />
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
            <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem', textAlign: 'center' }}>Processing Payment</h3>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '1.5rem' }}>Securely authenticating with your bank...</p>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.2rem', color: '#e5b876', fontWeight: 'bold' }}>R{grandTotal.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
