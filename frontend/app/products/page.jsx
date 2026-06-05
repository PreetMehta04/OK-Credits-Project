'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Camera } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { useProducts } from '@/hooks/useRecommendations';

export default function ProductsPage() {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { products, isLoading, total } = useProducts({ ...filters, query: searchQuery });

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Explore Collection</h1>
            <p className="text-slate-400 mt-1">{total ? `${total} sarees and ethnic wear` : 'Loading...'}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass pl-9 pr-4 py-2.5 rounded-full text-sm text-white placeholder-slate-500 outline-none border border-white/10 focus:border-yellow-400/50 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 glass px-4 py-2.5 rounded-full text-sm transition-all ${
                showFilters ? 'text-yellow-400 border-yellow-400/50' : 'text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </motion.div>
          )}

          {/* Product grid */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="glass rounded-2xl h-72 shimmer-bg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center text-slate-500">
                <p className="text-xl mb-2">No products found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
