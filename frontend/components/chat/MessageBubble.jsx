'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import clsx from 'clsx';

export default function MessageBubble({ message }) {
  const isAI = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('flex gap-2 max-w-[90%]', isAI ? 'self-start' : 'self-end flex-row-reverse ml-auto')}
    >
      {isAI && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-slate-900" />
        </div>
      )}
      <div
        className={clsx(
          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
          isAI
            ? 'bg-white/10 text-white rounded-tl-sm'
            : 'bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 font-medium rounded-tr-sm'
        )}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
