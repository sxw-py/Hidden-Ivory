import { Link } from 'react-router-dom';

function InstagramIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
}
function FacebookIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>;
}
function PinterestIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.163 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.609 0 12.017 0z"/></svg>;
}
function WhatsAppIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>;
}
function TikTokIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.64-5.46-.22-2.14.73-4.29 2.5-5.59 1.34-.99 3.03-1.44 4.67-1.12.02 1.48.01 2.96.01 4.45-.63-.12-1.3-.11-1.92.1-1.16.42-1.89 1.6-1.8 2.82.09 1.15.82 2.19 1.88 2.55 1.08.35 2.29.13 3.14-.6.76-.64 1.18-1.62 1.22-2.62.14-5.32.06-10.65.11-15.97h.04l.01.03z"/></svg>;
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
            Identity lives within the stitch
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            {[
              { href: 'https://www.instagram.com/hiddenivoryapparel?utm_source=qr&igsi=YzA3ODFlZ3JmdnY4', label: 'Instagram', Icon: InstagramIcon }, 
              { href: 'https://www.facebook.com/share/19BUgD5Vza/', label: 'Facebook', Icon: FacebookIcon },
              { href: 'https://pin.it/6sb8xeM0f', label: 'Pinterest', Icon: PinterestIcon },
              { href: 'https://www.tiktok.com/@hiddenivoryappparel?_r=1&_t=ZS-99QaHbOEQ44', label: 'TikTok', Icon: TikTokIcon },
              { href: 'https://wa.me/27827439898', label: 'WhatsApp', Icon: WhatsAppIcon }
            ].map(({ href, label, Icon }) => (
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
            <a href="mailto:hiddenivory.support@gmail.com" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s ease' }}
               onMouseOver={(e) => e.currentTarget.style.color = '#e5b876'}
               onMouseOut={(e) => e.currentTarget.style.color = '#ffffff'}>
              hiddenivory.support@gmail.com
            </a>
            <a href="tel:0827439898" style={{ color: '#ffffff', textDecoration: 'none', transition: 'color 0.3s ease' }}
               onMouseOver={(e) => e.currentTarget.style.color = '#e5b876'}
               onMouseOut={(e) => e.currentTarget.style.color = '#ffffff'}>
              Cell: 082 743 9898
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
