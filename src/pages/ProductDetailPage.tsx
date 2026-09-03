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
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize(null);
  }, [id]);

  if (productLoading) return (
    <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 130 }}>
      <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.85rem', letterSpacing: '0.2em', color: '#e5b876' }}>Loading…</p>
    </div>
  );

  if (!product) return <Navigate to="/shop" replace />;

  const handleAdd = () => {
    if (product.sizes && !selectedSize) return;
    addToCart(product.id, selectedSize || undefined);
  };

  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  const isTee = product.name.toLowerCase().includes('tee');
  const isCropTop = product.name.toLowerCase().includes('crop top');
  const hasSizeGuide = isTee || isCropTop;

  return (
    <>
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
                <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.6rem', color: '#000000', fontWeight: 600, letterSpacing: '0.05em' }}>R{product.price.toLocaleString('en-US')}</p>
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

              {hasSizeGuide && (
                <button onClick={() => setShowSizeGuide(true)} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#000000', cursor: 'pointer', fontFamily: '"Cormorant Garamond",serif', fontSize: '1rem', marginTop: '1rem', padding: 0, fontWeight: 600 }}>
                  Size Guide
                </button>
              )}
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

      {/* Size Guide Modal */}
      {
        showSizeGuide && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowSizeGuide(false)} />
            <div style={{ position: 'relative', background: '#ffffff', color: '#000000', padding: '2rem', borderRadius: 8, maxWidth: 650, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <button onClick={() => setShowSizeGuide(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#000000', padding: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem' }}>Garment Measurement Guide</h2>

              {isTee && (
                <>
                  <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.95rem', marginBottom: '1.5rem', color: '#444' }}>All measurements are provided in centimetres (cm). For the most accurate results, lay the garment flat on a level surface before measuring.</p>
                  <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #000' }}>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Size</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Shoulder</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Chest</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Length</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Sleeve Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[['S', 55, 116, 70, 21.85], ['M', 57, 120, 73, 23.2], ['L', 59.5, 125, 76, 24.55], ['XL', 62, 130, 79, 25.9]].map(row => (
                          <tr key={row[0]} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{row[0]}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{row[1]}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{row[2]}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{row[3]}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{row[4]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {isCropTop && (
                <>
                  <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.95rem', marginBottom: '1.5rem', color: '#444' }}>All measurements are provided in centimetres (cm). For the most accurate results, lay the garment flat on a level surface before measuring.</p>
                  <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #000' }}>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Size</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Shoulder</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Chest</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Length</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Sleeve Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[['S', 41, 110, '32 long side / 21.5 short', 23], ['M', 45, 114, '51 long side / 28 short', 23], ['L', 50, 120, '53 long side / 29 short', 23.5], ['XL', 54, 126, '55 long side / 31 short', 24.5]].map(row => (
                          <tr key={row[0]} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{row[0]}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{row[1]}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{row[2]}</td>
                            <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>{row[3]}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>{row[4]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.85rem', color: '#555', fontStyle: 'italic', marginBottom: '2rem' }}>
                    Note: The garment's length is measured according to its asymmetrical 45-degree angled cut. The measurements therefore include both the longest and shortest points of the hem.
                  </p>
                </>
              )}

              <div>
                <h3 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700 }}>How to Measure</h3>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.9rem', color: '#333' }}>
                  <li><strong style={{ color: '#000' }}>Chest:</strong> Measure across the garment from one underarm seam to the other, directly below the armpits.</li>
                  <li><strong style={{ color: '#000' }}>Shoulder:</strong> Measure across the front of the garment from the point where the left shoulder seam meets the sleeve to the point where the right shoulder seam meets the sleeve.</li>
                  <li><strong style={{ color: '#000' }}>Length:</strong> Measure from the point where the shoulder seam meets the collar down to the bottom hem of the garment.</li>
                  <li><strong style={{ color: '#000' }}>Sleeve Length:</strong> Measure from the point where the shoulder seam meets the armhole down to the end of the cuff.</li>
                </ul>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
