import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SUB_CATEGORIES = ['Quality', 'Fit', 'Design', 'Comfort', 'Packaging', 'Value for money'];
const PROCESS_OPTIONS = [
  'Finding the right product',
  'Understanding sizing',
  'Checkout',
  'Payment',
  'Communication',
  'Delivery',
  'Nothing',
  'Other',
];

function StarRating({ value, onChange, size = 28 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.35rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            color: star <= (hover || value) ? '#5e4018' : 'rgba(94,64,24,0.25)',
            transition: 'color 0.2s ease, transform 0.15s ease',
            transform: star <= (hover || value) ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ExperiencePage() {
  const [overall, setOverall] = useState(0);
  const [subRatings, setSubRatings] = useState<Record<string, number>>(
    Object.fromEntries(SUB_CATEGORIES.map(c => [c, 0]))
  );
  const [enjoyedMost, setEnjoyedMost] = useState('');
  const [doneBetter, setDoneBetter] = useState('');
  const [processIssues, setProcessIssues] = useState<string[]>([]);
  const [otherProcess, setOtherProcess] = useState('');
  const [changeProduct, setChangeProduct] = useState('');
  const [purchaseAgain, setPurchaseAgain] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const toggleProcess = (option: string) => {
    setProcessIssues(prev =>
      prev.includes(option) ? prev.filter(p => p !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overall === 0) { setError('Please rate your overall experience.'); return; }
    setError('');
    setSubmitting(true);

    try {
      const { error: fnError } = await supabase.functions.invoke('send-experience', {
        body: {
          overall,
          subRatings,
          enjoyedMost,
          doneBetter,
          processIssues: processIssues.includes('Other')
            ? [...processIssues.filter(p => p !== 'Other'), `Other: ${otherProcess}`]
            : processIssues,
          changeProduct,
          purchaseAgain,
          lookingFor,
        },
      });
      if (fnError) throw fnError;
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: '1px solid rgba(94,64,24,0.3)',
    color: '#ffffff',
    fontFamily: '"Cormorant Garamond",serif',
    fontSize: '1.05rem',
    padding: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    resize: 'vertical' as const,
    minHeight: 120,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: '"Cormorant SC",serif',
    fontSize: '0.8rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#e5b876',
    marginBottom: '1rem',
    display: 'block',
    fontWeight: 'bold',
  };

  const sectionStyle: React.CSSProperties = {
    borderBottom: '1px solid rgba(94,64,24,0.15)',
    paddingBottom: '2.5rem',
    marginBottom: '2.5rem',
  };

  // ─── Thank You Screen ───
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '130px 1.5rem 100px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #5e4018', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', animation: 'fadeUp 0.6s ease-out' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5e4018" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#e5b876', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          Thank You for Being Part of Our Identity.
        </h1>
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.75rem', maxWidth: 450, lineHeight: 1.7 }}>
          We listen. We learn. We evolve.
        </p>
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '3rem', maxWidth: 450, fontStyle: 'italic' }}>
          Find your identity. Find your treasure.
        </p>
        <a href="/shop" className="btn-gold">
          <span>Continue Shopping</span>
        </a>
      </div>
    );
  }

  // ─── Form ───
  return (
    <div style={{ minHeight: '100vh', background: '#000000', paddingTop: 130 }}>

      {/* Header */}
      <div style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1rem,4vw,2rem) clamp(3rem,6vw,4rem)', textAlign: 'center', borderBottom: '1px solid rgba(94,64,24,0.12)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle,rgba(94,64,24,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Post-Purchase</p>
        <h1 className="font-cinzel" style={{ fontSize: 'clamp(2rem,6vw,4rem)', color: '#ffffff', lineHeight: 1.1, marginBottom: '1.5rem' }}>The Experience</h1>
        <div className="gold-divider" />
      </div>

      {/* Intro */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) 1.5rem 0', textAlign: 'center' }}>
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.9, marginBottom: '1rem' }}>
          You found us. Now help us refine what comes next.
        </p>
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.9, marginBottom: '1rem' }}>
          Hidden Ivory is built around identity, intention and discovery. Your experience matters to us — not only what you loved, but what you believe we could do better.
        </p>
        <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, fontStyle: 'italic' }}>
          Tell us what you found. Tell us what was missing.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '0 auto', padding: 'clamp(3rem,6vw,4rem) 1.5rem clamp(4rem,8vw,6rem)' }}>

        {/* Q1 — Overall experience */}
        <div style={sectionStyle}>
          <label style={labelStyle}>How was your overall experience?</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>Not the one</span>
            <StarRating value={overall} onChange={setOverall} size={32} />
            <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>You hit the spot</span>
          </div>
        </div>

        {/* Q2 — Product ratings */}
        <div style={sectionStyle}>
          <label style={labelStyle}>What did you think of the product?</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {SUB_CATEGORIES.map(cat => (
              <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.05rem', color: '#ffffff' }}>{cat}</span>
                <StarRating value={subRatings[cat]} onChange={v => setSubRatings(prev => ({ ...prev, [cat]: v }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Q3 — Enjoyed most */}
        <div style={sectionStyle}>
          <label style={labelStyle}>What did you enjoy most about your experience with Hidden Ivory?</label>
          <textarea
            value={enjoyedMost}
            onChange={e => setEnjoyedMost(e.target.value)}
            placeholder="Share what stood out to you..."
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#5e4018'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(94,64,24,0.3)'}
          />
        </div>

        {/* Q4 — Done better */}
        <div style={sectionStyle}>
          <label style={labelStyle}>What could we have done better?</label>
          <textarea
            value={doneBetter}
            onChange={e => setDoneBetter(e.target.value)}
            placeholder="We genuinely want to know..."
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#5e4018'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(94,64,24,0.3)'}
          />
        </div>

        {/* Q5 — Buying process */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Was there anything about the buying process that could have been easier?</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {PROCESS_OPTIONS.map(option => {
              const selected = processIssues.includes(option);
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => toggleProcess(option)}
                  style={{
                    background: selected ? '#5e4018' : 'transparent',
                    border: `1px solid ${selected ? '#5e4018' : 'rgba(94,64,24,0.3)'}`,
                    color: selected ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    fontFamily: '"Cormorant Garamond",serif',
                    fontSize: '0.95rem',
                    padding: '0.6rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {processIssues.includes('Other') && (
            <textarea
              value={otherProcess}
              onChange={e => setOtherProcess(e.target.value)}
              placeholder="Please explain..."
              style={{ ...inputStyle, minHeight: 80, marginTop: '1rem' }}
              onFocus={e => e.currentTarget.style.borderColor = '#5e4018'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(94,64,24,0.3)'}
            />
          )}
        </div>

        {/* Q6 — Change one thing */}
        <div style={sectionStyle}>
          <label style={labelStyle}>If you could change one thing about the product, what would it be?</label>
          <textarea
            value={changeProduct}
            onChange={e => setChangeProduct(e.target.value)}
            placeholder="One thing..."
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#5e4018'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(94,64,24,0.3)'}
          />
        </div>

        {/* Q7 — Purchase again */}
        <div style={sectionStyle}>
          <label style={labelStyle}>What would make you want to purchase from us again?</label>
          <textarea
            value={purchaseAgain}
            onChange={e => setPurchaseAgain(e.target.value)}
            placeholder="What would bring you back..."
            style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = '#5e4018'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(94,64,24,0.3)'}
          />
        </div>

        {/* Hidden Ivory Question — stands out */}
        <div style={{ background: 'rgba(94,64,24,0.06)', border: '1px solid rgba(94,64,24,0.2)', padding: '2.5rem 2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: 'linear-gradient(90deg, transparent, #5e4018, transparent)' }} />
          <label style={{ ...labelStyle, color: '#e5b876', fontSize: '0.85rem', letterSpacing: '0.25em' }}>
            You were looking for something when you found us. What was it?
          </label>
          <textarea
            value={lookingFor}
            onChange={e => setLookingFor(e.target.value)}
            placeholder="What were you searching for..."
            style={{ ...inputStyle, minHeight: 100 }}
            onFocus={e => e.currentTarget.style.borderColor = '#5e4018'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(94,64,24,0.3)'}
          />
        </div>

        {error && (
          <p style={{ color: '#ff6b6b', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</p>
        )}

        {/* Submit */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn-gold"
            style={{ justifyContent: 'center', opacity: submitting ? 0.6 : 1 }}
          >
            <span>{submitting ? 'Sending...' : 'Share Your Experience'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
