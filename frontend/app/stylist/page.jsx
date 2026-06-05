'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RefreshCw, Globe, Printer } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import ProductCard from '@/components/products/ProductCard';
import RecommendationSlip from '@/components/products/RecommendationSlip';
import useChat from '@/hooks/useChat';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'ta', label: 'த' },
  { code: 'bn', label: 'বাং' },
];

export default function StylistPage() {
  const { messages, recommendations, sendMessage, startNewSession, isLoading, sessionId, language, setLanguage } = useChat();
  const [showSlip, setShowSlip] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-gold flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-yellow-400" />
              AI Saree Stylist
            </h1>
            <p className="text-slate-400 mt-1">Tell me your occasion and let AI find your perfect match</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="flex gap-1 glass rounded-full p-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    language === l.code
                      ? 'bg-yellow-500 text-slate-900 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              onClick={startNewSession}
              className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              New Session
            </button>
          </div>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-220px)]">
          {/* Chat — 60% */}
          <div className="lg:col-span-3 flex flex-col">
            <ChatInterface
              messages={messages}
              onSend={sendMessage}
              isLoading={isLoading}
              language={language}
            />
          </div>

          {/* Recommendations — 40% */}
          <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">
                {recommendations.length > 0 ? `${recommendations.length} Matches Found` : 'Recommendations'}
              </h2>
              {recommendations.length > 0 && (
                <button
                  onClick={() => setShowSlip(true)}
                  className="flex items-center gap-1 text-yellow-400 text-sm hover:text-yellow-300"
                >
                  <Printer className="w-4 h-4" />
                  Print Slip
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hidden space-y-3">
              {recommendations.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center text-slate-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-400/30" />
                  <p>Start chatting to see AI recommendations appear here</p>
                </div>
              ) : (
                <AnimatePresence>
                  {recommendations.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <ProductCard product={product} compact showTryOn showCode />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print slip modal */}
      {showSlip && (
        <RecommendationSlip
          recommendations={recommendations}
          sessionId={sessionId}
          onClose={() => setShowSlip(false)}
        />
      )}
    </div>
  );
}
