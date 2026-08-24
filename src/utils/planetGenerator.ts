import { PlanetType, PlanetDefinition } from '../types/game';

export const PLANET_DEFINITIONS: Record<PlanetType, PlanetDefinition> = {
  earth: {
    type: 'earth',
    name: 'Terra Nova',
    coinValue: 5,
    baseRadius: 42,
    glowColor: '#38bdf8',
    atmosphereColor: 'rgba(56, 189, 248, 0.4)',
    isSpecial: false,
    spawnWeight: 20,
  },
  mars: {
    type: 'mars',
    name: 'Ares Prime',
    coinValue: 5,
    baseRadius: 38,
    glowColor: '#f97316',
    atmosphereColor: 'rgba(249, 115, 22, 0.35)',
    isSpecial: false,
    spawnWeight: 18,
  },
  desert: {
    type: 'desert',
    name: 'Dune Sovereign',
    coinValue: 5,
    baseRadius: 40,
    glowColor: '#eab308',
    atmosphereColor: 'rgba(234, 179, 8, 0.3)',
    isSpecial: false,
    spawnWeight: 16,
  },
  rocky: {
    type: 'rocky',
    name: 'Basalt Core',
    coinValue: 5,
    baseRadius: 36,
    glowColor: '#94a3b8',
    atmosphereColor: 'rgba(148, 163, 184, 0.25)',
    isSpecial: false,
    spawnWeight: 16,
  },
  ice: {
    type: 'ice',
    name: 'Glacies IV',
    coinValue: 5,
    baseRadius: 40,
    glowColor: '#22d3ee',
    atmosphereColor: 'rgba(34, 211, 238, 0.4)',
    isSpecial: false,
    spawnWeight: 14,
  },
  volcanic: {
    type: 'volcanic',
    name: 'Pyroclast',
    coinValue: 5,
    baseRadius: 44,
    glowColor: '#ef4444',
    atmosphereColor: 'rgba(239, 68, 68, 0.45)',
    isSpecial: false,
    spawnWeight: 12,
  },
  gas_giant: {
    type: 'gas_giant',
    name: 'Zephyrus Major',
    coinValue: 5,
    baseRadius: 48,
    glowColor: '#a855f7',
    atmosphereColor: 'rgba(168, 85, 247, 0.4)',
    isSpecial: false,
    spawnWeight: 10,
  },
  crystal: {
    type: 'crystal',
    name: 'Krystala',
    coinValue: 5,
    baseRadius: 40,
    glowColor: '#ec4899',
    atmosphereColor: 'rgba(236, 72, 153, 0.4)',
    isSpecial: false,
    spawnWeight: 8,
  },
  special_golden: {
    type: 'special_golden',
    name: 'AUREUM CORE (RARE)',
    coinValue: 50,
    baseRadius: 52,
    glowColor: '#fbbf24',
    atmosphereColor: 'rgba(251, 191, 36, 0.65)',
    isSpecial: true,
    spawnWeight: 7, // Rare 50-coin planet
  },
  special_legendary: {
    type: 'special_legendary',
    name: 'SUPERNOVA PRIMUS (LEGENDARY)',
    coinValue: 100,
    baseRadius: 56,
    glowColor: '#f43f5e',
    atmosphereColor: 'rgba(244, 63, 94, 0.8)',
    isSpecial: true,
    spawnWeight: 2, // Very rare 100-coin planet
  },
};

// Cache for planet procedural texture canvases
const textureCache: Map<PlanetType, HTMLCanvasElement> = new Map();

export function getPlanetTexture(type: PlanetType): HTMLCanvasElement {
  if (textureCache.has(type)) {
    return textureCache.get(type)!;
  }

  const canvas = document.createElement('canvas');
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Generate procedural texture based on type
  renderPlanetTexture(ctx, type, size);

  textureCache.set(type, canvas);
  return canvas;
}

