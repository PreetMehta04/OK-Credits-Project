'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Package, AlertTriangle, Sparkles, TrendingUp, Users, Upload, X } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAdminStats } from '@/hooks/useRecommendations';

const MOCK_SALES_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Jun ${i + 1}`,
  sales: Math.floor(Math.random() * 50000) + 10000,
  sessions: Math.floor(Math.random() * 200) + 50,
}));

const MOCK_CATEGORY_DATA = [
  { name: 'Silk', value: 38 },
  { name: 'Cotton', value: 25 },
  { name: 'Chiffon', value: 20 },
  { name: 'Georgette', value: 17 },
];

const PIE_COLORS = ['#D4AF37', '#FF6B35', '#4F46E5', '#10B981'];

const CATEGORIES = ['saree', 'lehenga', 'salwar', 'dupatta', 'blouse'];
const FABRICS = ['silk', 'cotton', 'chiffon', 'georgette', 'linen', 'banarasi', 'kanjivaram', 'chanderi', 'organza'];
const REGIONAL_STYLES = ['banarasi', 'kanjivaram', 'paithani', 'bandhani', 'phulkari', 'pochampally', 'chikankari', 'sambalpuri', 'kerala_kasavu', 'patola'];

const STAT_CARDS = [
  { label: 'Total Revenue', value: '₹4,28,500', change: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-400' },
  { label: 'Active Products', value: '284', change: '+8', icon: <Package className="w-5 h-5" />, color: 'text-blue-400' },
  { label: 'AI Sessions Today', value: '1,247', change: '+34%', icon: <Sparkles className="w-5 h-5" />, color: 'text-yellow-400' },
  { label: 'Try-On Count', value: '342', change: '+22%', icon: <Users className="w-5 h-5" />, color: 'text-pink-400' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('30');
  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  
  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    category: 'saree',
    fabric: 'silk',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    description: '',
    regionalStyle: '',
    blouseIncluded: false,
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleUploadProduct = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      setUploadError('Please select an image');
      return;
    }
    if (!formData.productCode || !formData.name || !formData.price) {
      setUploadError('Please fill in all required fields');
      return;
    }

    setUploadingProduct(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.image);
      formDataToSend.append('product_code', formData.productCode);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('fabric', formData.fabric);
      formDataToSend.append('price', formData.price);
      if (formData.discountPrice) formDataToSend.append('discount_price', formData.discountPrice);
      if (formData.stockQuantity) formDataToSend.append('stock_quantity', formData.stockQuantity);
      if (formData.description) formDataToSend.append('description', formData.description);
      if (formData.regionalStyle) formDataToSend.append('regional_style', formData.regionalStyle);
      formDataToSend.append('blouse_included', formData.blouseIncluded);

      const response = await fetch('http://localhost:8000/api/v1/admin/products/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload product');
      }

      const result = await response.json();
      setUploadSuccess(`✓ Product "${result.name}" added successfully!`);
      
      // Reset form
      setFormData({
        productCode: '',
        name: '',
        category: 'saree',
        fabric: 'silk',
        price: '',
        discountPrice: '',
        stockQuantity: '',
        description: '',
        regionalStyle: '',
        blouseIncluded: false,
        image: null,
      });
    } catch (error) {
      setUploadError(error.message || 'Failed to upload product');
    } finally {
      setUploadingProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with tabs */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-gold">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Store analytics and product management</p>
          </div>
          <div className="flex gap-2">
            {['dashboard', 'upload'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                    : 'glass text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'dashboard' ? 'Dashboard' : 'Upload Product'}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="glass px-4 py-2 rounded-xl text-sm text-white border border-white/10 outline-none"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {STAT_CARDS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="glass rounded-2xl p-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{stat.label}</p>
                  <p className="text-green-400 text-xs mt-1">{stat.change} vs last period</p>
                </motion.div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Sales trend */}
              <div className="lg:col-span-2 glass rounded-2xl p-6">
                <h2 className="font-semibold text-white mb-4">Sales & AI Session Trend</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={MOCK_SALES_DATA}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} interval={6} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="sales" stroke="#D4AF37" fill="url(#salesGrad)" strokeWidth={2} name="Revenue (₹)" />
                    <Area type="monotone" dataKey="sessions" stroke="#FF6B35" fill="none" strokeWidth={2} strokeDasharray="4 2" name="AI Sessions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category split */}
              <div className="glass rounded-2xl p-6">
                <h2 className="font-semibold text-white mb-4">By Category</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={MOCK_CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {MOCK_CATEGORY_DATA.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2">
                  {MOCK_CATEGORY_DATA.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-1 text-xs text-slate-400">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h2 className="font-semibold text-white">Low Stock Alerts</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/10">
                      <th className="text-left pb-2 font-medium">Product Code</th>
                      <th className="text-left pb-2 font-medium">Name</th>
                      <th className="text-left pb-2 font-medium">Fabric</th>
                      <th className="text-right pb-2 font-medium">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: 'KSK012', name: 'Kanjivaram Ruby Red', fabric: 'Silk', stock: 2 },
                      { code: 'BNR089', name: 'Banarasi Gold Zari', fabric: 'Banarasi', stock: 3 },
                      { code: 'CHF045', name: 'Chiffon Rose Pink', fabric: 'Chiffon', stock: 1 },
                    ].map((row) => (
                      <tr key={row.code} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 font-mono text-yellow-400">{row.code}</td>
                        <td className="py-3 text-white">{row.name}</td>
                        <td className="py-3 text-slate-400">{row.fabric}</td>
                        <td className="py-3 text-right">
                          <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                            {row.stock} left
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Upload Product tab */}
        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Add New Product</h2>
            </div>

            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-sm">✓</div>
                {uploadSuccess}
              </motion.div>
            )}

            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                {uploadError}
              </motion.div>
            )}

            <form onSubmit={handleUploadProduct} className="space-y-6">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Product Image *</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label
                    htmlFor="image-input"
                    className="block p-8 border-2 border-dashed border-yellow-400/30 rounded-xl hover:border-yellow-400/60 cursor-pointer transition-colors bg-yellow-400/5"
                  >
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-yellow-400/60 mx-auto mb-2" />
                      <p className="text-white font-medium">
                        {formData.image ? formData.image.name : 'Click to upload image'}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Product Code & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Product Code *</label>
                  <input
                    type="text"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleInputChange}
                    placeholder="e.g., KSK-2024-001"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-yellow-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Kanjivaram Silk Saree"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-yellow-400/50"
                  />
                </div>
              </div>

              {/* Category & Fabric */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-yellow-400/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fabric *</label>
                  <select
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-yellow-400/50"
                  >
                    {FABRICS.map(fab => (
                      <option key={fab} value={fab}>{fab.charAt(0).toUpperCase() + fab.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="5999"
                    step="0.01"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-yellow-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Discount Price (₹)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="4499 (optional)"
                    step="0.01"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-yellow-400/50"
                  />
                </div>
              </div>

              {/* Stock & Regional Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="10"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-yellow-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Regional Style</label>
                  <select
                    name="regionalStyle"
                    value={formData.regionalStyle}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-yellow-400/50"
                  >
                    <option value="">Select style (optional)</option>
                    {REGIONAL_STYLES.map(style => (
                      <option key={style} value={style}>{style.replace(/_/g, ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the saree details, pattern, embroidery, etc."
                  rows={4}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-yellow-400/50"
                />
              </div>

              {/* Blouse included */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="blouse-included"
                  name="blouseIncluded"
                  checked={formData.blouseIncluded}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded accent-yellow-400"
                />
                <label htmlFor="blouse-included" className="text-slate-300 font-medium">
                  Blouse Included
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={uploadingProduct}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-lg transition-all"
              >
                {uploadingProduct ? 'Uploading...' : '✓ Add Product to Store'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
