'use client';
import { useQuery } from '@tanstack/react-query';
import { productApi, analyticsApi } from '@/lib/api';
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

export function useAdminStats(days = 30) {
  const salesQuery = useQuery({
    queryKey: ['adminSales', days],
    queryFn: async () => {
      const res = await analyticsApi.sales(days);
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  const aiQuery = useQuery({
    queryKey: ['adminAiUsage', days],
    queryFn: async () => {
      const res = await analyticsApi.aiUsage(days);
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  const productsQuery = useQuery({
    queryKey: ['adminProductsCount'],
    queryFn: async () => {
      const res = await productApi.list({ page_size: 1 });
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const isLoading = salesQuery.isLoading || aiQuery.isLoading || productsQuery.isLoading;

  return {
    stats: {
      total_revenue: salesQuery.data?.total_sales ?? 0,
      active_products: productsQuery.data?.total ?? 0,
      ai_sessions_today: aiQuery.data?.chat_sessions ?? 0,
      tryon_count: aiQuery.data?.tryon_requests ?? 0,
    },
    isLoading,
  };
}

export function useLowStock(threshold = 5) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lowStock', threshold],
    queryFn: async () => {
      try {
        const res = await productApi.lowStock(threshold);
        return res.data;
      } catch {
        // Fallback mock low stock products for demo/offline mode
        return [
          { product_code: 'KSK012', name: 'Kanjivaram Ruby Red', fabric: 'silk', stock_quantity: 2 },
          { product_code: 'BNR089', name: 'Banarasi Gold Zari', fabric: 'banarasi', stock_quantity: 3 },
          { product_code: 'CHF045', name: 'Chiffon Rose Pink', fabric: 'chiffon', stock_quantity: 1 },
        ];
      }
    },
    staleTime: 30 * 1000,
  });

  return {
    products: data || [],
    isLoading,
    error,
  };
}