function renderPlanetTexture(ctx: CanvasRenderingContext2D, type: PlanetType, size: number) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  ctx.clearRect(0, 0, size, size);

  switch (type) {
    case 'earth': {
      // Ocean base
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Landmasses (Green/Brown organic blobs)
      ctx.fillStyle = '#15803d';
      const landSpots = [
        { x: cx - 30, y: cy - 20, r: 40 },
        { x: cx + 40, y: cy + 10, r: 35 },
        { x: cx - 20, y: cy + 40, r: 30 },
        { x: cx + 20, y: cy - 50, r: 25 },
        { x: cx - 60, y: cy - 40, r: 20 },
      ];
      landSpots.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Brown terrain accents
      ctx.fillStyle = '#a16207';
      landSpots.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x + 5, s.y - 5, s.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // White polar caps
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(cx, cy - r + 10, r * 0.6, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy + r - 10, r * 0.6, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cloud swirls
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.ellipse(cx + Math.cos(angle) * 35, cy + Math.sin(angle) * 35, 30, 8, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'mars': {
      // Rust red base
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#c2410c');
      grad.addColorStop(1, '#7c2d12');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Dark basalt regions
      ctx.fillStyle = 'rgba(67, 20, 7, 0.5)';
      for (let i = 0; i < 8; i++) {
        const x = cx + Math.sin(i * 1.5) * 45;
        const y = cy + Math.cos(i * 2.1) * 45;
        ctx.beginPath();
        ctx.arc(x, y, 22 + (i % 3) * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Craters
      ctx.fillStyle = '#451a03';
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      const craters = [
        { x: cx - 20, y: cy - 20, r: 10 },
        { x: cx + 30, y: cy + 30, r: 14 },
        { x: cx + 15, y: cy - 40, r: 8 },
        { x: cx - 40, y: cy + 20, r: 12 },
      ];
      craters.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Polar ice cap
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.ellipse(cx, cy - r + 8, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'desert': {
      // Golden orange dunes
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Dune stripes
      ctx.fillStyle = '#b45309';
      for (let i = -r; i < r; i += 18) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + i, Math.sqrt(r * r - i * i), 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rocky dust patches
      ctx.fillStyle = '#78350f';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(i) * 35, cy + Math.sin(i) * 35, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'rocky': {
      // Gray stone base
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Craters & bumpy surface
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        const x = cx + Math.cos(i * 0.8) * (20 + (i % 4) * 15);
        const y = cy + Math.sin(i * 1.3) * (20 + (i % 3) * 15);
        const cr = 8 + (i % 5) * 4;
        ctx.beginPath();
        ctx.arc(x, y, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    case 'ice': {
      // Shimmering cyan-white
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(0.7, '#38bdf8');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Glacier fracture lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(i) * 20, cy + Math.sin(i) * 20);
        ctx.lineTo(cx + Math.cos(i * 1.5) * (r - 10), cy + Math.sin(i * 1.5) * (r - 10));
        ctx.stroke();
      }
      break;
    }

    case 'volcanic': {
      // Dark charcoal crust
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Glowing lava fissures
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * 10, cy + Math.sin(a1) * 10);
        ctx.bezierCurveTo(
          cx + Math.cos(a1 + 0.5) * 40,
          cy + Math.sin(a1 + 0.5) * 40,
          cx + Math.cos(a1 - 0.2) * 80,
          cy + Math.sin(a1 - 0.2) * 80,
          cx + Math.cos(a1) * (r - 8),
          cy + Math.sin(a1) * (r - 8)
        );
        ctx.stroke();
      }
      ctx.shadowBlur = 0; // reset
      break;
    }

    case 'gas_giant': {
      // Purple / Magenta atmospheric bands
      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      const bands = ['#7e22ce', '#c084fc', '#3b0764', '#a855f7', '#6b21a8'];
      bands.forEach((bColor, idx) => {
        ctx.fillStyle = bColor;
        const yOffset = -r + (idx + 1) * (size / 6);
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOffset * 0.6, Math.sqrt(Math.max(0, r * r - yOffset * yOffset)), 14, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Great Purple Storm Eye
      ctx.fillStyle = '#e879f9';
      ctx.beginPath();
      ctx.ellipse(cx + 30, cy + 15, 22, 14, -0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'crystal': {
      // Crystalline facets
      ctx.fillStyle = '#831843';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Facets (geometric polygon triangles)
      const facetColors = ['#db2777', '#f472b6', '#9d174d', '#f43f5e', '#be123c'];
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = facetColors[i % facetColors.length];
        const a1 = (i * Math.PI) / 6;
        const a2 = ((i + 1) * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
        ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }

    case 'special_golden': {
      // RARE 100-COIN GOLDEN CYBER CORE
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#eab308');
      grad.addColorStop(1, '#854d0e');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Cybernetic golden grid lines
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 3;

      // Concentric energy circles
      [20, 45, 70, 95].forEach(cr => {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Cross spokes
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * (r - 4), cy + Math.sin(angle) * (r - 4));
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      break;
    }

    case 'special_legendary': {
      // Crimson / Ruby Star Base
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#f43f5e');
      grad.addColorStop(0.6, '#be123c');
      grad.addColorStop(1, '#881337');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Diamond laser geometry grid
      ctx.strokeStyle = '#fef08a';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 3;

      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 15, cy + Math.sin(angle) * 15);
        ctx.lineTo(cx + Math.cos(angle) * (r - 2), cy + Math.sin(angle) * (r - 2));
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
      break;
    }
  }

  // Clip 3D Spherical Shadow overlay so planets look like rendered 3D orbs
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Top-left highlight & Bottom-right ambient shadow
  const shadowGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 10, cx, cy, r);
  shadowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  shadowGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
  shadowGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.45)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();
}

/**
 * Draws a rendered planet onto a canvas with rotation, atmospheric rim glow, and golden rings for special planets.
 */
export function drawPlanetOnCanvas(
  ctx: CanvasRenderingContext2D,
  type: PlanetType,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  isSpecial: boolean = false
) {
  const def = PLANET_DEFINITIONS[type];
  const texture = getPlanetTexture(type);

  ctx.save();

  // Draw Outer Atmosphere Glow
  ctx.shadowColor = def.glowColor;
  ctx.shadowBlur = isSpecial ? 25 : 12;

  if (isSpecial) {
    // Draw rotating Golden Energy Rings around Special Planet
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * 0.5);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.6, radius * 0.5, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.8, radius * 0.6, -Math.PI / 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Draw Main Planet Spherical Texture
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.drawImage(texture, -radius, -radius, radius * 2, radius * 2);

  ctx.restore();
}
