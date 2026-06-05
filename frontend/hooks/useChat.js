'use client';
import { useState, useCallback } from 'react';
import { recommendApi } from '@/lib/api';
import useAppStore from '@/store/useAppStore';

export default function useChat() {
  const { language, setLanguage } = useAppStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🌸 I\'m your AI Saree Stylist. What occasion are you shopping for?',
      quick_replies: ['Wedding', 'Festive', 'Party', 'Casual'],
    },
  ]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // [AI INTEGRATION POINT #1] — This call reaches backend/recommendation_service.py
      // which in turn calls OpenAI GPT-4o (when activated)
      const res = await recommendApi.chat({
        message: text,
        session_id: sessionId,
        language,
      });
      const data = res.data;

      setSessionId(data.session_id);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          quick_replies: data.quick_replies,
        },
      ]);

      if (data.recommendations?.length > 0) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      // Fallback: demo mode without backend
      const DEMO_RESPONSES = [
        'Great choice! I\'ll find perfect matches for you.',
        'Understood! Let me search through our collection...',
        'Here are some beautiful recommendations based on your preferences! ✨',
      ];
      const demoMsg = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `${demoMsg} (Demo mode — connect backend to get real AI responses)` },
      ]);

      // Show sample products as demo recommendations
      const { SAMPLE_PRODUCTS } = await import('@/lib/utils');
      setRecommendations(
        SAMPLE_PRODUCTS.slice(0, 5).map((p, i) => ({
          ...p,
          match_score: parseFloat((0.95 - i * 0.05).toFixed(2)),
          explanation: 'Recommended based on your preferences',
        }))
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, language]);

  const startNewSession = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Namaste! 🌸 I\'m your AI Saree Stylist. What occasion are you shopping for?',
        quick_replies: ['Wedding', 'Festive', 'Party', 'Casual'],
      },
    ]);
    setRecommendations([]);
    setSessionId(null);
  }, []);

  return { messages, recommendations, sendMessage, startNewSession, isLoading, sessionId, language, setLanguage };
}
