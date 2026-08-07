import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../lib/useProducts';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useCart();
  const { products } = useProducts();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    if (items.length === 0) {
      navigate('/shop', { replace: true });
    }
  }, [items, navigate]);

  // Autofill shipping details from previous order if user is logged in
  useEffect(() => {
    if (!user) return;
    
    const fetchLastOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (data) {
        setFormData(prev => ({
          ...prev,
          phone: prev.phone || data.customer_phone || '',
          idNumber: prev.idNumber || data.customer_id_number || '',
          address: prev.address || data.shipping_address || '',
        }));
      }
    };
    
    fetchLastOrder();
  }, [user]);

  const validateField = (name: string, value: string) => {
    let err = '';
    if (!value.trim()) {
      err = 'This field is required.';
    } else if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) err = 'Please enter a valid email address.';
    } else if (name === 'phone') {
      const cleanPhone = value.replace(/[\s-]/g, '');
      if (!/^(\+27|0)[6-8][0-9]{8}$/.test(cleanPhone)) err = 'Please enter a valid South African phone number (e.g. 082 123 4567).';
    } else if (name === 'idNumber') {
      const cleanId = value.replace(/[\s-]/g, '');
      if (!/^[0-9]{13}$/.test(cleanId)) err = 'Please enter a valid 13-digit South African ID number.';
    }
    setFieldErrors(prev => ({ ...prev, [name]: err }));
    return !err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isFullNameValid = validateField('fullName', formData.fullName);
    const isEmailValid = validateField('email', formData.email);
    const isPhoneValid = validateField('phone', formData.phone);
    const isIdValid = validateField('idNumber', formData.idNumber);
    const isAddressValid = validateField('address', formData.address);

    if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isIdValid || !isAddressValid) {
      setError('Please fix the errors above before checking out.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Call the Supabase Edge Function to create a Yoco checkout session
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // Get the current user's session token if logged in
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          customer: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.replace(/[\s-]/g, ''),
            idNumber: formData.idNumber.replace(/[\s-]/g, ''),
            address: formData.address.trim(),
          },
          items: items,
          totalAmount: grandTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect customer to Yoco's hosted payment page
      window.location.href = data.redirectUrl;

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130, paddingBottom: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(450px,100%),1fr))', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left Column: Form */}
        <div style={{ background: '#0a0a0a', padding: '2.5rem', border: '1px solid rgba(229,184,118,0.15)', borderRadius: 4 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', color: '#e5b876', marginBottom: '2rem' }}>Shipping Details</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <input type="text" placeholder="Full Name" required className="auth-input"
                style={{ borderColor: fieldErrors.fullName ? '#ff6b6b' : undefined, width: '100%', boxSizing: 'border-box' }}
                value={formData.fullName} onChange={e => { setFormData({...formData, fullName: e.target.value}); setFieldErrors(prev => ({...prev, fullName: ''})); }}
                onBlur={() => validateField('fullName', formData.fullName)} />
              {fieldErrors.fullName && <p style={{ color: '#ff6b6b', marginTop: '0.4rem', fontSize: '0.8rem', fontFamily: '"Cormorant SC",serif' }}>{fieldErrors.fullName}</p>}
            </div>
            
            <div>
              <input type="email" placeholder="Email Address" required className="auth-input"
                style={{ borderColor: fieldErrors.email ? '#ff6b6b' : undefined, width: '100%', boxSizing: 'border-box' }}
                value={formData.email} onChange={e => { setFormData({...formData, email: e.target.value}); setFieldErrors(prev => ({...prev, email: ''})); }}
                onBlur={() => validateField('email', formData.email)} />
              {fieldErrors.email && <p style={{ color: '#ff6b6b', marginTop: '0.4rem', fontSize: '0.8rem', fontFamily: '"Cormorant SC",serif' }}>{fieldErrors.email}</p>}
            </div>
            
            <div>
              <input type="tel" placeholder="Phone Number" required className="auth-input"
                style={{ borderColor: fieldErrors.phone ? '#ff6b6b' : undefined, width: '100%', boxSizing: 'border-box' }}
                value={formData.phone} onChange={e => { setFormData({...formData, phone: e.target.value}); setFieldErrors(prev => ({...prev, phone: ''})); }}
                onBlur={() => validateField('phone', formData.phone)} />
              {fieldErrors.phone && <p style={{ color: '#ff6b6b', marginTop: '0.4rem', fontSize: '0.8rem', fontFamily: '"Cormorant SC",serif' }}>{fieldErrors.phone}</p>}
            </div>
            
            <div>
              <input type="text" placeholder="SA ID Number" required className="auth-input"
                style={{ borderColor: fieldErrors.idNumber ? '#ff6b6b' : undefined, width: '100%', boxSizing: 'border-box' }}
                value={formData.idNumber} onChange={e => { setFormData({...formData, idNumber: e.target.value}); setFieldErrors(prev => ({...prev, idNumber: ''})); }}
                onBlur={() => validateField('idNumber', formData.idNumber)} />
              {fieldErrors.idNumber && <p style={{ color: '#ff6b6b', marginTop: '0.4rem', fontSize: '0.8rem', fontFamily: '"Cormorant SC",serif' }}>{fieldErrors.idNumber}</p>}
            </div>
            
            <div>
              <textarea placeholder="Full Delivery Address" required className="auth-input" rows={4}
                style={{ borderColor: fieldErrors.address ? '#ff6b6b' : undefined, width: '100%', boxSizing: 'border-box' }}
                value={formData.address} onChange={e => { setFormData({...formData, address: e.target.value}); setFieldErrors(prev => ({...prev, address: ''})); }}
                onBlur={() => validateField('address', formData.address)} />
              {fieldErrors.address && <p style={{ color: '#ff6b6b', marginTop: '0.4rem', fontSize: '0.8rem', fontFamily: '"Cormorant SC",serif' }}>{fieldErrors.address}</p>}
            </div>

            {error && <p style={{ color: '#ff6b6b', marginTop: '0.5rem', fontSize: '0.9rem', fontFamily: '"Cormorant SC",serif' }}>{error}</p>}
            
            <div style={{ height: 1, background: 'rgba(229,184,118,0.2)', margin: '1.5rem 0' }} />
            
            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              <span>{loading ? 'Redirecting to payment...' : 'Checkout'}</span>
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
    </div>
  );
}
