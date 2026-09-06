import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppLink } from '../utils/helpers';

export const WhatsAppWidget: React.FC = () => {
  const { settings, viewMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const primaryColor = settings.theme?.primaryColor || '#10b981';

  if (viewMode === 'admin') return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || `Hello ${settings.storeName}, I would like to inquire about your products!`;
    const url = getWhatsAppLink(settings.ownerWhatsAppNumber, text);
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div id="whatsapp-floating-widget" className="fixed bottom-20 left-3 sm:bottom-6 sm:left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-950 font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{settings.storeName} Live</h4>
                  <span
                    className="text-[10px] font-semibold flex items-center gap-1"
                    style={{ color: primaryColor }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-ping"
                      style={{ backgroundColor: primaryColor }}
                    />
                    Online for WhatsApp Orders
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              👋 Hi! Have questions about a product, stock availability or islandwide delivery? Chat directly with our sales team on WhatsApp.
            </p>

            {/* Form */}
            <form onSubmit={handleSend} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Start WhatsApp Chat</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        id="whatsapp-fab-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200"
        style={{
          backgroundColor: primaryColor,
          boxShadow: `0 10px 25px -5px ${primaryColor}66`,
        }}
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </button>
    </div>
  );
};
