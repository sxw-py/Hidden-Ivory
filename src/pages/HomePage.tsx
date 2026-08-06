import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import IntroOverlay from '../components/IntroOverlay';
import ProductCard from '../components/ProductCard';
import { products } from '../lib/products';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

export default function HomePage() {
  useReveal();
  const isMobile = useIsMobile();

  return (
    <>
      <IntroOverlay />

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', background: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 130 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(229,184,118,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(229,184,118,0.06) 1px,transparent 1px)`, backgroundSize: '80px 80px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(229,184,118,0.09) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {isMobile ? (
          <div style={{ position: 'relative', zIndex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
            <h1 className="font-blackletter reveal" style={{ fontSize: 'clamp(3rem,12vw,4.5rem)', color: '#e5b876', lineHeight: 1, textTransform: 'lowercase' }}>
              hidden ivory
            </h1>
            
            <div className="reveal reveal-delay-1" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <img src="/brand_story.png" alt="Hidden Ivory Signature Shirt" style={{ maxWidth: '85%', height: 'auto', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
            </div>

            <Link to="/shop" className="btn-gold reveal reveal-delay-2" style={{ alignSelf: 'center', marginTop: '1rem' }}>
              <span>Shop the Collection</span>
            </Link>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <h1 className="font-blackletter" style={{ fontSize: 'clamp(3.5rem,8vw,5.5rem)', color: '#e5b876', lineHeight: 1, marginBottom: '0.2rem', textTransform: 'lowercase' }}>
                hidden ivory
              </h1>
              
              <p className="font-blackletter" style={{ color: '#5e4018', fontSize: '1.25rem', marginBottom: '2.5rem', letterSpacing: '0.05em' }}>
                Find your identity. Find your treasure.
              </p>
              
              <p className="font-display" style={{ color: '#ffffff', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 500 }}>
                In the dark shadows of Soweto, a mining town, a miner dug and dug until he found treasure. He handed the treasure to his boss, yet he himself held no value. Day after day, he returned underground, digging after digging, leaving with nothing in his hands. So, who is truly valuable: the miner, the gold, the one who finds it, or the treasure itself?
                <br /><br />
                This is <span className="font-blackletter" style={{ color: '#e5b876', fontSize: '1.2rem', padding: '0 4px' }}>Hidden Ivory</span>. Find your identity. Find your treasure.
              </p>

              <Link to="/shop" className="btn-gold" style={{ alignSelf: 'flex-start' }}>
                <span>Shop the Collection</span>
              </Link>
            </div>

            <div className="reveal reveal-delay-2" style={{ display: 'flex', justifyContent: 'center' }}>
              <img src="/brand_story.png" alt="Hidden Ivory Signature Shirt" style={{ maxWidth: '100%', height: 'auto', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        )}

        <div className="hero-line" />
      </section>

      {/* ── Collection ── */}
      <section style={{ background: '#e5b876', padding: 'clamp(4rem,8vw,7rem) clamp(1rem,4vw,2rem)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#000000', marginBottom: '1rem' }}>Season 1</p>
            <h2 className="font-blackletter" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: '#000000', marginBottom: '1.25rem', lineHeight: 1.1 }}>The Signatures Collection</h2>
            <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,#000000,transparent)', margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
            {products.slice(0, 4).map((p, i) => (
              <div key={p.id} className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                <ProductCard product={p} priority={i === 0} />
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/shop" style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000000', textDecoration: 'none', borderBottom: '1px solid #000000', paddingBottom: 2, transition: 'all 0.3s ease' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ffffff'; (e.target as HTMLElement).style.borderColor = '#ffffff'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = '#000000'; (e.target as HTMLElement).style.borderColor = '#000000'; }}>
              View All Pieces
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mobile Brand Story (Replaces Ethos) ── */}
      {isMobile ? (
        <section style={{ background: '#000000', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <p className="section-eyebrow font-cinzel reveal" style={{ marginBottom: '1.5rem' }}>Our Story</p>
            <p className="font-blackletter reveal reveal-delay-1" style={{ color: '#5e4018', fontSize: '1.25rem', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              Find your identity. Find your treasure.
            </p>
            
            <p className="font-display reveal reveal-delay-2" style={{ color: '#ffffff', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem', textAlign: 'left' }}>
              In the dark shadows of Soweto, a mining town, a miner dug and dug until he found treasure. He handed the treasure to his boss, yet he himself held no value. Day after day, he returned underground, digging after digging, leaving with nothing in his hands. So, who is truly valuable: the miner, the gold, the one who finds it, or the treasure itself?
              <br/><br/>
              This is <span className="font-blackletter" style={{ color: '#e5b876', fontSize: '1.1rem', padding: '0 4px' }}>Hidden Ivory</span>. Find your identity. Find your treasure.
            </p>
          </div>
        </section>
      ) : (
        /* ── Desktop Ethos ── */
        <section style={{ background: '#000000', padding: 'clamp(5rem,10vw,8rem) clamp(1rem,4vw,2rem)', position: 'relative', overflow: 'hidden' }}>
          {[{ left: 0 }, { right: 0 }].map((side, i) => (
            <div key={i} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 2, height: 200, background: 'linear-gradient(to bottom,transparent,#e5b876,transparent)', opacity: 0.4, ...side }} />
          ))}
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <p className="section-eyebrow font-cinzel reveal" style={{ marginBottom: '1.5rem' }}>Our Ethos</p>
            <h2 className="font-cinzel reveal reveal-delay-1" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: '#ffffff', marginBottom: '2rem', lineHeight: 1.2 }}>Luxury lives in the stitch, not the spectacle</h2>
            <div className="gold-divider reveal reveal-delay-2" style={{ marginBottom: '2.5rem' }} />
            <p className="reveal reveal-delay-2" style={{ color: '#e5b876', fontSize: '0.95rem', lineHeight: 1.9, fontFamily: '"Cinzel",serif', fontStyle: 'italic', marginBottom: '3rem' }}>
              "Every stitch carries intention. Every detail serves a purpose. Not everything valuable demands attention."
            </p>
            <div className="gold-divider reveal reveal-delay-3" />
          </div>
        </section>
      )}

      {/* ── Delivery strip ── */}
      <section style={{ background: '#111111', padding: 'clamp(3rem,6vw,5rem) clamp(1rem,4vw,2rem)', borderTop: '1px solid rgba(229,184,118,0.1)', borderBottom: '1px solid rgba(229,184,118,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '2.5rem', textAlign: 'center' }}>
          {[
            { title: 'Courier Guy', body: 'Flat rate delivery of R100 anywhere in South Africa. Deliveries typically take 8 to 15 days.' },
            { title: 'WhatsApp Updates', body: 'We keep you in the loop personally — no generic tracking links.' },
          ].map((item, i) => (
            <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.75rem' }}></span>
              <h4 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e5b876' }}>{item.title}</h4>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', fontFamily: '"Cormorant Garamond",serif', lineHeight: 1.7, maxWidth: 220 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
