import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { products as staticProducts } from './products';
import type { Product } from './products';

function mapRow(row: Record<string, unknown>): Product {
  return {
    id:          row.id as string,
    name:        row.name as string,
    price:       row.price as number,
    images:      row.images as string[],
    description: row.description as string,
    details:     row.details as string[],
    category:    row.category as string,
    sizes:       (row.sizes as string[] | null) ?? undefined,
    inStock:     row.in_stock as boolean,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    supabase.from('products').select('*')
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) {
          setError(error?.message ?? null);
        } else {
          setProducts(data.map(mapRow));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error) { setError(error.message); }
        else if (data) { setProduct(mapRow(data as Record<string, unknown>)); }
        setLoading(false);
      });
  }, [id]);

  return { product, loading, error };
}
