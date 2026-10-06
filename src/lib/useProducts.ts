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

let globalProductsCache: Product[] | null = null;
let globalProductsPromise: Promise<Product[]> | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(globalProductsCache || staticProducts);
  const [loading,  setLoading]  = useState(!globalProductsCache);
  const [error,    setError]    = useState<string | null>(null);

  const fetchProducts = (force = false) => {
    if (globalProductsCache && !force) {
      setProducts(globalProductsCache);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (!globalProductsPromise || force) {
      globalProductsPromise = (async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (error || !data || data.length === 0) {
          throw new Error(error?.message ?? 'No products found');
        }
        const mapped = data.map(mapRow);
        globalProductsCache = mapped;
        return mapped;
      })();
    }

    globalProductsPromise
      .then((mapped) => {
        setProducts(mapped);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refresh: () => fetchProducts(true) };
}

export function useProduct(id: string) {
  const cachedMatch = globalProductsCache?.find(p => p.id === id) || staticProducts.find(p => p.id === id) || null;
  const [product, setProduct] = useState<Product | null>(cachedMatch);
  const [loading, setLoading] = useState(!cachedMatch);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (cachedMatch) {
      setProduct(cachedMatch);
      setLoading(false);
      return;
    }

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
  }, [id, cachedMatch]);

  return { product, loading, error };
}
