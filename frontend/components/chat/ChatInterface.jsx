'use client';
import { useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';

export default function ChatInterface({ messages, onSend, isLoading, language }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const lastMessage = messages[messages.length - 1];
  const quickReplies = lastMessage?.role === 'assistant' ? lastMessage.quick_replies : [];

  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hidden">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Sparkles className="w-12 h-12 text-yellow-400/40 mb-3" />
            <p className="text-slate-400 font-display text-lg">Your AI Stylist is ready</p>
            <p className="text-slate-600 text-sm mt-1">Type a message or tap a quick reply to start</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {quickReplies?.length > 0 && (
        <QuickReplies replies={quickReplies} onSelect={(r) => { onSend(r); }} />
      )}

      {/* Input */}
      <div className="border-t border-white/10 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Tell me your occasion, budget, fabric preference..."
          className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4 text-slate-900" />
        </button>
      </div>
    </div>
  );
}
