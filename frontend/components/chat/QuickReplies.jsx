'use client';
import { motion } from 'framer-motion';

export default function QuickReplies({ replies, onSelect }) {
  if (!replies || replies.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-white/10">
      {replies.map((reply) => (
        <motion.button
          key={reply}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(reply)}
          className="glass px-3 py-1.5 rounded-full text-xs text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/10 transition-all"
        >
          {reply}
        </motion.button>
      ))}
    </div>
  );
}
