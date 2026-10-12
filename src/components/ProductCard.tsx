import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../lib/products';
import type { ProductGroup } from '../lib/productGrouping';

interface ProductCardProps {
  product: Product;
  group?: ProductGroup;
  priority?: boolean;
}

export default function ProductCard({ product, group, priority = false }: ProductCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const hasVariants = Boolean(group && group.hasMultipleColors && group.variants.length > 1);
  const currentProduct = hasVariants && group ? group.variants[activeIdx].product : product;
  const displayName = hasVariants && group ? group.baseName : product.name;

  return (
    <Link to={`/shop/${currentProduct.id}`} className="product-card">
      <div className="card-image">
        <img
          src={currentProduct.images[0]}
          alt={displayName}
          loading={priority ? 'eager' : 'lazy'}
        />
        <div className="card-overlay" />
        <div className="card-view-label">View Item</div>
      </div>
      <div className="card-gold-bar" />
      <div className="card-info">
        {/* Color swatches if multiple variants exist */}
        {hasVariants && group && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '0.4rem',
            }}
            onClick={e => e.preventDefault()}
          >
            {group.variants.map((v, i) => {
              const isSelected = i === activeIdx;
              return (
                <button
                  key={v.product.id}
                  type="button"
                  title={`${v.colorName || 'Variant'} - ${v.product.name}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIdx(i);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: v.colorHex || '#333333',
                    border: isSelected ? '2px solid #000000' : '1px solid rgba(0,0,0,0.3)',
                    outline: isSelected ? '1px solid #e5b876' : 'none',
                    outlineOffset: 1,
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              );
            })}
          </div>
        )}
        <p className="card-name">{displayName}</p>
        <p className="card-price" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          R{currentProduct.price.toLocaleString('en-US')}
        </p>
      </div>
    </Link>
  );
}
