import { Link } from 'react-router-dom';

function InstagramIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
}
function FacebookIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>;
}

const hoverGold = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget).style.color = '#5e4018'; (e.currentTarget).style.transform = 'translateY(-2px)'; };
const unhoverGold = (e: React.MouseEvent<HTMLElement>) => { (e.currentTarget).style.color = '#ffffff'; (e.currentTarget).style.transform = 'translateY(0)'; };

export default function Footer() {
  return (
    <footer style={{ background: '#000000', borderTop: '1px solid rgba(229,184,118,0.15)' }}>
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#5e4018 30%,#5e4018 70%,transparent)', opacity: 0.3 }} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '4rem 1.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '3rem' }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/Logo.png" alt="Hidden Ivory" width={120} height={120} style={{ borderRadius: 2 }} />
          </Link>
          <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.8, fontFamily: '"Cormorant Garamond",serif', maxWidth: 260 }}>
            Bold luxury rooted in African identity. Every stitch tells the story.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {[{ href: 'https://instagram.com/hiddenivory', label: 'Instagram', Icon: InstagramIcon }, { href: 'https://facebook.com/hiddenivory', label: 'Facebook', Icon: FacebookIcon }].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ color: '#ffffff', transition: 'color 0.3s ease, transform 0.3s ease', display: 'inline-flex' }}
                onMouseEnter={hoverGold} onMouseLeave={unhoverGold}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Navigate */}
        <div>
          <p className="section-eyebrow" style={{ marginBottom: '1.25rem' }}>Navigate</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[['Shop', '/shop'], ['Returns', '/returns'], ['Contact', '/contact']].map(([label, to]) => (
              <li key={label}>
                <Link to={to} style={{ fontFamily: '"Cormorant Garamond",serif', color: '#ffffff', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s ease' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#5e4018')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = '#ffffff')}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery */}
        <div>
          <p className="section-eyebrow" style={{ marginBottom: '1.25rem' }}>Delivery</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '0.95rem', lineHeight: 1.7 }}>
              <li>Courier Guy (R100 Flat Rate, 8-15 Days)</li>
              <li>Order updates via WhatsApp</li>
            </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="section-eyebrow" style={{ marginBottom: '1.25rem' }}>Get in Touch</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '0.95rem' }}>
            <a href="mailto:support@hiddenivory.co.za" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.color = '#5e4018')}
              onMouseLeave={e => ((e.target as HTMLElement).style.color = '#ffffff')}>
              support@hiddenivory.co.za
            </a>
            <span>South Africa</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem', borderTop: '1px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: '#ffffff', fontSize: '0.8rem', fontFamily: '"Cormorant Garamond",serif', letterSpacing: '0.05em' }}>
          © {new Date().getFullYear()} Hidden Ivory. All rights reserved.
        </p>
        <p style={{ color: '#ffffff', fontSize: '0.75rem', fontFamily: '"Cormorant Garamond",serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Crafted with purpose
        </p>
      </div>
    </footer>
  );
}
