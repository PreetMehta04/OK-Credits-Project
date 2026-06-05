'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Star, Tag, Layers, MapPin, ShoppingBag, ChevronLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useProduct } from '@/hooks/useRecommendations';

export default function ProductDetailPage({ params }) {
  const { product, isLoading } = useProduct(params.id);
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="glass rounded-2xl p-12 text-center text-slate-400 animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (!product) return <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center text-slate-400">Product not found</div>;

  const images = product.images?.length
    ? product.images
    : [{ url: `https://picsum.photos/seed/${product.id}/600/800`, angle: 'front', is_primary: true }];

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/products" className="flex items-center gap-1 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            <motion.div className="glass rounded-2xl overflow-hidden aspect-[3/4] relative" layoutId={`product-${product.id}`}>
              <Image src={images[activeImg]?.url} alt={product.name} fill className="object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImg ? 'border-yellow-400' : 'border-transparent'
                    }`}
                  >
                    <Image src={img.url} alt={`View ${i + 1}`} width={64} height={80} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs text-yellow-400 uppercase tracking-widest font-semibold">{product.fabric}</span>
                <h1 className="font-display text-3xl font-bold text-white mt-1">{product.name}</h1>
              </div>
              <div className="glass rounded-xl p-2">
                <QRCodeSVG value={product.product_code} size={64} bgColor="transparent" fgColor="#D4AF37" />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="font-bold text-3xl text-gradient-gold">₹{Number(product.price).toLocaleString()}</span>
              {product.discount_price && (
                <span className="text-slate-500 line-through text-lg">₹{Number(product.discount_price).toLocaleString()}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 text-sm font-mono font-semibold tracking-wider">{product.product_code}</span>
            </div>

            {product.regional_style && (
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm capitalize">{product.regional_style} style</span>
              </div>
            )}

            {/* Tags */}
            {product.occasion_tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.occasion_tags.map((tag) => (
                  <span key={tag} className="glass px-3 py-1 rounded-full text-xs text-yellow-400 capitalize">{tag}</span>
                ))}
              </div>
            )}

            {product.description && (
              <p className="text-slate-400 text-sm leading-relaxed mb-6 border-t border-white/10 pt-4">{product.description}</p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 5 ? 'bg-green-400' : product.stock_quantity > 0 ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span className="text-sm text-slate-400">
                {product.stock_quantity > 5 ? 'In Stock' : product.stock_quantity > 0 ? `Only ${product.stock_quantity} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href={`/tryon?product=${product.id}`} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                <Camera className="w-4 h-4" />
                Virtual Try-On
              </Link>
              <button className="btn-gold flex items-center gap-2 flex-1 justify-center">
                <ShoppingBag className="w-4 h-4" />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
