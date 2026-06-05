'use client';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function RecommendationSlip({ recommendations, sessionId, onClose }) {
  const slipRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-900 border border-white/20 rounded-3xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          ref={slipRef}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-gradient-gold">SareeAI</h2>
              <p className="text-slate-500 text-xs">AI Recommendation Slip • Session: {sessionId?.slice(0, 8)}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-slate-400 text-sm mb-4 border-b border-white/10 pb-4">
            Show this slip to store staff or scan QR codes to locate products
          </p>

          <div className="space-y-4">
            {recommendations.slice(0, 5).map((product, i) => (
              <div key={product.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3">
                <span className="text-2xl font-bold text-yellow-400/30 w-6 text-center">{i + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{product.name}</p>
                  <p className="text-yellow-400 font-mono text-xs">{product.product_code}</p>
                  <p className="text-slate-400 text-xs">₹{Number(product.price).toLocaleString()}</p>
                </div>
                <QRCodeSVG value={product.product_code} size={48} bgColor="transparent" fgColor="#D4AF37" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Slip
            </button>
            <button onClick={onClose} className="glass px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
