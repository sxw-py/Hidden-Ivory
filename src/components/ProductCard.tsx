import { Link } from 'react-router-dom';
import type { Product } from '../lib/products';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link to={`/shop/${product.id}`} className="product-card">
      <div className="card-image">
        <img src={product.images[0]} alt={product.name} loading={priority ? 'eager' : 'lazy'} />
        <div className="card-overlay" />
        <div className="card-view-label">View Item</div>
      </div>
      <div className="card-gold-bar" />
      <div className="card-info">
        <p className="card-name">{product.name}</p>
        <p className="card-price">R{product.price.toLocaleString('en-US')}</p>
      </div>
    </Link>
  );
}
