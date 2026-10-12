import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/products';
import { mapRow } from '../../lib/useProducts';
import {
  PRESET_COLORS,
  parseColor,
  formatColor,
  getColorHex,
  extractProductColorAndBaseName,
} from '../../lib/productGrouping';
import ImageUploader from './ImageUploader';

interface Props {
  product: Product;
  onSaved: (updated: Product) => void;
  onClose: () => void;
}

export default function ProductEditor({ product, onSaved, onClose }: Props) {
  // Extract initial color if present or detected from name
  const getInitialColor = (p: Product) => {
    if (p.colors && p.colors.length > 0) {
      return parseColor(p.colors[0]);
    }
    const detected = extractProductColorAndBaseName(p, PRESET_COLORS.map(c => c.name));
    if (detected.hasColorPrefix && detected.color.name) {
      return detected.color;
    }
    return { name: '', hex: '#18181b' };
  };

  const initialColor = getInitialColor(product);

  const [form, setForm] = useState({
    name:        product.name,
    price:       product.price.toString(),
    description: product.description,
    category:    product.category,
    details:     product.details.join('\n'),
    sizes:       (product.sizes ?? []).join(', '),
    colorName:   initialColor.name,
    colorHex:    initialColor.hex,
    sortOrder:   (product.sortOrder !== undefined && product.sortOrder !== null ? product.sortOrder : 0).toString(),
    inStock:     product.inStock,
    images:      [...product.images],
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const c = getInitialColor(product);
    setForm({
      name:        product.name,
      price:       product.price.toString(),
      description: product.description,
      category:    product.category,
      details:     product.details.join('\n'),
      sizes:       (product.sizes ?? []).join(', '),
      colorName:   c.name,
      colorHex:    c.hex,
      sortOrder:   (product.sortOrder !== undefined && product.sortOrder !== null ? product.sortOrder : 0).toString(),
      inStock:     product.inStock,
      images:      [...product.images],
    });
  }, [product.id]);

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSelectPresetColor = (name: string, hex: string) => {
    setForm(f => ({
      ...f,
      colorName: name,
      colorHex: hex,
    }));
  };

  const handleClearColor = () => {
    setForm(f => ({
      ...f,
      colorName: '',
      colorHex: '#18181b',
    }));
  };

  const save = async () => {
    setSaving(true);
    setMsg('');

    // Prepare colors array
    let colorsToSave: string[] | null = null;
    if (form.colorName.trim()) {
      colorsToSave = [formatColor(form.colorName, form.colorHex)];
    }

    const sortOrderInt = parseInt(form.sortOrder, 10);

    const { data, error } = await supabase.from('products').upsert({
      id:          product.id,
      name:        form.name.trim(),
      price:       parseFloat(form.price) || 0,
      description: form.description,
      category:    form.category,
      details:     form.details.split('\n').map(s => s.trim()).filter(Boolean),
      sizes:       form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : null,
      colors:      colorsToSave,
      sort_order:  isNaN(sortOrderInt) ? 0 : sortOrderInt,
      in_stock:    form.inStock,
      images:      form.images,
    }).select().single();

    setSaving(false);
    if (error) {
      setMsg('Error: ' + error.message);
    } else {
      setMsg(product.id === data.id ? 'Saved!' : 'Product created!');
      const updatedProduct = mapRow(data as Record<string, unknown>);
      onSaved(updatedProduct);
      setTimeout(() => setMsg(''), 2000);
    }
  };

  const removeImage = (idx: number) => set('images', form.images.filter((_, i) => i !== idx));
  const addImage = (url: string) => set('images', [...form.images, url]);

  const label: React.CSSProperties = {
    fontFamily: '"Cormorant SC",serif',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#e5b876',
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 600,
  };

  const input: React.CSSProperties = {
    width: '100%',
    background: '#141414',
    border: '1px solid rgba(229,184,118,0.25)',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '0.95rem',
    padding: '0.65rem 0.8rem',
    outline: 'none',
    borderRadius: 4,
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ width: '100%', maxWidth: 540, background: '#0a0a0a', borderLeft: '1px solid rgba(229,184,118,0.15)', overflowY: 'auto', padding: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', borderBottom: '1px solid rgba(229,184,118,0.15)', paddingBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant SC",serif', fontSize: '1.1rem', letterSpacing: '0.15em', color: '#e5b876', textTransform: 'uppercase', margin: 0 }}>
              Edit Product
            </h2>
            <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem', margin: 0 }}>
              Distinct product variant in database
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '1.75rem', lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {/* Images */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={label}>Product Images</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {form.images.map((url, i) => (
              <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#e5b876',
                    border: 'none',
                    color: '#000',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <ImageUploader productId={product.id} onUploaded={addImage} />
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={label}>Product Name</label>
            <input
              style={input}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Metallic Du-Rag, Velvet Du-Rag"
            />
            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', display: 'block', marginTop: '0.35rem' }}>
              Tip: Products starting with a color (e.g. "Metallic Du-Rag" & "Velvet Du-Rag") automatically group into "Du-Rag" in the shop!
            </span>
          </div>

          {/* Color Section with Solid Color Blocks */}
          <div style={{ background: '#111111', border: '1px solid rgba(229,184,118,0.15)', borderRadius: 6, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ ...label, marginBottom: 0 }}>Product Colour / Swatch</label>
              {form.colorName && (
                <button
                  type="button"
                  onClick={handleClearColor}
                  style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.75rem', fontFamily: 'system-ui, -apple-system, sans-serif', cursor: 'pointer', padding: 0 }}
                >
                  Clear Colour
                </button>
              )}
            </div>

            {/* Current Selected Color Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', background: '#181818', padding: '0.6rem 0.75rem', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: form.colorName ? form.colorHex : 'transparent',
                  border: form.colorName ? '2px solid #e5b876' : '1px dashed rgba(255,255,255,0.3)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
                  display: 'inline-block',
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, margin: 0 }}>
                  {form.colorName ? form.colorName : 'No Colour Assigned'}
                </p>
                {form.colorName && (
                  <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    Hex: {form.colorHex.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Preset Color Swatch Blocks */}
            <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e5b876', marginBottom: '0.5rem' }}>
              Select Colour Block:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
              {PRESET_COLORS.map(c => {
                const isSelected = form.colorName.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSelectPresetColor(c.name, c.hex)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      background: isSelected ? 'rgba(229,184,118,0.15)' : '#1a1a1a',
                      border: isSelected ? '2px solid #e5b876' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      padding: '0.5rem 0.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        backgroundColor: c.hex,
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
                    />
                    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.7rem', color: isSelected ? '#e5b876' : '#ffffff', fontWeight: isSelected ? 700 : 400 }}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Colour inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center' }}>
              <div>
                <input
                  style={input}
                  value={form.colorName}
                  onChange={e => {
                    const name = e.target.value;
                    setForm(f => ({ ...f, colorName: name, colorHex: getColorHex(name) || f.colorHex }));
                  }}
                  placeholder="Custom name (e.g. Silk Silver)"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="color"
                  value={form.colorHex.startsWith('#') ? form.colorHex : '#18181b'}
                  onChange={e => set('colorHex', e.target.value)}
                  style={{ width: 40, height: 38, border: '1px solid rgba(229,184,118,0.3)', borderRadius: 4, background: '#141414', cursor: 'pointer', padding: 2 }}
                  title="Pick custom hex color"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={label}>Price (ZAR)</label>
              <input
                style={input}
                type="number"
                value={form.price}
                onChange={e => set('price', e.target.value)}
              />
            </div>
            <div>
              <label style={label}>Sort Order</label>
              <input
                style={input}
                type="number"
                value={form.sortOrder}
                onChange={e => set('sortOrder', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label style={label}>Category</label>
            <select
              style={input}
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {['tops', 'bottoms', 'outerwear', 'accessories'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={label}>Description</label>
            <textarea
              style={{ ...input, minHeight: 80, resize: 'vertical' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div>
            <label style={label}>Details (one per line)</label>
            <textarea
              style={{ ...input, minHeight: 90, resize: 'vertical' }}
              value={form.details}
              onChange={e => set('details', e.target.value)}
            />
          </div>

          <div>
            <label style={label}>Sizes (comma-separated, leave blank for One Size)</label>
            <input
              style={input}
              value={form.sizes}
              onChange={e => set('sizes', e.target.value)}
              placeholder="XS, S, M, L, XL"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <label style={{ ...label, margin: 0 }}>In Stock</label>
            <button
              type="button"
              onClick={() => set('inStock', !form.inStock)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: form.inStock ? '#e5b876' : '#333',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: form.inStock ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#ffffff',
                  transition: 'left 0.3s ease',
                }}
              />
            </button>
          </div>
        </div>

        {/* Save */}
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(229,184,118,0.15)', paddingTop: '1.25rem' }}>
          <button
            onClick={save}
            disabled={saving}
            style={{
              background: '#e5b876',
              color: '#000000',
              border: 'none',
              fontFamily: '"Cormorant SC",serif',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 700,
              padding: '0.75rem 1.75rem',
              cursor: saving ? 'wait' : 'pointer',
              borderRadius: 4,
              opacity: saving ? 0.7 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {msg && (
            <p
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '0.9rem',
                color: msg.startsWith('Error') ? '#ff6b6b' : '#4caf82',
                margin: 0,
                fontWeight: 600,
              }}
            >
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
