'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Camera, Star, ChevronRight, Zap, Shield, Globe } from 'lucide-react';

const HERO_SAREES = [
  { id: 1, url: 'https://picsum.photos/seed/saree1/300/400', name: 'Kanjivaram Silk', price: '₹12,500' },
  { id: 2, url: 'https://picsum.photos/seed/saree2/300/400', name: 'Banarasi Gold', price: '₹8,200' },
  { id: 3, url: 'https://picsum.photos/seed/saree3/300/400', name: 'Chiffon Floral', price: '₹3,400' },
];

const FEATURES = [
  {
    icon: <Sparkles className="w-7 h-7 text-yellow-400" />,
    title: 'AI Recommendation',
    desc: 'Chat with our AI stylist to find sarees matched to your occasion, budget, and style in seconds.',
  },
  {
    icon: <Camera className="w-7 h-7 text-orange-400" />,
    title: 'Virtual Try-On',
    desc: 'Upload your photo and see how any saree looks on you before visiting the store.',
  },
  {
    icon: <Star className="w-7 h-7 text-pink-400" />,
    title: '10,000+ Styles',
    desc: 'Explore Kanjivaram, Banarasi, Chiffon, Cotton and more — curated for every taste.',
  },
];

const STEPS = [
  { step: '01', title: 'Tell us your occasion', desc: 'Wedding, festive, casual — our AI understands your need.' },
  { step: '02', title: 'AI finds your match', desc: 'Embeddings, vector search, and smart ranking — in milliseconds.' },
  { step: '03', title: 'Try on virtually', desc: 'See yourself in the saree using AI pose detection and draping.' },
  { step: '04', title: 'Visit with your code', desc: 'Walk in with your product code — no confusion, no searching.' },
];

const TESTIMONIALS = [
  { name: 'Priya R.', city: 'Chennai', text: 'Found my wedding saree in 5 minutes. The AI knew exactly what I needed!', rating: 5 },
  { name: 'Kavitha S.', city: 'Mumbai', text: 'Virtual try-on saved me so much time. I could see how it draped on me!', rating: 5 },
  { name: 'Meena L.', city: 'Kolkata', text: 'The recommendations matched my budget perfectly. Absolutely love SareeAI!', rating: 5 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-maroon/20 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,175,55,0.15),transparent_60%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-24">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-yellow-400 mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Ethnic Fashion
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Discover Your
              <span className="text-gradient-gold block">Perfect Saree</span>
              <span className="text-3xl lg:text-4xl text-slate-300 font-normal">with AI Intelligence</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
              Chat with our AI stylist, find sarees matching your occasion and budget,
              and try them on virtually — all before stepping into the store.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/stylist" className="btn-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Try AI Stylist
              </Link>
              <Link href="/tryon" className="btn-gold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Virtual Try-On
              </Link>
            </div>
          </motion.div>

          {/* Right — floating product cards */}
          <div className="hidden lg:flex gap-4 justify-center items-center">
            {HERO_SAREES.map((saree, i) => (
              <motion.div
                key={saree.id}
                className="glass rounded-2xl overflow-hidden shadow-2xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
              >
                <div className="relative w-48 h-64">
                  <Image src={saree.url} alt={saree.name} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-white">{saree.name}</p>
                  <p className="text-yellow-400 text-sm">{saree.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────��────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl font-bold text-gradient-gold mb-4">Why SareeAI?</h2>
          <p className="text-slate-400 text-lg">Technology meets tradition</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-2xl p-8 card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="w-14 h-14 glass-gold rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-maroon/10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="font-display text-4xl font-bold text-center text-white mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How It <span className="text-gradient-gold">Works</span>
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-xl mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="hidden md:block w-6 h-6 text-yellow-400/50 absolute right-0 top-1/2 -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-center text-gradient-gold mb-12">
          What Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass rounded-2xl p-6 card-hover"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex gap-1 mb-3">
                {Array(t.rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 italic mb-4">"{t.text}"</p>
              <div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-slate-500 text-sm">{t.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <motion.div
          className="max-w-2xl mx-auto glass rounded-3xl p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl font-bold text-gradient-gold mb-4">
            Ready to Find Your Perfect Saree?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of happy customers who found their dream saree in minutes.
          </p>
          <Link href="/stylist" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Start with AI Stylist
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ───────────────��────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-6 text-center text-slate-500 text-sm">
        <p className="font-display text-white text-xl mb-2">SareeAI</p>
        <p>AI-powered ethnic fashion — where tradition meets technology</p>
        <div className="flex justify-center gap-6 mt-4 text-slate-600">
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <Link href="/stylist" className="hover:text-white transition-colors">AI Stylist</Link>
          <Link href="/tryon" className="hover:text-white transition-colors">Try-On</Link>
          <Link href="/dashboard/admin" className="hover:text-white transition-colors">Admin</Link>
        </div>
        <p className="mt-6">© 2026 SareeAI. MIT License.</p>
      </footer>
    </div>
  );
}
