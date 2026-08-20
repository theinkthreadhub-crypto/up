import { useEffect, useState } from 'react';
import { Product } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

export function useLiveProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbError) {
          if (isMounted) setError(dbError.message);
        } else if (data) {
          const activeProducts = (data as Product[]).filter((p) => p.is_published !== false);
          if (isMounted) {
            setProducts(activeProducts);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error fetching live products');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}

