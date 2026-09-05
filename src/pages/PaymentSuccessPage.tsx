import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    window.scrollTo(0, 0);
    clearCart();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130, paddingBottom: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '130px 1.5rem 100px' }}>
      
      {/* Checkmark animation */}
      <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #4caf82', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', animation: 'fadeUp 0.6s ease-out' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4caf82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#e5b876', marginBottom: '1rem' }}>
        Thank You
      </h1>
      
      <p style={{ color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.3rem', marginBottom: '0.5rem', maxWidth: 500 }}>
        Your payment was successful and your order has been placed.
      </p>

      {orderId && (
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          Order Reference: <strong style={{ color: '#e5b876' }}>ORD-{orderId.substring(0, 8).toUpperCase()}</strong>
        </p>
      )}

      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: 450 }}>
        You will receive a confirmation email shortly with your order details.
      </p>

      <button onClick={() => navigate('/experience')} className="btn-gold" style={{ marginBottom: '1.25rem' }}>
        <span>Share Your Experience</span>
      </button>

      <button onClick={() => navigate('/shop')} className="btn-outline" style={{ borderColor: 'rgba(229,184,118,0.3)', color: 'rgba(255,255,255,0.6)' }}>
        <span>Continue Shopping</span>
      </button>
    </div>
  );
}
