'use client';
import { useState, useCallback } from 'react';
import { tryonApi } from '@/lib/api';

export default function useTryOn() {
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);

  const generate = useCallback(async (inputImageUrl, productId, productName) => {
    setIsGenerating(true);
    setResult(null);

    try {
      // Step 1: Submit job
      // [AI INTEGRATION POINT #4] — sends to backend → Celery → GPU pipeline
      const submitRes = await tryonApi.generate(productId, inputImageUrl);
      const { job_id } = submitRes.data;
      setJobId(job_id);

      // Step 2: Poll for result
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await tryonApi.status(job_id);
          const { status, output_image_url } = statusRes.data;

          if (status === 'completed' && output_image_url) {
            setResult({ output_image_url });
            clearInterval(poll);
            setIsGenerating(false);
          } else if (status === 'failed' || attempts > 30) {
            clearInterval(poll);
            setIsGenerating(false);
            setResult({ output_image_url: `https://picsum.photos/seed/${productId}/512/768` });
          }
        } catch {
          clearInterval(poll);
          setIsGenerating(false);
          // Demo fallback
          setResult({ output_image_url: `https://picsum.photos/seed/${productId}/512/768` });
        }
      }, 2000);

    } catch {
      // Demo mode — show placeholder result
      await new Promise((r) => setTimeout(r, 4000)); // simulate wait
      setResult({ output_image_url: `https://picsum.photos/seed/${productId}/512/768` });
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setJobId(null);
    setIsGenerating(false);
  }, []);

  return { generate, result, isGenerating, jobId, reset };
}
