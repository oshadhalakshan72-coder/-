import { ThemeSettings } from '../types';

export interface ThemePresetOption {
  id: ThemeSettings['preset'];
  name: string;
  primary: string;
  accent: string;
  secondary: string;
  previewBg: string;
  description: string;
}

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'emerald',
    name: 'Emerald & Mint',
    primary: '#10b981', // emerald-500
    accent: '#06b6d4',  // cyan-500
    secondary: '#14b8a6', // teal-500
    previewBg: 'from-emerald-500 to-teal-400',
    description: 'Fresh, trustworthy luxury green with energetic teal accents',
  },
  {
    id: 'cyan',
    name: 'Ocean Cyan & Azure',
    primary: '#06b6d4', // cyan-500
    accent: '#3b82f6',  // blue-500
    secondary: '#0284c7', // sky-600
    previewBg: 'from-cyan-500 to-blue-500',
    description: 'Vibrant modern tech and coastal blue atmosphere',
  },
  {
    id: 'indigo',
    name: 'Royal Indigo & Violet',
    primary: '#6366f1', // indigo-500
    accent: '#a855f7',  // purple-500
    secondary: '#818cf8', // indigo-400
    previewBg: 'from-indigo-500 to-purple-500',
    description: 'Premium royal violet aesthetic with sleek contrast',
  },
  {
    id: 'amber',
    name: 'Sunset Gold & Amber',
    primary: '#f59e0b', // amber-500
    accent: '#f97316',  // orange-500
    secondary: '#fbbf24', // amber-400
    previewBg: 'from-amber-500 to-orange-500',
    description: 'Warm, prestige gold and sunset orange tones',
  },
  {
    id: 'rose',
    name: 'Ruby Rose & Crimson',
    primary: '#f43f5e', // rose-500
    accent: '#ec4899',  // pink-500
    secondary: '#fb7185', // rose-400
    previewBg: 'from-rose-500 to-pink-500',
    description: 'Striking, passionate crimson and modern rose glow',
  },
  {
    id: 'purple',
    name: 'Cyberpunk Purple',
    primary: '#a855f7', // purple-500
    accent: '#06b6d4',  // cyan-500
    secondary: '#c084fc', // purple-400
    previewBg: 'from-purple-500 to-cyan-400',
    description: 'High-energy futuristic neon purple and electric cyan',
  },
  {
    id: 'teal',
    name: 'Electric Teal & Aqua',
    primary: '#14b8a6', // teal-500
    accent: '#38bdf8',  // sky-400
    secondary: '#2dd4bf', // teal-400
    previewBg: 'from-teal-500 to-sky-400',
    description: 'Clean modern boutique turquoise and vivid aqua',
  },
  {
    id: 'orange',
    name: 'Sport Titanium Orange',
    primary: '#f97316', // orange-500
    accent: '#e11d48',  // rose-600
    secondary: '#fb923c', // orange-400
    previewBg: 'from-orange-500 to-rose-500',
    description: 'Dynamic, bold and high-conversion energetic orange',
  },
];

export const DEFAULT_THEME: ThemeSettings = {
  primaryColor: '#10b981',
  accentColor: '#06b6d4',
  secondaryColor: '#14b8a6',
  preset: 'emerald',
  mode: 'dark',
};

/**
 * Injects CSS variables onto document root or custom wrapper element
 */
export function applyThemeVariables(theme: ThemeSettings = DEFAULT_THEME) {
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', theme.primaryColor || '#10b981');
  root.style.setProperty('--color-accent', theme.accentColor || '#06b6d4');
  root.style.setProperty('--color-secondary', theme.secondaryColor || '#14b8a6');

  // Background modes
  if (theme.mode === 'oled') {
    root.style.setProperty('--bg-main', '#000000');
    root.style.setProperty('--bg-card', '#0a0a0a');
    root.style.setProperty('--bg-surface', '#121212');
    root.style.setProperty('--border-subtle', '#222222');
  } else if (theme.mode === 'midnight') {
    root.style.setProperty('--bg-main', '#020617');
    root.style.setProperty('--bg-card', '#0f172a');
    root.style.setProperty('--bg-surface', '#1e293b');
    root.style.setProperty('--border-subtle', '#334155');
  } else if (theme.mode === 'light') {
    root.style.setProperty('--bg-main', '#f8fafc');
    root.style.setProperty('--bg-card', '#ffffff');
    root.style.setProperty('--bg-surface', '#f1f5f9');
    root.style.setProperty('--border-subtle', '#e2e8f0');
  } else {
    // Default dark slate
    root.style.setProperty('--bg-main', '#020617');
    root.style.setProperty('--bg-card', '#0f172a');
    root.style.setProperty('--bg-surface', '#1e293b');
    root.style.setProperty('--border-subtle', '#1e293b');
  }
}
