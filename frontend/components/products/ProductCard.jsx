'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Star, Tag } from 'lucide-react';
import clsx from 'clsx';

export default function ProductCard({ product, compact = false, showTryOn = false, showCode = false }) {
  const imageUrl = product.images?.[0]?.url || `https://picsum.photos/seed/${product.id || 'saree'}/300/400`;
  const price = Number(product.price).toLocaleString('en-IN');
  const discountPrice = product.discount_price ? Number(product.discount_price).toLocaleString('en-IN') : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={clsx(
        'glass rounded-2xl overflow-hidden transition-shadow hover:shadow-xl hover:shadow-yellow-500/10',
        compact ? 'text-sm' : ''
      )}
    >
      <Link href={`/products/${product.id}`}>
        <div className={clsx('relative overflow-hidden', compact ? 'h-40' : 'h-64')}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Match score badge */}
          {product.match_score && (
            <div className="absolute top-2 right-2 glass-gold rounded-full px-2 py-0.5 text-xs font-semibold text-yellow-400">
              {Math.round(product.match_score * 100)}% match
            </div>
          )}
          {/* Stock badge */}
          {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
            <div className="absolute top-2 left-2 bg-red-500/90 rounded-full px-2 py-0.5 text-xs text-white">
              Only {product.stock_quantity} left
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        {showCode && (
          <div className="flex items-center gap-1 mb-1">
            <Tag className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-mono font-semibold">{product.product_code}</span>
          </div>
        )}

        <Link href={`/products/${product.id}`}>
          <h3 className={clsx('font-semibold text-white leading-tight truncate', compact ? 'text-xs' : 'text-sm')}>
            {product.name}
          </h3>
        </Link>

        <p className="text-slate-500 text-xs capitalize mt-0.5">{product.fabric}</p>

        <div className="flex items-center justify-between mt-2">
          <div>
            <span className={clsx('font-bold text-gradient-gold', compact ? 'text-sm' : 'text-base')}>₹{price}</span>
            {discountPrice && (
              <span className="text-slate-600 text-xs line-through ml-1">₹{discountPrice}</span>
            )}
          </div>
          {product.explanation && (
            <span className="text-slate-600 text-xs max-w-[100px] truncate">{product.explanation.replace('Recommended because: ', '')}</span>
          )}
        </div>

        {showTryOn && (
          <Link
            href={`/tryon?product=${product.id}`}
            className="flex items-center justify-center gap-1.5 w-full mt-2 glass-gold text-yellow-400 text-xs py-1.5 rounded-lg hover:bg-yellow-400/20 transition-all"
          >
            <Camera className="w-3 h-3" />
            Try On
          </Link>
        )}
      </div>
    </motion.div>
  );
}
