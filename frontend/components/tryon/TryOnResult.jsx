'use client';
import { motion } from 'framer-motion';
import { Download, Sparkles, CheckCircle } from 'lucide-react';

const STEPS_PROGRESS = [
  'Detecting body pose...',
  'Segmenting body...',
  'Warping saree cloth...',
  'Applying AI draping...',
  'Finalizing preview...',
];

export default function TryOnResult({ result, isGenerating }) {
  if (!result && !isGenerating) {
    return (
      <div className="glass rounded-2xl h-full min-h-64 flex items-center justify-center text-center p-8 text-slate-500">
        <div>
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-400/30" />
          <p>Your try-on result will appear here</p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="glass rounded-2xl p-8 min-h-64 flex flex-col items-center justify-center text-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-10 h-10 text-yellow-400" />
        </motion.div>
        <p className="font-semibold text-white">Generating your try-on...</p>
        <div className="space-y-2 w-full max-w-48">
          {STEPS_PROGRESS.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.8 }}
              className="flex items-center gap-2 text-xs text-slate-400"
            >
              <motion.div
                className="w-4 h-4 rounded-full border border-yellow-400/50 flex items-center justify-center"
                animate={{ borderColor: ['rgba(212,175,55,0.5)', 'rgba(212,175,55,1)', 'rgba(212,175,55,0.5)'] }}
                transition={{ duration: 1.5, delay: i * 0.8, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
              </motion.div>
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="font-semibold text-white">Try-On Complete!</span>
      </div>
      <img
        src={result.output_image_url}
        alt="Virtual try-on result"
        className="w-full object-contain max-h-[500px]"
      />
      <div className="p-4 flex gap-3">
        <a
          href={result.output_image_url}
          download="sareeai-tryon.jpg"
          className="btn-gold flex items-center gap-2 flex-1 justify-center text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>
    </motion.div>
  );
}
