import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    setAuthMode,
    login,
    register,
    loginWithGoogle,
  } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        if (!email.trim() || !password.trim()) {
          setError('Please enter your email and password.');
          setIsLoading(false);
          return;
        }
        const success = await login(email.trim(), password.trim());
        if (!success) {
          setError('Incorrect email or password. Please try again.');
        }
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }
        await register(name.trim(), email.trim(), password.trim(), phone.trim());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const ok = await loginWithGoogle();
      if (!ok) {
        setError(
          `Google Sign-in is restricted by Firebase domain whitelist for this URL (${window.location.hostname}). To enable, add this domain in Firebase Console > Authentication > Settings > Authorized domains. You can immediately sign in using Email & Password or Quick Login above!`
        );
      }
    } catch {
      setError('Google Sign-in could not be completed. Please use Email/Password sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="auth-modal-backdrop"
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onClick={() => setIsAuthOpen(false)}
      >
        <motion.div
          id="auth-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-6 sm:p-8 space-y-5"
        >
          {/* Close button */}
          <button
            id="close-auth-modal-btn"
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <BrandLogo size="md" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {authMode === 'login' ? 'Welcome Back!' : 'Join AZON LANKA'}
            </h2>
            <p className="text-xs text-slate-400">
              {authMode === 'login'
                ? 'Sign in to access your orders and track deliveries'
                : 'Create an account for faster checkout and exclusive member perks'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    placeholder="Kasun Weerakkodi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="auth-email-input"
                  type="text"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Phone / WhatsApp (Optional)
                </label>
                <div className="relative">
                  <input
                    id="auth-phone-input"
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : null}
              {authMode === 'login' ? 'Sign In to Account' : 'Complete Registration'}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-medium tracking-wider uppercase shrink-0">
              Or continue with
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Google Sign In Button */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
