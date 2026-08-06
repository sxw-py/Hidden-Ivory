import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/products';
import ImageUploader from './ImageUploader';

interface Props {
  product: Product;
  onSaved: (updated: Product) => void;
  onClose: () => void;
}

export default function ProductEditor({ product, onSaved, onClose }: Props) {
  const [form, setForm] = useState({
    name:        product.name,
    price:       product.price.toString(),
    description: product.description,
    category:    product.category,
    details:     product.details.join('\n'),
    sizes:       (product.sizes ?? []).join(', '),
    inStock:     product.inStock,
    images:      [...product.images],
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setForm({
      name:        product.name,
      price:       product.price.toString(),
      description: product.description,
      category:    product.category,
      details:     product.details.join('\n'),
      sizes:       (product.sizes ?? []).join(', '),
      inStock:     product.inStock,
      images:      [...product.images],
    });
  }, [product.id]);

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    setMsg('');
    const { error } = await supabase.from('products').update({
      name:        form.name,
      price:       parseFloat(form.price),
      description: form.description,
      category:    form.category,
      details:     form.details.split('\n').map(s => s.trim()).filter(Boolean),
      sizes:       form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : null,
      in_stock:    form.inStock,
      images:      form.images,
    }).eq('id', product.id);

    setSaving(false);
    if (error) { setMsg('Error: ' + error.message); }
    else {
      setMsg('Saved!');
      onSaved({ ...product, ...form, price: parseFloat(form.price), details: form.details.split('\n').filter(Boolean), sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : undefined, images: form.images });
      setTimeout(() => setMsg(''), 2000);
    }
  };

  const removeImage = (idx: number) => set('images', form.images.filter((_, i) => i !== idx));
  const addImage = (url: string) => set('images', [...form.images, url]);

  const label: React.CSSProperties = { fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e5b876', display: 'block', marginBottom: '0.4rem' };
  const input: React.CSSProperties = { width: '100%', background: '#1a1a1a', border: '1px solid rgba(229,184,118,0.2)', color: '#ffffff', fontFamily: '"Cormorant Garamond",serif', fontSize: '1rem', padding: '0.6rem 0.75rem', outline: 'none', borderRadius: 4, boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: 520, background: '#0a0a0a', borderLeft: '1px solid rgba(229,184,118,0.15)', overflowY: 'auto', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid rgba(229,184,118,0.12)', paddingBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1rem', letterSpacing: '0.15em', color: '#e5b876', textTransform: 'uppercase' }}>Edit Product</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
        </div>

        {/* Images */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={label}>Images</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {form.images.map((url, i) => (
              <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                <button onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#e5b876', border: 'none', color: '#000', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
          </div>
          <ImageUploader productId={product.id} onUploaded={addImage} />
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={label}>Name</label>
            <input style={input} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label style={label}>Price (ZAR)</label>
            <input style={input} type="number" value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          <div>
            <label style={label}>Category</label>
            <select style={input} value={form.category} onChange={e => set('category', e.target.value)}>
              {['tops', 'bottoms', 'outerwear', 'accessories'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Description</label>
            <textarea style={{ ...input, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <label style={label}>Details (one per line)</label>
            <textarea style={{ ...input, minHeight: 100, resize: 'vertical' }} value={form.details} onChange={e => set('details', e.target.value)} />
          </div>
          <div>
            <label style={label}>Sizes (comma-separated, leave blank if N/A)</label>
            <input style={input} value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="XS, S, M, L, XL" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ ...label, margin: 0 }}>In Stock</label>
            <button onClick={() => set('inStock', !form.inStock)}
              style={{ width: 44, height: 24, borderRadius: 12, background: form.inStock ? '#e5b876' : '#333', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s ease' }}>
              <span style={{ position: 'absolute', top: 2, left: form.inStock ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#ffffff', transition: 'left 0.3s ease' }} />
            </button>
          </div>
        </div>

        {/* Save */}
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={save} disabled={saving}
            style={{ background: '#e5b876', color: '#000000', border: 'none', fontFamily: '"Cormorant SC",serif', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.75rem 1.75rem', cursor: saving ? 'wait' : 'pointer', borderRadius: 4, opacity: saving ? 0.7 : 1, transition: 'opacity 0.3s' }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {msg && <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.9rem', color: msg.startsWith('Error') ? '#ff6b6b' : '#4caf82' }}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}
