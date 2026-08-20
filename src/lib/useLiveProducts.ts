import { useEffect, useState } from 'react';
import { Product } from '@/types/database';
import { initialProducts } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

export function useLiveProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const activeProducts = data.filter((p: Product) => p.is_published !== false);
          if (isMounted && activeProducts.length > 0) {
            setProducts(activeProducts as Product[]);
          }
        }
      } catch (err) {
        console.error('Error fetching live products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading };
}
