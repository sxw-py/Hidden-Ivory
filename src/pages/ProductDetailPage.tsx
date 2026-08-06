import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import { useProduct, useProducts } from '../lib/useProducts';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading: productLoading } = useProduct(id!);
  const { products } = useProducts();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (productLoading) return (
    <div style={{ minHeight:'100vh', background:'#000000', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:130 }}>
      <p style={{ fontFamily:'"Cormorant SC",serif', fontSize:'0.85rem', letterSpacing:'0.2em', color:'#e5b876' }}>Loading…</p>
    </div>
  );

  if (!product) return <Navigate to="/shop" replace />;

  const handleAdd = () => {
    if (product.sizes && !selectedSize) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130 }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff' }}>
        {[['Home', '/'], ['Shop', '/shop']].map(([label, to]) => (
          <span key={to} style={{ display: 'contents' }}>
            <Link to={to} style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#e5b876')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#ffffff')}>{label}</Link><span>/</span>
          </span>
        ))}
        <span style={{ color: '#ffffff' }}>{product.name}</span>
      </div>

      {/* Main layout */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(2rem,5vw,4rem) 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(400px,100%),1fr))', gap: 'clamp(2rem,6vw,5rem)', alignItems: 'start' }}>

        {/* Carousel */}
        <Carousel images={product.images} alt={product.name} />

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e5b876', marginBottom: '0.5rem' }}>{product.category}</p>
            <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontWeight: 500, fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#e5b876', lineHeight: 1.15, marginBottom: '0.75rem' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.4rem', color: '#e5b876', fontWeight: 500, letterSpacing: '0.05em' }}>R{product.price.toFixed(2)}</p>
              {!product.inStock && (
                <span style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '0.25rem 0.5rem', borderRadius: 4 }}>
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(229,184,118,0.2)' }} />

          <p style={{ color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '1.05rem', lineHeight: 1.85 }}>{product.description}</p>

          {/* Size selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff' }}>
                Size{selectedSize ? `: ${selectedSize}` : ''}
              </span>
              <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.85rem', color: '#e5b876', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(229,184,118,0.4)' }}>Size Guide</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes ? product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`size-btn${selectedSize === s ? ' selected' : ''}`}>{s}</button>
              )) : (
                <button disabled className="size-btn selected" style={{ width: 'auto', padding: '0 1rem', cursor: 'default' }}>ONE SIZE</button>
              )}
            </div>
            {product.sizes && !selectedSize && <p style={{ marginTop: '0.5rem', fontFamily: '"Cormorant Garamond",serif', fontSize: '0.85rem', color: '#ffffff', fontStyle: 'italic' }}>Please select a size</p>}
          </div>

          <button onClick={handleAdd} className="btn-gold" style={{ width: '100%', justifyContent: 'center', opacity: !product.inStock ? 0.5 : 1, cursor: !product.inStock ? 'not-allowed' : 'pointer' }}
            disabled={!product.inStock || !!(product.sizes && !selectedSize)}>
            <span>{!product.inStock ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}</span>
          </button>

          {/* Delivery box */}
          <div style={{ background: '#111111', border: '1px solid rgba(229,184,118,0.12)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e5b876', marginBottom: '0.25rem' }}>Delivery</p>
            {[' Courier Guy — R100 flat rate (8 to 15 days)', ' Order updates sent via WhatsApp'].map(line => (
              <p key={line} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#ffffff' }}>{line}</p>
            ))}
          </div>

          {/* Details */}
          <div>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '0.75rem' }}>Details</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {product.details.map(d => (
                <li key={d} style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.95rem', color: '#ffffff', paddingLeft: '1rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#e5b876' }}>·</span>{d}
                </li>
              ))}
            </ul>
          </div>

          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: '#ffffff' }}>
            Not happy?{' '}<Link to="/returns" style={{ color: '#e5b876', textDecoration: 'underline', textDecorationColor: 'rgba(229,184,118,0.4)' }}>View our returns policy</Link>.
          </p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem clamp(4rem,8vw,6rem)' }}>
          <hr className="gold-rule" style={{ marginBottom: 'clamp(2rem,4vw,3rem)' }} />
          <h3 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '2rem', textAlign: 'center' }}>You may also like</h3>
          <div className="product-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
