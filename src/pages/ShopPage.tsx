import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../lib/useProducts';

export default function ShopPage() {
  const { products, loading } = useProducts();
  const [sortBy, setSortBy] = useState('default');

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // Default: could be chronological (by id or created_at if available), here we just use original order
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130 }}>

      {/* Header banner */}
      <div style={{ background:'#e5b876', padding:'clamp(3rem,6vw,5rem) clamp(1rem,4vw,2rem) clamp(2.5rem,5vw,4rem)', textAlign:'center', borderBottom:'1px solid #000000' }}>
        <p style={{ fontFamily:'"Cormorant SC",serif', fontSize:'0.7rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#000000', marginBottom:'1rem' }}>Season 1</p>
        <h1 className="font-blackletter" style={{ fontSize:'clamp(2rem,6vw,4rem)', color:'#000000', lineHeight:1.1, marginBottom:'1rem' }}>The Signatures Collection</h1>
        <div style={{ width:60, height:1, background:'linear-gradient(90deg,transparent,#000000,transparent)', margin:'0 auto' }} />
      </div>

      {/* Grid */}
      <div style={{ background:'#e5b876', padding:'clamp(2rem,5vw,4rem) clamp(1rem,4vw,2rem)' }}>
        <div style={{ maxWidth:1400, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
            <p style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'0.9rem', color:'#000000', letterSpacing:'0.05em' }}>
              {loading ? '…' : `${products.length} pieces`}
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <label style={{ fontFamily:'"Cormorant SC",serif', fontSize:'0.75rem', letterSpacing:'0.15em', color:'#000000', textTransform:'uppercase' }}>Sort by</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'0.9rem', color:'#000000', background:'transparent', border:'1px solid #000000', padding:'0.4rem 0.75rem', cursor:'pointer' }}>
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'4rem', fontFamily:'"Cormorant SC",serif', fontSize:'0.85rem', letterSpacing:'0.2em', color:'#000000' }}>
              Loading collection…
            </div>
          ) : (
            <div className="product-grid">
              {sortedProducts.map((p, i) => <ProductCard key={p.id} product={p} priority={i===0} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
