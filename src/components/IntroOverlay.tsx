import { useState, useEffect } from 'react';

export default function IntroOverlay() {
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock scrolling while the overlay is visible
    document.body.style.overflow = 'hidden';

    // Start fading out the overlay after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 2500);

    // Completely remove the overlay after the fade transition finishes
    const hideTimer = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = '';
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (hidden) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000', opacity: fadingOut ? 0 : 1, transition: 'opacity 1s ease', pointerEvents: fadingOut ? 'none' : 'all' }}>

      {/* Grid texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(229,184,118,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(229,184,118,0.05) 1px,transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      {/* Content */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2rem', opacity: mounted ? 1 : 0, transform: mounted ? 'scale(1)' : 'scale(0.9)', transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s' }}>
          <img src="/Logo.png" alt="Hidden Ivory" width={160} height={160} style={{ borderRadius: 2, display: 'block' }} />
        </div>

        <div className="gold-divider" style={{ marginBottom: '1.5rem', opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }} />

        <p className="section-eyebrow" style={{ marginBottom: '0.75rem', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s' }}>
          Welcome to
        </p>

        <h1 className="font-blackletter" style={{ fontSize: 'clamp(3.5rem,12vw,8rem)', color: '#e5b876', lineHeight: 1, marginBottom: '0.5rem', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.9s ease 0.85s, transform 0.9s ease 0.85s' }}>
          hidden ivory
        </h1>

        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontSize: '1.25rem', color: '#5e4018', marginBottom: '2rem', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 1s ease 1s, transform 1s ease 1s' }}>
          Find your identity. Find your treasure.
        </p>

        <div className="gold-divider" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.1s' }} />
      </div>

      {/* Corner accents */}
      {[{ top: '2rem', left: '2rem', borderTop: '1px solid rgba(229,184,118,0.3)', borderLeft: '1px solid rgba(229,184,118,0.3)' },
      { top: '2rem', right: '2rem', borderTop: '1px solid rgba(229,184,118,0.3)', borderRight: '1px solid rgba(229,184,118,0.3)' },
      { bottom: '2rem', left: '2rem', borderBottom: '1px solid rgba(229,184,118,0.3)', borderLeft: '1px solid rgba(229,184,118,0.3)' },
      { bottom: '2rem', right: '2rem', borderBottom: '1px solid rgba(229,184,118,0.3)', borderRight: '1px solid rgba(229,184,118,0.3)' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 40, height: 40, opacity: mounted ? 1 : 0, transition: `opacity 1s ease 1.4s`, ...s }} />
      ))}
    </div>
  );
}
