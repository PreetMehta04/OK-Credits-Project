'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Download, RotateCcw, CheckCircle } from 'lucide-react';
import ImageUploader from '@/components/tryon/ImageUploader';
import TryOnResult from '@/components/tryon/TryOnResult';
import ProductCard from '@/components/products/ProductCard';
import useTryOn from '@/hooks/useTryOn';
import { SAMPLE_PRODUCTS } from '@/lib/utils';

const STEPS = ['Upload Photo', 'Select Saree', 'Generate Try-On'];

export default function TryOnPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [userImage, setUserImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { generate, result, isGenerating, reset } = useTryOn();

  const handleImageUpload = (imageData) => {
    setUserImage(imageData);
    setActiveStep(1);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveStep(2);
  };

  const handleGenerate = async () => {
    if (!userImage || !selectedProduct) return;
    await generate(userImage.url, selectedProduct.id, selectedProduct.name);
  };

  const handleReset = () => {
    setUserImage(null);
    setSelectedProduct(null);
    setActiveStep(0);
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-gradient-gold flex items-center justify-center gap-3 mb-2">
            <Camera className="w-9 h-9 text-orange-400" />
            Virtual Saree Try-On
          </h1>
          <p className="text-slate-400">See how any saree looks on you — powered by AI</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                i < activeStep
                  ? 'bg-green-500 text-white'
                  : i === activeStep
                  ? 'bg-yellow-500 text-slate-900'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {i < activeStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i === activeStep ? 'text-yellow-400 font-semibold' : 'text-slate-500'}`}>
                {step}
              </span>
              {i < STEPS.length - 1 && <div className="w-12 h-px bg-slate-700" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {activeStep === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ImageUploader onUpload={handleImageUpload} />
            </motion.div>
          )}

          {/* Step 2: Select Saree */}
          {activeStep === 1 && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-semibold text-white text-xl mb-4">Select a Saree to Try On</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SAMPLE_PRODUCTS.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-yellow-400 scale-105'
                        : 'border-transparent hover:border-yellow-400/50'
                    }`}
                  >
                    <ProductCard product={product} compact />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Generate */}
          {activeStep === 2 && (
            <motion.div key="generate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Original */}
                <div>
                  <h3 className="font-semibold text-slate-300 mb-3">Your Photo + Selected Saree</h3>
                  <div className="glass rounded-2xl p-4">
                    {userImage && (
                      <img src={userImage.preview} alt="Your photo" className="w-full rounded-xl object-cover max-h-96" />
                    )}
                    {selectedProduct && (
                      <div className="mt-3 flex items-center gap-3 glass-gold rounded-xl p-3">
                        <img
                          src={selectedProduct.images?.[0]?.url || `https://picsum.photos/seed/${selectedProduct.id}/60/80`}
                          alt={selectedProduct.name}
                          className="w-12 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white text-sm">{selectedProduct.name}</p>
                          <p className="text-yellow-400 text-xs">{selectedProduct.product_code}</p>
                        </div>
                      </div>
                    )}
                    {!result && (
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate Try-On
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Result */}
                <div>
                  <TryOnResult result={result} isGenerating={isGenerating} />
                </div>
              </div>
              <button onClick={handleReset} className="mt-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
