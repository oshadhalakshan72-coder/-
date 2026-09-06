import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  X,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, loginAsAdmin } = useStore();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = passcode.trim();

    if (!trimmed) {
      setError('Please enter the owner passcode.');
      return;
    }

    setIsSubmitting(true);

    const admins = settings.adminAccounts || [];
    const masterPasscode = (settings.adminPasscode || 'admin123').trim();

    // Check if passcode matches master passcode or any registered admin account
    const matchedAccount = admins.find(
      (a) => (a.passcode || '').trim() === trimmed
    );

    if (trimmed === masterPasscode || matchedAccount) {
      loginAsAdmin(matchedAccount?.id || (admins.length > 0 ? admins[0].id : undefined));
      setIsSubmitting(false);
      setPasscode('');
      onClose();
    } else {
      setIsSubmitting(false);
      setError('Incorrect passcode. Access denied.');
    }
  };

  return (
    <AnimatePresence>
      <div
        id="admin-passcode-backdrop"
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          id="admin-passcode-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100"
        >
          {/* Close button */}
          <button
            id="close-admin-passcode-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Store Admin Portal</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  Owner Area
                </span>
              </div>
              <p className="text-xs text-slate-400">Enter your store owner security passcode</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Passcode / Password
              </label>
              <div className="relative">
                <input
                  id="admin-passcode-input"
                  type={showPasscode ? 'text' : 'password'}
                  autoFocus
                  required
                  placeholder="Enter owner passcode"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="p-1 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-passcode-submit-btn"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
