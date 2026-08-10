import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { products as staticProducts } from './products';
import type { Product } from './products';

function mapRow(row: Record<string, unknown>): Product {
  return {
    id:          row.id as string,
    name:        row.name as string,
    price:       row.price as number,
    images:      (row.images as string[]) || [],
    description: row.description as string,
    details:     (row.details as string[]) || [],
    category:    row.category as string,
    sizes:       (row.sizes as string[] | null) ?? undefined,
    inStock:     row.in_stock as boolean,
    isFeatured:  (row.is_featured as boolean) ?? false,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    supabase.from('products').select('*')
      .then(
        ({ data, error }) => {
          if (error || !data || data.length === 0) {
            setError(error?.message ?? null);
          } else {
            setProducts(data.map(mapRow));
          }
          setLoading(false);
        },
        () => setLoading(false)
      );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refresh: fetchProducts };
}

export function useProduct(id: string) {
  const staticMatch = staticProducts.find(p => p.id === id) ?? null;
  const [product, setProduct] = useState<Product | null>(staticMatch);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single()
      .then(
        ({ data, error }) => {
          if (error || !data) {
            setError(error?.message ?? null);
          } else {
            setProduct(mapRow(data as Record<string, unknown>));
          }
          setLoading(false);
        },
        () => setLoading(false)
      );
  }, [id]);

  return { product, loading, error };
}
