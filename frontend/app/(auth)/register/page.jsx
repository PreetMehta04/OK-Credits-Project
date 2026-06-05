'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        className="glass rounded-3xl p-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold text-gradient-gold">Create Account</h1>
          <p className="text-slate-400 mt-1">Join SareeAI — your AI fashion companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Full Name', key: 'full_name', type: 'text', placeholder: 'Priya Sharma' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 8 characters' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-slate-300 text-sm mb-1.5 block">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                placeholder={placeholder}
                className="w-full glass rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-yellow-400/50 border border-white/10 transition-all"
              />
            </div>
          ))}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-base">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
