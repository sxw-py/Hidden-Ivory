import { useState, useRef, useEffect } from 'react';

interface CarouselProps { images: string[]; alt: string; }

export default function Carousel({ images, alt }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const dragStart = useRef(0);
  const total = images.length;
  const goTo = (i: number) => setCurrent((i + total) % total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key==='ArrowLeft') goTo(current-1); if (e.key==='ArrowRight') goTo(current+1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current]);



  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
      {/* Main image */}
      <div
        style={{ aspectRatio:'3/4', background:'#000000', position:'relative', overflow:'hidden', cursor:'grab', userSelect:'none', borderRadius: 24 }}
        onTouchStart={e => { dragStart.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const d = e.changedTouches[0].clientX - dragStart.current; if (Math.abs(d)>40) d<0?goTo(current+1):goTo(current-1); }}
        onMouseDown={e => { dragStart.current = e.clientX; }}
        onMouseUp={e => { const d = e.clientX - dragStart.current; if (Math.abs(d)>40) d<0?goTo(current+1):goTo(current-1); }}
      >
        {images.map((src, i) => (
          <div key={i} style={{ position:'absolute', inset:0, opacity: i===current?1:0, transition:'opacity 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
            <img src={src} alt={`${alt} — view ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} draggable={false} />
          </div>
        ))}

        {/* Arrows */}
        {total > 1 && <>
          <button onClick={() => goTo(current-1)} aria-label="Previous" style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(229,184,118,0.2)', color:'#ffffff', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.25s ease', zIndex:2 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(229,184,118,0.9)'; (e.currentTarget as HTMLElement).style.color='#000000'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0.6)'; (e.currentTarget as HTMLElement).style.color='#ffffff'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => goTo(current+1)} aria-label="Next" style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(229,184,118,0.2)', color:'#ffffff', width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.25s ease', zIndex:2 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(229,184,118,0.9)'; (e.currentTarget as HTMLElement).style.color='#000000'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0.6)'; (e.currentTarget as HTMLElement).style.color='#ffffff'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>}

        {/* Counter */}
        <div style={{ position:'absolute', bottom:'0.75rem', right:'0.75rem', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', color:'#ffffff', fontFamily:'"Cormorant SC",serif', fontSize:'0.7rem', letterSpacing:'0.1em', padding:'3px 8px', zIndex:2, borderRadius: 12 }}>
          {current+1} / {total}
        </div>
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {images.map((src, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`View ${i+1}`}
              style={{ flex:1, aspectRatio:'1', position:'relative', cursor:'pointer', border: i===current?'2px solid #e5b876':'2px solid transparent', padding:0, background:'#000000', borderRadius: 8, transition:'border-color 0.3s ease, opacity 0.3s ease', opacity: i===current?1:0.5, overflow:'hidden', maxWidth:80 }}>
              <img src={src} alt={`${alt} ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            </button>
          ))}
        </div>
      )}

      {/* Dots */}
      {total > 1 && (
        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center' }}>
          {images.map((_,i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i+1}`} className={`carousel-dot${i===current?' active':''}`} />
          ))}
        </div>
      )}
    </div>
  );
}
