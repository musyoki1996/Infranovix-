import React, { useState } from 'react';
import { api } from '../services/api';
import { EditorialUser } from '../types/newspaper';
import { Lock, X, AlertCircle, Key, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: EditorialUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('editor@kenyanledger.co.ke');
  const [password, setPassword] = useState('editor123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.loginAdmin({ email, password });
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: 'editor' | 'admin' | 'journalist') => {
    setLoading(true);
    let demoEmail = 'editor@kenyanledger.co.ke';
    let demoPass = 'editor123';

    if (demoRole === 'admin') {
      demoEmail = 'admin@kenyanledger.co.ke';
      demoPass = 'admin123';
    } else if (demoRole === 'journalist') {
      demoEmail = 'journalist@kenyanledger.co.ke';
      demoPass = 'press123';
    }

    try {
      const res = await api.loginAdmin({ email: demoEmail, password: demoPass });
      onLoginSuccess(res.user);
      onClose();
    } catch {
      setError('Demo authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xs border-t-4 border-[#D71920] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-100 rounded-full mb-3 text-stone-900">
            <Lock className="w-6 h-6 text-[#D71920]" />
          </div>
          <h3 className="text-xl font-serif font-black text-stone-900 tracking-tight">
            Newsroom Staff Gateway
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Authorised editorial staff, desk chiefs & administrators
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Newsroom Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-stone-900 hover:bg-[#D71920] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to CMS Portal'}
          </button>
        </form>

        {/* Quick evaluation shortcuts for easy testing */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
            Instant Demo Newsroom Access:
          </span>
          <div className="flex items-center justify-center gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoLogin('editor')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs border border-stone-300 font-semibold cursor-pointer"
            >
              Managing Editor
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs border border-stone-300 font-semibold cursor-pointer"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleQuickDemoLogin('journalist')}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs border border-stone-300 font-semibold cursor-pointer"
            >
              Reporter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
