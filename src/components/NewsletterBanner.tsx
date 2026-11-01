import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.subscribeNewsletter(email);
      setSubmitted(true);
      setMessage(res.message);
      setEmail('');
    } catch {
      setSubmitted(true);
      setMessage('Thank you for subscribing to The Kenyan Ledger.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 bg-stone-900 text-white relative overflow-hidden">
      {/* Accent national colors hairline */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <span className="w-1/3 bg-[#111111]"></span>
        <span className="w-1/3 bg-[#D71920]"></span>
        <span className="w-1/3 bg-[#00843D]"></span>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4 text-[#D71920]">
          <Mail className="w-6 h-6" />
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight mb-3">
          Stay Ahead of the Headlines.
        </h3>

        <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
          Get the stories that matter, the latest developments and important insights delivered straight to your inbox every morning.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-950/70 border border-emerald-600/50 rounded-xs text-emerald-200 text-sm flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920] border-0 rounded-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#D71920] hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider transition-colors shrink-0 disabled:opacity-50 cursor-pointer rounded-xs"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-400 mt-4">
          By subscribing, you agree to our Editorial Policy and Terms. Unsubscribe at any time with a single click.
        </p>
      </div>
    </section>
  );
};
