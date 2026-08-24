import { UserProgress, GameSettings, WeaponId } from '../types/game';

const PROGRESS_KEY = 'shoot_the_planet_progress_v1';
const SETTINGS_KEY = 'shoot_the_planet_settings_v1';

export const DEFAULT_PROGRESS: UserProgress = {
  coins: 0,
  highScore: 0,
  xp: 0,
  level: 1,
  equippedWeapon: 'mk1',
  ownedWeapons: ['mk1'],
  weaponUpgrades: {
    mk1: { damage: 0, fireRate: 0, energy: 0, critical: 0 },
    mk2: { damage: 0, fireRate: 0, energy: 0, critical: 0 },
    mk3: { damage: 0, fireRate: 0, energy: 0, critical: 0 },
    mk4: { damage: 0, fireRate: 0, energy: 0, critical: 0 },
    mk5: { damage: 0, fireRate: 0, energy: 0, critical: 0 },
  },
  equippedTrail: 'cyan_plasma',
  unlockedTrails: ['cyan_plasma'],
  equippedSkin: 'default_titanium',
  unlockedSkins: ['default_titanium'],
  equippedTheme: 'deep_space',
  unlockedThemes: ['deep_space'],
  tutorialCompleted: false,
};

export const DEFAULT_SETTINGS: GameSettings = {
  sfxVolume: 0.8,
  musicVolume: 0.5,
  screenShake: true,
  highParticleQuality: true,
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      weaponUpgrades: {
        ...DEFAULT_PROGRESS.weaponUpgrades,
        ...(parsed.weaponUpgrades || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

export function loadGameSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveGameSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function calculateXpLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  // Level curve: Level 1 = 0..100, Level 2 = 100..250, Level 3 = 250..450, etc.
  let lvl = 1;
  let req = 100;
  let totalReq = 0;
  
  while (xp >= totalReq + req) {
    totalReq += req;
    lvl++;
    req = Math.floor(100 * Math.pow(lvl, 1.25));
  }
  
  const currentLevelXp = xp - totalReq;
  return {
    level: lvl,
    currentXp: currentLevelXp,
    nextLevelXp: req,
  };
}
