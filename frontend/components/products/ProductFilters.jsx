'use client';
import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const FILTER_SECTIONS = [
  {
    key: 'category',
    label: 'Category',
    options: ['saree', 'lehenga', 'salwar', 'dupatta', 'blouse'],
  },
  {
    key: 'fabric',
    label: 'Fabric',
    options: ['silk', 'cotton', 'chiffon', 'georgette', 'linen', 'banarasi', 'kanjivaram', 'chanderi'],
  },
  {
    key: 'occasion',
    label: 'Occasion',
    options: ['wedding', 'party', 'casual', 'festive', 'religious', 'office'],
  },
  {
    key: 'regional_style',
    label: 'Regional Style',
    options: ['banarasi', 'kanjivaram', 'paithani', 'bandhani', 'phulkari', 'sambalpuri'],
  },
];

function FilterSection({ section, selectedValue, onChange }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-white/10 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-white font-semibold text-sm mb-3"
      >
        {section.label}
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="space-y-1.5">
          {section.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name={section.key}
                value={opt}
                checked={selectedValue === opt}
                onChange={() => onChange(section.key, selectedValue === opt ? null : opt)}
                className="accent-yellow-400"
              />
              <span className="text-slate-400 group-hover:text-white text-sm capitalize transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductFilters({ filters, onFiltersChange }) {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    if (value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFiltersChange(newFilters);
  };

  const handlePriceApply = () => {
    const newFilters = { ...filters };
    if (priceRange.min) newFilters.min_price = Number(priceRange.min);
    if (priceRange.max) newFilters.max_price = Number(priceRange.max);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    onFiltersChange({});
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-white">
          <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
          Filters
        </div>
        <button onClick={handleClear} className="text-xs text-yellow-400 hover:text-yellow-300">
          Clear all
        </button>
      </div>

      {/* Price range */}
      <div className="border-b border-white/10 pb-4 mb-4">
        <p className="text-white font-semibold text-sm mb-3">Price Range (₹)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="flex-1 glass rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none border border-white/10"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="flex-1 glass rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 outline-none border border-white/10"
          />
        </div>
        <button onClick={handlePriceApply} className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 w-full text-right">
          Apply
        </button>
      </div>

      {FILTER_SECTIONS.map((section) => (
        <FilterSection
          key={section.key}
          section={section}
          selectedValue={filters[section.key]}
          onChange={handleFilterChange}
        />
      ))}
    </div>
  );
}
