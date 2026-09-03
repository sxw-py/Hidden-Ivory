import { Link } from 'react-router-dom';

const WA_NUMBER = '27827439898';
const WA_MSG = encodeURIComponent("Hi Hidden Ivory! I'd like to initiate a return. My order details are: (Please fill in your order details below)");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

const policies = [
  {
    title: 'Size Exchanges',
    body: (
      <>
        <p style={{ marginBottom: '1rem' }}>If you ordered the wrong size, we offer one size exchange per order, subject to stock availability.</p>
        <p style={{ marginBottom: '0.5rem' }}>To request a size exchange:</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li style={{ paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>Contact us within 7 days of receiving your order.</li>
          <li style={{ paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>Include your order number and the size you would like to exchange.</li>
          <li style={{ paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>We will provide the return instructions and guide you through the process.</li>
        </ul>
        <p style={{ marginBottom: '0.5rem' }}>The item must be:</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li style={{ paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>Unworn and unwashed</li>
          <li style={{ paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>In its original condition</li>
          <li style={{ paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>With all original tags attached</li>
          <li style={{ paddingLeft: '0.5rem', marginBottom: '0.25rem' }}>Returned in its original packaging where possible</li>
        </ul>
        <p>For size exchanges, the customer is responsible for the return shipping cost. Hidden Ivory will cover the delivery cost of sending the replacement size back to you.</p>
      </>
    )
  },
  {
    title: 'Incorrect or Faulty Items',
    body: (
      <>
        <p style={{ marginBottom: '1rem' }}>If you received the wrong item, the wrong size from our side, or an item with a manufacturing fault, please contact us within 7 days of delivery.</p>
        <p>In these cases, Hidden Ivory will cover both the return shipping and the replacement delivery cost.</p>
      </>
    )
  },
  {
    title: 'Return Process',
    body: (
      <>
        <p style={{ marginBottom: '1rem' }}>Once your exchange is approved, we will send you the return instructions. Returns will be handled through The Courier Guy, and we will provide the necessary guidance to ensure the process is simple and secure.</p>
        <p>After we receive and inspect your item, your replacement garment will be dispatched.</p>
      </>
    )
  },
  {
    title: 'Refunds',
    body: (
      <p>We do not offer refunds for incorrect size selection. Refunds are only considered for items that are faulty, incorrect, or where a replacement is not available.</p>
    )
  },
  {
    title: 'Need Assistance?',
    body: (
      <p>For all return and exchange requests, please contact us before sending any item back.</p>
    )
  }
];

export default function ReturnsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130 }}>

      {/* Header */}
      <div style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) clamp(3rem,6vw,4rem)', textAlign: 'center', borderBottom: '1px solid rgba(229,184,118,0.12)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle,rgba(229,184,118,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Policy</p>
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(2rem,6vw,4rem)', color: '#ffffff', lineHeight: 1.1, marginBottom: '1.5rem' }}>Returns & Exchanges</h1>
        <div className="gold-divider" />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', color: '#ffffff', lineHeight: 1.85 }}>
          At Hidden Ivory, every garment is created with intention. We want your piece to fit the way it was designed to fit. If you need a different size or there is an issue with your order, we’ll make the process as straightforward as possible.
        </p>

        {policies.map(({ title, body }) => (
          <div key={title} style={{ borderLeft: '2px solid rgba(229,184,118,0.25)', paddingLeft: '1.5rem' }}>
            <h2 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e5b876', marginBottom: '0.75rem' }}>{title}</h2>
            <div style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.05rem', color: '#ffffff', lineHeight: 1.8 }}>{body}</div>
          </div>
        ))}

        <div className="gold-divider" />

        {/* WhatsApp CTA */}
        <div style={{ background: '#111111', border: '1px solid rgba(229,184,118,0.15)', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#e5b876' }}>Start a Return</p>
          <h3 className="font-cinzel" style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#ffffff', lineHeight: 1.2 }}>Contact Us on WhatsApp</h3>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1rem', color: '#ffffff', maxWidth: 380, lineHeight: 1.7 }}>
            Please click the button below and provide your order number and reason for returning in the WhatsApp message.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            Start My Return on WhatsApp
          </a>
        </div>

        <div className="gold-divider" />
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.15rem', color: '#ffffff', textAlign: 'center', lineHeight: 1.7 }}>
          We’re here to ensure your Hidden Ivory experience reflects the same care that goes into every piece we create.
        </p>

        <div style={{ textAlign: 'center' }}>
          <Link to="/shop" className="btn-outline" style={{ display: 'inline-flex' }}><span>← Back to Shop</span></Link>
        </div>
      </div>
    </div>
  );
}
