import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Props {
  productId: string;
  onUploaded: (url: string) => void;
}

export default function ImageUploader({ productId, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `${productId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      onUploaded(data.publicUrl);
    }
    setUploading(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) uploadFile(files[0]);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      style={{
        border: `1.5px dashed ${dragOver ? '#e5b876' : 'rgba(229,184,118,0.3)'}`,
        borderRadius: 8, padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
        transition: 'border-color 0.3s ease, background 0.3s ease',
        background: dragOver ? 'rgba(229,184,118,0.05)' : 'transparent',
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
      {uploading ? (
        <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#e5b876' }}>Uploading…</p>
      ) : (
        <>
          <p style={{ fontFamily: '"Cormorant SC",serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: '#e5b876', marginBottom: '0.25rem' }}>Upload Image</p>
          <p style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Click or drag & drop</p>
        </>
      )}
    </div>
  );
}
