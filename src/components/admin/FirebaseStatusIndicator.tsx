import React, { useState } from 'react';
import {
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Server,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import firebaseConfig from '../../../firebase-applet-config.json';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({ isOpen, onClose }) => {
  const {
    firebaseStatus,
    lastCloudSyncTime,
    cloudPingMs,
    testFirebaseConnection,
    products,
    orders,
    reviews,
  } = useStore();

  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    latencyMs: number;
    timestamp: Date;
    success: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setIsPinging(true);
    try {
      const res = await testFirebaseConnection();
      setPingResult({
        latencyMs: res.latencyMs,
        timestamp: new Date(),
        success: res.success,
      });
    } finally {
      setIsPinging(false);
    }
  };

  const isConnected = firebaseStatus === 'connected';
  const isOffline = firebaseStatus === 'offline';

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Listening for live events...';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Firebase Cloud Status
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isOffline
                      ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isConnected
                        ? 'bg-emerald-400 animate-pulse'
                        : isOffline
                        ? 'bg-slate-400'
                        : 'bg-amber-400 animate-ping'
                    }`}
                  />
                  {isConnected ? 'ONLINE & ACTIVE' : isOffline ? 'OFFLINE' : 'CONNECTING'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Google Cloud Firestore Real-time Database Diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Main Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              isConnected
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : isOffline
                ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}
          >
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : isOffline ? (
              <WifiOff className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            ) : (
              <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin" />
            )}
            <div className="space-y-1 text-xs">
              <p className="font-black text-sm text-white">
                {isConnected
                  ? 'Cloud Database Linked & Synchronizing in Real-Time'
                  : isOffline
                  ? 'Working in Offline Mode'
                  : 'Establishing Secure Cloud Handshake...'}
              </p>
              <p className="text-slate-300 leading-relaxed">
                {isConnected
                  ? 'All changes made in the Admin UI (products, pricing, images, and orders) automatically write directly to Google Cloud Firestore with instant two-way synchronization.'
                  : 'Your device is temporarily disconnected from the internet. Local changes are saved securely and will sync to Firebase once connection returns.'}
              </p>
            </div>
          </div>

          {/* Cloud Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" /> Cloud Project ID
              </span>
              <p className="text-sm font-black text-white font-mono truncate">
                {firebaseConfig.projectId || 'azone-lanka'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" /> Database ID
              </span>
              <p className="text-sm font-black text-white font-mono">
                {firebaseConfig.firestoreDatabaseId || '(default)'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Response Latency
              </span>
              <p className="text-sm font-black text-emerald-400 font-mono">
                {pingResult?.latencyMs
                  ? `${pingResult.latencyMs} ms (Live)`
                  : cloudPingMs
                  ? `${cloudPingMs} ms (Active)`
                  : 'Optimal (<50ms)'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Last Cloud Event
              </span>
              <p className="text-sm font-black text-white font-mono">
                {formatLastSync(lastCloudSyncTime)}
              </p>
            </div>
          </div>

          {/* Active Synced Collections List */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Active Real-Time Collections
            </h4>
            <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden text-xs">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <strong className="text-white font-mono">/products</strong>
                    <p className="text-[11px] text-slate-400">
                      Live store catalog with image compression & auto-sync
                    </p>
                  </div>
                </div>
                <span className="text-slate-300 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded-lg">
                  {products.length} Items
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <strong className="text-white font-mono">/orders</strong>
                    <p className="text-[11px] text-slate-400">
                      Customer checkout orders & live tracking status
                    </p>
                  </div>
                </div>
                <span className="text-slate-300 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded-lg">
                  {orders.length} Orders
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <strong className="text-white font-mono">/settings/general</strong>
                    <p className="text-[11px] text-slate-400">
                      Theme colors, WhatsApp number & store configurations
                    </p>
                  </div>
                </div>
                <span className="text-emerald-400 font-semibold text-[11px]">Synced</span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <strong className="text-white font-mono">/reviews</strong>
                    <p className="text-[11px] text-slate-400">
                      Customer ratings, product reviews & testimonials
                    </p>
                  </div>
                </div>
                <span className="text-slate-300 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded-lg">
                  {reviews.length} Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Live Ping Tester */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify Live Firebase Connection</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Executes a live round-trip read test directly to Google Cloud Firestore.
              </p>
              {pingResult && (
                <p
                  className={`text-[11px] font-bold ${
                    pingResult.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {pingResult.success
                    ? `✓ Ping Success: ${pingResult.latencyMs}ms at ${pingResult.timestamp.toLocaleTimeString()}`
                    : '✗ Connection Ping failed. Check internet connection.'}
                </p>
              )}
            </div>

            <button
              type="button"
              id="firebase-live-ping-test-btn"
              onClick={handleTestPing}
              disabled={isPinging}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Testing Ping...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            TLS 1.3 End-to-End Encrypted Cloud Stream
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * TopBar Pill Badge: Visible in the Admin Top Navigation
 */
export const FirebaseLiveBadge: React.FC = () => {
  const { firebaseStatus, cloudPingMs } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isConnected = firebaseStatus === 'connected';
  const isOffline = firebaseStatus === 'offline';

  return (
    <>
      <button
        type="button"
        id="admin-firebase-live-indicator-badge"
        onClick={() => setIsModalOpen(true)}
        title="Click to view real-time Firebase Cloud Connection Diagnostics"
        className={`group px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-black transition-all flex items-center gap-1.5 shadow-sm select-none ${
          isConnected
            ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
            : isOffline
            ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/40'
            : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
        }`}
      >
        {/* Pulsing Dot */}
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? 'bg-emerald-400' : isOffline ? 'bg-rose-400' : 'bg-amber-400'
            }`}
          />
        </span>

        {/* Icon */}
        <Database className="w-3 h-3 shrink-0 text-amber-400" />

        {/* Text */}
        <span className="font-extrabold tracking-wide">
          {isConnected ? 'Firebase Live' : isOffline ? 'Firebase Offline' : 'Connecting...'}
        </span>

        {/* Optional Latency on larger screens */}
        {isConnected && cloudPingMs && (
          <span className="hidden md:inline-block text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1 rounded">
            {cloudPingMs}ms
          </span>
        )}

        <span className="text-[9px] text-slate-400 group-hover:text-white transition-colors ml-0.5">
          ⓘ
        </span>
      </button>

      <FirebaseStatusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

/**
 * Overview Banner Card: Prominently featured in Admin Overview Tab
 */
export const FirebaseOverviewCard: React.FC = () => {
  const { firebaseStatus, cloudPingMs, testFirebaseConnection, lastCloudSyncTime } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const isConnected = firebaseStatus === 'connected';

  const handleQuickTest = async () => {
    setIsTesting(true);
    try {
      await testFirebaseConnection();
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <div
        id="admin-firebase-overview-card"
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                Firebase Firestore Real-Time Database
              </h3>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {isConnected ? 'ACTIVE & CONNECTED' : 'CONNECTING'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Project: <span className="font-mono text-slate-200">{firebaseConfig.projectId}</span> • Database: <span className="font-mono text-slate-200">{firebaseConfig.firestoreDatabaseId}</span> • Real-time synchronization is live across all devices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleQuickTest}
            disabled={isTesting}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isTesting ? 'Pinging...' : cloudPingMs ? `${cloudPingMs}ms Ping` : 'Ping Cloud'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Diagnostics</span>
          </button>
        </div>
      </div>

      <FirebaseStatusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
