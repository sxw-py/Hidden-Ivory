import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ToteBagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Returns', to: '/returns' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isScrolled = scrollY > 120;
  const isSolid = scrollY > 380;

  const headerStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    transition: 'background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
    background: isSolid ? 'rgba(0,0,0,0.96)' : isScrolled ? 'rgba(0,0,0,0.6)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(16px)' : 'none',
    borderBottom: isSolid ? '1px solid rgba(229,184,118,0.15)' : '1px solid transparent',
  };

  return (
    <>
      <header style={headerStyle}>
        <nav style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem', height: 130, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/Logo.png" alt="Hidden Ivory" width={100} height={100} style={{ borderRadius: 2 }} />
          </Link>

          {/* Desktop nav */}
          <ul className="desktop-nav" style={{ listStyle: 'none', gap: '2.5rem', alignItems: 'center' }}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <Link to={link.to} className="nav-link">{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button aria-label="Account" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e5b876', padding: 4, display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#5e4018')}
              onMouseLeave={e => (e.currentTarget.style.color = '#e5b876')}>
              <ProfileIcon />
            </button>

            <button aria-label="Cart" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e5b876', padding: 4, display: 'flex', alignItems: 'center', position: 'relative', transition: 'color 0.3s ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#5e4018')}
              onMouseLeave={e => (e.currentTarget.style.color = '#e5b876')}>
              <ToteBagIcon />
              <span style={{ position: 'absolute', top: -2, right: -4, width: 16, height: 16, background: '#5e4018', color: '#ffffff', borderRadius: '50%', fontSize: '0.6rem', fontFamily: '"Cormorant SC",serif', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
            </button>

            <button className="mobile-menu-btn" aria-label="Menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e5b876', padding: 4 }}
              onClick={() => setMenuOpen(o => !o)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></>}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', transition: 'opacity 0.4s ease, visibility 0.4s ease', opacity: menuOpen ? 1 : 0, visibility: menuOpen ? 'visible' : 'hidden' }}>
        {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
          <div key={`${v}${h}`} style={{ position: 'absolute', [v]: '2rem', [h]: '2rem', width: 40, height: 40, [`border${v.charAt(0).toUpperCase() + v.slice(1)}`]: '1px solid rgba(229,184,118,0.3)', [`border${h.charAt(0).toUpperCase() + h.slice(1)}`]: '1px solid rgba(229,184,118,0.3)' }} />
        ))}
        <img src="/Logo.png" alt="Hidden Ivory" width={110} height={110} style={{ borderRadius: 2, marginBottom: '1rem' }} />
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <Link to={link.to} onClick={() => setMenuOpen(false)}
                  style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.5rem', letterSpacing: '0.15em', color: '#e5b876', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.3s ease' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#5e4018')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = '#e5b876')}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
