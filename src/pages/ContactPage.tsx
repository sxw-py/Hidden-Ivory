import { useEffect } from 'react';

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: 'How does delivery work?',
      a: 'We use Courier Guy for all nationwide deliveries at a flat rate of R100.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Deliveries typically take 8 to 15 days to arrive.'
    },
    {
      q: 'Where are we based?',
      a: 'We are proudly based in Pretoria, South Africa.'
    },
    {
      q: 'Where do we deliver to?',
      a: 'We deliver nationwide across South Africa.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130 }}>

      {/* ── Header ── */}
      <div style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) clamp(3rem,6vw,4rem)', textAlign: 'center', borderBottom: '1px solid rgba(229,184,118,0.12)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle,rgba(229,184,118,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Get in Touch</p>
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(2rem,6vw,4rem)', color: '#ffffff', lineHeight: 1.1, marginBottom: '1.5rem' }}>Contact Us</h1>
        <div className="gold-divider" />
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) 1.5rem' }}>

        {/* Contact Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', marginBottom: '5rem' }}>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', color: '#ffffff', textAlign: 'center', maxWidth: 500, lineHeight: 1.8 }}>
            Have a question about an order, a specific piece, or just want to chat? We handle everything personally. Reach out to us below.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="https://wa.me/27715079677" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <WhatsAppIcon />
              <span>Contact Us on WhatsApp</span>
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@hiddenivory.co.za" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <EmailIcon />
              <span>Contact Us via Email</span>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: '#e5b876', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            <div style={{ width: 40, height: 1, background: '#5e4018', margin: '0 auto' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#111111', border: '1px solid rgba(229,184,118,0.15)', padding: '2rem' }}>
                <h3 className="font-cinzel" style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  {faq.q}
                </h3>
                <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.15rem', color: '#e5b876', lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
