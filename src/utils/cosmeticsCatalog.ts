import { TrailCosmetic, WeaponSkinCosmetic, BackgroundThemeCosmetic } from '../types/game';

export const TRAILS_CATALOG: TrailCosmetic[] = [
  {
    id: 'cyan_plasma',
    name: 'CYAN PLASMA',
    price: 0,
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.8)',
    unlocked: true,
  },
  {
    id: 'crimson_solar',
    name: 'CRIMSON SOLAR',
    price: 800,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.8)',
    unlocked: false,
  },
  {
    id: 'emerald_nova',
    name: 'EMERALD NOVA',
    price: 1500,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.8)',
    unlocked: false,
  },
  {
    id: 'golden_sun',
    name: 'GOLDEN SUN',
    price: 3000,
    color: '#facc15',
    glow: 'rgba(250,204,21,0.8)',
    unlocked: false,
  },
  {
    id: 'cosmic_void',
    name: 'COSMIC VOID',
    price: 6000,
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.8)',
    unlocked: false,
  },
];

export const SKINS_CATALOG: WeaponSkinCosmetic[] = [
  {
    id: 'default_titanium',
    name: 'TITANIUM STEEL',
    price: 0,
    primaryColor: '#334155',
    accentColor: '#38bdf8',
    unlocked: true,
  },
  {
    id: 'neon_cyberpunk',
    name: 'NEON CYBERPUNK',
    price: 1200,
    primaryColor: '#1e1b4b',
    accentColor: '#f43f5e',
    unlocked: false,
  },
  {
    id: 'golden_overlord',
    name: 'GOLDEN OVERLORD',
    price: 4000,
    primaryColor: '#78350f',
    accentColor: '#facc15',
    unlocked: false,
  },
];

export const THEMES_CATALOG: BackgroundThemeCosmetic[] = [
  {
    id: 'deep_space',
    name: 'DEEP SPACE VOID',
    price: 0,
    gradientStart: 'rgba(126, 34, 206, 0.12)',
    gradientMid: 'rgba(30, 58, 138, 0.08)',
    starTint: '#ffffff',
    unlocked: true,
  },
  {
    id: 'solar_flare',
    name: 'SOLAR FLARE NEBULA',
    price: 1800,
    gradientStart: 'rgba(239, 68, 68, 0.20)',
    gradientMid: 'rgba(245, 158, 11, 0.12)',
    starTint: '#fef08a',
    unlocked: false,
  },
  {
    id: 'cyber_grid',
    name: 'CYBER MATRIX NEBULA',
    price: 3500,
    gradientStart: 'rgba(16, 185, 129, 0.20)',
    gradientMid: 'rgba(6, 182, 212, 0.12)',
    starTint: '#a7f3d0',
    unlocked: false,
  },
];
