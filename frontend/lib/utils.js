import clsx from 'clsx';

export function cn(...args) {
  return clsx(...args);
}

export function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export function truncate(str, n = 60) {
  return str?.length > n ? str.slice(0, n) + '…' : str;
}

export function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Debounce utility for search inputs
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Generate a placeholder image URL for products
export function productImageUrl(productId, seed) {
  return `https://picsum.photos/seed/${seed || productId}/400/550`;
}

// 30 sample products for demo/dev mode (no backend required)
export const SAMPLE_PRODUCTS = Array.from({ length: 30 }, (_, i) => ({
  id: `demo-${i + 1}`,
  product_code: `KSK${String(i + 1).padStart(3, '0')}`,
  name: [
    'Kanjivaram Silk Saree', 'Banarasi Gold Zari', 'Chiffon Floral', 'Georgette Embroidered',
    'Paithani Peacock', 'Cotton Handloom', 'Organza Pastels', 'Linen Checks',
    'Chanderi Silk', 'Bandhani Print',
  ][i % 10],
  fabric: ['silk', 'banarasi', 'chiffon', 'georgette', 'cotton', 'linen', 'organza', 'chanderi'][i % 8],
  price: [1200, 2800, 4500, 6800, 9200, 12500, 3400, 7800, 15000, 2100][i % 10],
  discount_price: i % 3 === 0 ? [1000, 2500, 4000, 6000][i % 4] : null,
  stock_quantity: Math.floor(Math.random() * 25) + 1,
  color: [['red', 'gold'], ['green', 'silver'], ['pink', 'white'], ['blue', 'gold']][i % 4],
  occasion_tags: [['wedding', 'festive'], ['party'], ['casual'], ['religious']][i % 4],
  embroidery_type: [['zari'], ['thread'], ['sequin'], ['none']][i % 4],
  regional_style: ['kanjivaram', 'banarasi', 'paithani', 'bandhani', 'phulkari'][i % 5],
  description: 'Handcrafted with love by artisan weavers. Perfect for special occasions.',
  blouse_included: i % 2 === 0,
  images: [{ url: `https://picsum.photos/seed/saree${i + 1}/400/550`, angle: 'front', is_primary: true }],
  trending_score: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2)),
  match_score: null,
  explanation: null,
}));
