import { WeaponDefinition, WeaponId, WeaponStats, WeaponSkinCosmetic } from '../types/game';

export const WEAPON_CATALOG: Record<WeaponId, WeaponDefinition> = {
  mk1: {
    id: 'mk1',
    name: 'PLANET POPPER MK-I',
    subtitle: 'Tactical Plasma Launcher',
    description: 'Compact futuristic energy cannon with standard pulse capabilities.',
    price: 0,
    color: '#06b6d4', // Cyan
    secondaryColor: '#0891b2',
    glowColor: '#38bdf8',
    projectileColor: '#22d3ee',
    baseStats: {
      damage: 3,
      fireRate: 4,
      energy: 3,
      critical: 2,
    },
    silhouetteType: 'compact',
  },
  mk2: {
    id: 'mk2',
    name: 'PLANET POPPER MK-II',
    subtitle: 'Dual-Conduit Breaker',
    description: 'Reinforced armor plating and dual plasma chambers for higher burst damage.',
    price: 1000,
    color: '#ef4444', // Red
    secondaryColor: '#991b1b',
    glowColor: '#f87171',
    projectileColor: '#f87171',
    baseStats: {
      damage: 5,
      fireRate: 5,
      energy: 4,
      critical: 3,
    },
    silhouetteType: 'armored',
  },
  mk3: {
    id: 'mk3',
    name: 'PLANET POPPER MK-III',
    subtitle: 'Tri-Core Pulse Rifle',
    description: 'Triple energy coils delivering hyper-velocity plasma bolts with critical punch.',
    price: 5000,
    color: '#10b981', // Emerald & Gold
    secondaryColor: '#047857',
    glowColor: '#34d399',
    projectileColor: '#34d399',
    baseStats: {
      damage: 6,
      fireRate: 7,
      energy: 6,
      critical: 5,
    },
    silhouetteType: 'multi_chamber',
  },
  mk4: {
    id: 'mk4',
    name: 'PLANET POPPER MK-IV',
    subtitle: 'Vortex Impact Cannon',
    description: 'Heavy vortex architecture launching wide-area energy blasts that obliterate celestial rock.',
    price: 15000,
    color: '#a855f7', // Violet
    secondaryColor: '#6b21a8',
    glowColor: '#c084fc',
    projectileColor: '#e879f9',
    baseStats: {
      damage: 8,
      fireRate: 8,
      energy: 8,
      critical: 7,
    },
    silhouetteType: 'vortex',
  },
  mk5: {
    id: 'mk5',
    name: 'PLANET POPPER MK-V',
    subtitle: 'Singularity Destroyer',
    description: 'The ultimate cosmic weapon. Unleashes antimatter beam core disintegrations.',
    price: 50000,
    color: '#f59e0b', // Solar Gold & Divine White
    secondaryColor: '#b45309',
    glowColor: '#fbbf24',
    projectileColor: '#fef08a',
    baseStats: {
      damage: 10,
      fireRate: 10,
      energy: 10,
      critical: 10,
    },
    silhouetteType: 'singularity',
  },
};

export function calculateEffectiveStats(
  weaponId: WeaponId,
  upgrades: { damage: number; fireRate: number; energy: number; critical: number }
): WeaponStats {
  const base = WEAPON_CATALOG[weaponId].baseStats;
  return {
    damage: Math.min(10, base.damage + upgrades.damage),
    fireRate: Math.min(10, base.fireRate + upgrades.fireRate),
    energy: Math.min(10, base.energy + upgrades.energy),
    critical: Math.min(10, base.critical + upgrades.critical),
  };
}

/**
 * Draws custom futuristic weapon artwork on canvas for Shop preview or Gameplay Cannon.
 */
export function drawWeaponOnCanvas(
  ctx: CanvasRenderingContext2D,
  weaponId: WeaponId,
  x: number,
  y: number,
  angle: number,
  recoilOffset: number = 0,
  scale: number = 1,
  skinOverride?: WeaponSkinCosmetic
) {
  const def = WEAPON_CATALOG[weaponId];

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // Recoil shift back
  ctx.translate(-recoilOffset, 0);

  ctx.shadowColor = skinOverride ? skinOverride.accentColor : def.glowColor;
  ctx.shadowBlur = 10;

  switch (def.silhouetteType) {
    case 'compact': {
      // MK-I Compact Energy Pistol
      // Body
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, -12, 45, 24);
      // Barrel
      ctx.fillStyle = def.color;
      ctx.fillRect(35, -8, 25, 16);
      // Energy Chamber Core
      ctx.fillStyle = def.glowColor;
      ctx.beginPath();
      ctx.arc(10, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      // Muzzle Ring
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(60, -10, 4, 20);
      break;
    }
    case 'armored': {
      // MK-II Armored Breaker
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-15, -16, 55, 32);
      // Armor Plates
      ctx.fillStyle = def.secondaryColor;
      ctx.fillRect(-10, -20, 30, 8);
      ctx.fillRect(-10, 12, 30, 8);
      // Twin Barrels
      ctx.fillStyle = def.color;
      ctx.fillRect(40, -12, 30, 8);
      ctx.fillRect(40, 4, 30, 8);
      // Glow Core
      ctx.fillStyle = def.glowColor;
      ctx.beginPath();
      ctx.ellipse(15, 0, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'multi_chamber': {
      // MK-III Tri-Core Rifle
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(-20, -18, 65, 36);
      // Gold trims
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-15, -22, 20, 4);
      ctx.fillRect(-15, 18, 20, 4);
      // Triple Barrels
      ctx.fillStyle = def.color;
      ctx.fillRect(45, -14, 32, 6);
      ctx.fillRect(45, -3, 35, 6);
      ctx.fillRect(45, 8, 32, 6);
      // Tri Energy Coils
      ctx.fillStyle = def.glowColor;
      [0, 18, 36].forEach(cx => {
        ctx.beginPath();
        ctx.arc(cx - 5, 0, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case 'vortex': {
      // MK-IV Vortex Cannon
      ctx.fillStyle = '#3b0764';
      ctx.fillRect(-25, -22, 75, 44);
      // Heavy Vortex Ring Wings
      ctx.fillStyle = def.secondaryColor;
      ctx.beginPath();
      ctx.arc(0, -22, 14, 0, Math.PI * 2);
      ctx.arc(0, 22, 14, 0, Math.PI * 2);
      ctx.fill();
      // Wide Vortex Emitter Mouth
      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.moveTo(50, -22);
      ctx.lineTo(85, -28);
      ctx.lineTo(85, 28);
      ctx.lineTo(50, 22);
      ctx.closePath();
      ctx.fill();
      // Glowing Core
      ctx.fillStyle = def.glowColor;
      ctx.beginPath();
      ctx.arc(20, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'singularity': {
      // MK-V Cosmic Singularity Destroyer
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-30, -26, 85, 52);
      // Divine Gold Armor Wings
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-20, -26);
      ctx.lineTo(30, -38);
      ctx.lineTo(50, -26);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-20, 26);
      ctx.lineTo(30, 38);
      ctx.lineTo(50, 26);
      ctx.closePath();
      ctx.fill();

      // Quad Antimatter Barrels
      ctx.fillStyle = '#fbbf24';
      [-18, -6, 6, 18].forEach(by => {
        ctx.fillRect(55, by - 2, 40, 5);
      });

      // Rotating Singularity Core Center
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(15, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(15, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}
