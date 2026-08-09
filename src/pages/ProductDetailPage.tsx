import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { useProduct, useProducts } from '../lib/useProducts';
import { useCart } from '../contexts/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading: productLoading } = useProduct(id!);
  const { products } = useProducts();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize(null);
  }, [id]);

  if (productLoading) return (
    <div style={{ minHeight:'100vh', background:'#000000', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:130 }}>
      <p style={{ fontFamily:'"Cormorant SC",serif', fontSize:'0.85rem', letterSpacing:'0.2em', color:'#e5b876' }}>Loading…</p>
    </div>
  );

  if (!product) return <Navigate to="/shop" replace />;

  const handleAdd = () => {
    if (product.sizes && !selectedSize) return;
    addToCart(product.id, selectedSize || undefined);
  };

  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: '#e5b876', paddingTop: 130 }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000000' }}>
        {[['Home', '/'], ['Shop', '/shop']].map(([label, to]) => (
          <span key={to} style={{ display: 'contents' }}>
            <Link to={to} style={{ color: '#000000', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = 'rgba(0,0,0,0.6)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#000000')}>{label}</Link><span>/</span>
          </span>
        ))}
        <span style={{ color: '#000000' }}>{product.name}</span>
      </div>

      {/* Main layout */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(400px,100%),1fr))', gap: 'clamp(2rem,6vw,5rem)', alignItems: 'start' }}>

        {/* Carousel */}
        <Carousel images={product.images} alt={product.name} />

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '0.5rem', fontWeight: 'bold' }}>{product.category}</p>
            <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 'bold', fontSize: 'clamp(2rem,5vw,3rem)', color: '#ffffff', lineHeight: 1.15, marginBottom: '0.75rem', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.6rem', color: '#000000', fontWeight: 600, letterSpacing: '0.05em' }}>R{product.price.toFixed(2)}</p>
              {!product.inStock && (
                <span style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000000', border: '1px solid #000000', padding: '0.25rem 0.5rem', borderRadius: 4 }}>
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(0,0,0,0.2)' }} />

          <p style={{ color: '#000000', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', lineHeight: 1.85, fontWeight: 500 }}>{product.description}</p>

          {/* Size selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000000', fontWeight: 600 }}>
                Size{selectedSize ? `: ${selectedSize}` : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes ? product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`size-btn${selectedSize === s ? ' selected' : ''}`} style={{ color: selectedSize === s ? '#ffffff' : '#000000', borderColor: '#000000', backgroundColor: selectedSize === s ? '#000000' : 'transparent' }}>{s}</button>
              )) : (
                <button disabled className="size-btn selected" style={{ width: 'auto', padding: '0 1rem', cursor: 'default', color: '#ffffff', borderColor: '#000000', backgroundColor: '#000000' }}>ONE SIZE</button>
              )}
            </div>
            {product.sizes && !selectedSize && <p style={{ marginTop: '0.5rem', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.05rem', color: '#000000', fontStyle: 'italic', fontWeight: 500 }}>Please select a size</p>}
          </div>

          <button onClick={handleAdd} style={{ width: '100%', justifyContent: 'center', opacity: !product.inStock ? 0.5 : 1, cursor: !product.inStock ? 'not-allowed' : 'pointer', background: '#000000', color: '#ffffff', fontFamily: '"Cormorant SC",serif', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.875rem 2rem', border: 'none', borderRadius: 999 }}
            disabled={!product.inStock || !!(product.sizes && !selectedSize)}>
            <span>{!product.inStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>

          {/* Delivery box */}
          <div style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '0.25rem', fontWeight: 'bold' }}>Delivery</p>
            {[' Courier Guy — R100 flat rate (8 to 15 days)', ' Order updates sent via WhatsApp'].map(line => (
              <p key={line} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.95rem', color: '#000000', fontWeight: 500 }}>{line}</p>
            ))}
          </div>

          {/* Details */}
          <div>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '0.75rem', fontWeight: 'bold' }}>Details</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {product.details.map(d => (
                <li key={d} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.95rem', color: '#000000', paddingLeft: '1rem', position: 'relative', fontWeight: 500 }}>
                  <span style={{ position: 'absolute', left: 0, color: '#000000' }}>·</span>{d}
                </li>
              ))}
            </ul>
          </div>

          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.95rem', color: '#000000', fontWeight: 500 }}>
            Not happy?{' '}<Link to="/returns" style={{ color: '#000000', textDecoration: 'underline', textDecorationColor: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>View our returns policy</Link>.
          </p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem clamp(4rem,8vw,6rem)' }}>
          <hr className="gold-rule" style={{ marginBottom: 'clamp(2rem,4vw,3rem)', background: 'linear-gradient(90deg, transparent, #000000, transparent)' }} />
          <h3 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>You may also like</h3>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
