'use client';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { SAMPLE_PRODUCTS } from '@/lib/utils';

export function useProducts(filters = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
        const res = await productApi.list(filters);
        return res.data;
      } catch {
        // Demo fallback
        let products = SAMPLE_PRODUCTS;
        if (filters.fabric) products = products.filter((p) => p.fabric === filters.fabric);
        if (filters.max_price) products = products.filter((p) => p.price <= filters.max_price);
        if (filters.query) products = products.filter((p) => p.name.toLowerCase().includes(filters.query.toLowerCase()));
        return { products, total: products.length, page: 1, page_size: 20, pages: 1 };
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
}

export function useProduct(id) {
  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const res = await productApi.getById(id);
        return res.data;
      } catch {
        return SAMPLE_PRODUCTS.find((p) => p.id === id) || SAMPLE_PRODUCTS[0];
      }
    },
    enabled: !!id,
  });
  return { product: data, isLoading };
}

export function useAdminStats() {
  // Returns mock stats in demo mode
  return {
    stats: {
      total_revenue: 428500,
      active_products: 284,
      ai_sessions_today: 1247,
      tryon_count: 342,
    },
    isLoading: false,
  };
}
