export type GameStateMode = 'MENU' | 'PLAYING' | 'PAUSED' | 'SHOP' | 'UPGRADES' | 'COSMETICS' | 'SETTINGS' | 'GAMEOVER';

export type WeaponId = 'mk1' | 'mk2' | 'mk3' | 'mk4' | 'mk5';

export interface WeaponStats {
  damage: number;   // 1 - 10
  fireRate: number; // 1 - 10 (affects cooldown & speed)
  energy: number;   // 1 - 10 (affects size & splash)
  critical: number; // 1 - 10 (crit chance %)
}

export interface WeaponDefinition {
  id: WeaponId;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  color: string;
  secondaryColor: string;
  glowColor: string;
  projectileColor: string;
  baseStats: WeaponStats;
  silhouetteType: 'compact' | 'armored' | 'multi_chamber' | 'vortex' | 'singularity';
}

export type PlanetType =
  | 'earth'
  | 'mars'
  | 'desert'
  | 'rocky'
  | 'ice'
  | 'volcanic'
  | 'gas_giant'
  | 'crystal'
  | 'special_golden'
  | 'special_legendary';

export interface PlanetDefinition {
  type: PlanetType;
  name: string;
  coinValue: number;
  baseRadius: number;
  glowColor: string;
  atmosphereColor: string;
  isSpecial: boolean;
  spawnWeight: number; // Relative chance
}

export interface ActivePlanet {
  id: string;
  type: PlanetType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  rotation: number;
  rotationSpeed: number;
  coinValue: number;
  isSpecial: boolean;
  maxHp: number;
  currentHp: number;
  timeAlive?: number;
  hasBeenHit?: boolean;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isCritical: boolean;
  color: string;
  trailColor: string;
}

export type ParticleType = 'spark' | 'debris' | 'shockwave' | 'ember' | 'smoke' | 'coin' | 'flash' | 'impact';

export interface Particle {
  id: string;
  type?: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  secondaryColor?: string;
  glowColor?: string;
  alpha: number;
  life: number;
  maxLife: number;
  drag?: number;
  gravity?: number;
  rotation?: number;
  rotationSpeed?: number;
  polygonSides?: number;
  strokeWidth?: number;
  isCoin?: boolean;
  targetX?: number;
  targetY?: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  alpha: number;
  vy: number;
}

export interface UserProgress {
  coins: number;
  highScore: number;
  xp: number;
  level: number;
  equippedWeapon: WeaponId;
  ownedWeapons: WeaponId[];
  weaponUpgrades: Record<WeaponId, { damage: number; fireRate: number; energy: number; critical: number }>;
  equippedTrail: string;
  unlockedTrails: string[];
  equippedSkin: string;
  unlockedSkins: string[];
  equippedTheme: string;
  unlockedThemes: string[];
  tutorialCompleted: boolean;
}

export interface GameSettings {
  sfxVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  screenShake: boolean;
  highParticleQuality: boolean;
}

export interface TrailCosmetic {
  id: string;
  name: string;
  price: number;
  color: string;
  glow: string;
  unlocked: boolean;
}

export interface WeaponSkinCosmetic {
  id: string;
  name: string;
  price: number;
  primaryColor: string;
  accentColor: string;
  unlocked: boolean;
}

export interface BackgroundThemeCosmetic {
  id: string;
  name: string;
  price: number;
  gradientStart: string;
  gradientMid: string;
  starTint: string;
  unlocked: boolean;
}
