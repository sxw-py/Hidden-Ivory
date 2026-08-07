import { useNavigate } from 'react-router-dom';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130, paddingBottom: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '130px 1.5rem 100px' }}>
      
      {/* X icon */}
      <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ff6b6b', marginBottom: '1rem' }}>
        Payment Failed
      </h1>
      
      <p style={{ color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: 500 }}>
        Unfortunately your payment could not be processed. No charges have been made to your card.
      </p>

      <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Cormorant Garamond",serif', fontSize: '1rem', marginBottom: '3rem', maxWidth: 450 }}>
        Please try again or contact us if the problem persists.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate('/checkout')} className="btn-gold">
          <span>Try Again</span>
        </button>
        <button onClick={() => navigate('/contact')} className="btn-outline">
          <span>Contact Us</span>
        </button>
      </div>
    </div>
  );
}
