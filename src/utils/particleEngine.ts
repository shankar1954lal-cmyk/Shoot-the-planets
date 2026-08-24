import { Particle, ActivePlanet, PlanetType } from '../types/game';
import { PLANET_DEFINITIONS } from './planetGenerator';

// Palette definitions for planetary debris and sparks
const PLANET_PALETTES: Record<PlanetType, { primary: string; secondary: string; highlight: string; dark: string }> = {
  earth: { primary: '#38bdf8', secondary: '#22c55e', highlight: '#bae6fd', dark: '#1e3a8a' },
  mars: { primary: '#f97316', secondary: '#ef4444', highlight: '#fed7aa', dark: '#7f1d1d' },
  desert: { primary: '#eab308', secondary: '#d97706', highlight: '#fef08a', dark: '#78350f' },
  rocky: { primary: '#94a3b8', secondary: '#64748b', highlight: '#e2e8f0', dark: '#334155' },
  ice: { primary: '#22d3ee', secondary: '#38bdf8', highlight: '#ffffff', dark: '#164e63' },
  volcanic: { primary: '#ef4444', secondary: '#f97316', highlight: '#fef08a', dark: '#450a0a' },
  gas_giant: { primary: '#a855f7', secondary: '#c084fc', highlight: '#e9d5ff', dark: '#581c87' },
  crystal: { primary: '#ec4899', secondary: '#f43f5e', highlight: '#fbcfe8', dark: '#831843' },
  special_golden: { primary: '#facc15', secondary: '#fbbf24', highlight: '#ffffff', dark: '#78350f' },
  special_legendary: { primary: '#f43f5e', secondary: '#fbbf24', highlight: '#ffffff', dark: '#881337' },
};

export type QualityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PoolParticle extends Particle {
  active: boolean;
  priority: number; // 0: minor (trail), 1: medium (smoke/ember), 2: high (spark/debris), 3: essential (coin/flash/shockwave)
}

/**
 * HIGH-PERFORMANCE OBJECT-POOLED PARTICLE ENGINE
 * Zero allocation per frame, strictly enforced 150-particle budget,
 * zero shadowBlur canvas overhead, adaptive FPS scaling for 60 FPS mobile target.
 */
export class ParticleEngine {
  private pool: PoolParticle[] = [];
  private maxParticles: number = 150;
  private qualityLevel: QualityLevel = 'MEDIUM';
  private frameTimes: number[] = [];

  constructor(maxParticles: number = 150) {
    this.maxParticles = maxParticles;

    // Preallocate a fixed pool of 150 reusable particle objects ONCE
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool.push({
        active: false,
        priority: 0,
        id: i.toString(),
        type: 'spark',
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 0,
        color: '#ffffff',
        secondaryColor: undefined,
        glowColor: undefined,
        alpha: 0,
        life: 0,
        maxLife: 1,
        drag: undefined,
        gravity: undefined,
        rotation: undefined,
        rotationSpeed: undefined,
        polygonSides: undefined,
        strokeWidth: undefined,
        isCoin: false,
        targetX: undefined,
        targetY: undefined,
      });
    }
  }

  public setQuality(quality: QualityLevel) {
    this.qualityLevel = quality;
  }

  public getQuality(): QualityLevel {
    return this.qualityLevel;
  }

  public reset() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.pool[i].active = false;
    }
  }

  /**
   * Acquires an inactive particle from pool or recycles an existing minor particle.
   */
  public obtainParticle(priority: number = 1): PoolParticle | null {
    // 1. Find inactive particle
    for (let i = 0; i < this.maxParticles; i++) {
      if (!this.pool[i].active) {
        this.pool[i].active = true;
        this.pool[i].priority = priority;
        return this.pool[i];
      }
    }

    // 2. Pool full (150 active particles). Recycle lowest priority particle if candidate is higher priority
    let lowestIdx = -1;
    let lowestPriority = priority;
    let oldestLife = -1;

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (p.priority < lowestPriority || (p.priority === lowestPriority && p.life > oldestLife)) {
        lowestPriority = p.priority;
        lowestIdx = i;
        oldestLife = p.life;
      }
    }

    if (lowestIdx !== -1) {
      const recycled = this.pool[lowestIdx];
      recycled.active = true;
      recycled.priority = priority;
      return recycled;
    }

    // 3. Strict Particle Budget reached - skip spawning
    return null;
  }

  /**
   * Spawns planet explosion using pooled particles according to quality limits
   */
  public spawnPlanetExplosion(
    planet: ActivePlanet,
    isCritical: boolean,
    userHighQualityPref: boolean
  ) {
    const isSpecial = planet.isSpecial;
    const def = PLANET_DEFINITIONS[planet.type];
    const palette = PLANET_PALETTES[planet.type] || PLANET_PALETTES.rocky;

    // Particle Count Limits based on Quality Mode
    // Low: 18-22 (normal) / 38-42 (special)
    // Medium: 24-28 (normal) / 48-52 (special)
    // High: 30-34 (normal) / 58-60 (special)
    let maxDebris = 8;
    let maxSparks = 8;
    let maxSmoke = 3;
    let coinCount = 3;

    if (this.qualityLevel === 'LOW') {
      maxDebris = isSpecial ? 14 : 5;
      maxSparks = isSpecial ? 16 : 6;
      maxSmoke = isSpecial ? 4 : 2;
      coinCount = isSpecial ? 6 : 2;
    } else if (this.qualityLevel === 'MEDIUM') {
      maxDebris = isSpecial ? 18 : 8;
      maxSparks = isSpecial ? 20 : 10;
      maxSmoke = isSpecial ? 6 : 3;
      coinCount = isSpecial ? 8 : 3;
    } else {
      maxDebris = isSpecial ? 22 : 12;
      maxSparks = isSpecial ? 24 : 14;
      maxSmoke = isSpecial ? 8 : 4;
      coinCount = isSpecial ? 10 : 4;
    }

    // 1. Central Radiant Flash (Priority 3 - Essential)
    const flash = this.obtainParticle(3);
    if (flash) {
      flash.type = 'flash';
      flash.x = planet.x;
      flash.y = planet.y;
      flash.vx = 0;
      flash.vy = 0;
      flash.radius = planet.radius * (isSpecial ? 1.3 : 1.1);
      flash.color = palette.highlight;
      flash.glowColor = def.glowColor;
      flash.alpha = 1.0;
      flash.life = 0;
      flash.maxLife = isSpecial ? 0.35 : 0.22; // < 0.4s for normal
      flash.drag = undefined;
      flash.gravity = undefined;
      flash.rotation = undefined;
      flash.rotationSpeed = undefined;
      flash.polygonSides = undefined;
      flash.strokeWidth = undefined;
      flash.isCoin = false;
    }

    // 2. Shockwave Ring (Priority 3 - Essential)
    const shockwave = this.obtainParticle(3);
    if (shockwave) {
      shockwave.type = 'shockwave';
      shockwave.x = planet.x;
      shockwave.y = planet.y;
      shockwave.vx = 0;
      shockwave.vy = 0;
      shockwave.radius = 8;
      shockwave.color = def.glowColor;
      shockwave.strokeWidth = isSpecial ? 6 : 4;
      shockwave.alpha = 1.0;
      shockwave.life = 0;
      shockwave.maxLife = isSpecial ? 0.4 : 0.28;
      shockwave.drag = undefined;
      shockwave.gravity = undefined;
      shockwave.rotation = undefined;
      shockwave.rotationSpeed = undefined;
      shockwave.polygonSides = undefined;
      shockwave.isCoin = false;
    }

    // 3. Rotating Debris Chunks (Priority 2 - High)
    for (let i = 0; i < maxDebris; i++) {
      const p = this.obtainParticle(2);
      if (!p) break;

      const angle = (i / maxDebris) * Math.PI * 2 + Math.random() * 0.4;
      const speed = Math.random() * (isSpecial ? 8 : 5) + 2.5;
      const colorRand = Math.random();
      const chunkColor = colorRand > 0.6 ? palette.primary : colorRand > 0.3 ? palette.secondary : palette.dark;

      p.type = 'debris';
      p.x = planet.x + (Math.random() * 16 - 8);
      p.y = planet.y + (Math.random() * 16 - 8);
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.radius = Math.random() * (isSpecial ? 7 : 5) + 2.5;
      p.color = chunkColor;
      p.secondaryColor = palette.dark;
      p.glowColor = def.glowColor;
      p.alpha = 1.0;
      p.life = 0;
      p.maxLife = isSpecial ? (Math.random() * 0.25 + 0.4) : (Math.random() * 0.2 + 0.25); // 0.25-0.45s
      p.drag = 0.94;
      p.gravity = 0.12;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotationSpeed = (Math.random() - 0.5) * 0.3;
      p.polygonSides = Math.floor(Math.random() * 3) + 3;
      p.isCoin = false;
    }

    // 4. Spark Trails (Priority 2 - High)
    for (let i = 0; i < maxSparks; i++) {
      const p = this.obtainParticle(2);
      if (!p) break;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isSpecial ? 11 : 8) + 3.5;

      p.type = 'spark';
      p.x = planet.x;
      p.y = planet.y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.radius = Math.random() * 2.5 + 1.2;
      p.color = Math.random() > 0.3 ? palette.highlight : def.glowColor;
      p.glowColor = def.glowColor;
      p.alpha = 1.0;
      p.life = 0;
      p.maxLife = isSpecial ? (Math.random() * 0.25 + 0.35) : (Math.random() * 0.15 + 0.2); // 0.2-0.35s
      p.drag = 0.92;
      p.gravity = undefined;
      p.rotation = undefined;
      p.rotationSpeed = undefined;
      p.polygonSides = undefined;
      p.isCoin = false;
    }

    // 5. Smoke/Ember Clouds (Priority 1 - Medium)
    for (let i = 0; i < maxSmoke; i++) {
      const p = this.obtainParticle(1);
      if (!p) break;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;

      p.type = Math.random() > 0.5 ? 'smoke' : 'ember';
      p.x = planet.x + (Math.random() * 20 - 10);
      p.y = planet.y + (Math.random() * 20 - 10);
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 0.5;
      p.radius = Math.random() * (isSpecial ? 10 : 7) + 3;
      p.color = Math.random() > 0.5 ? palette.secondary : '#334155';
      p.glowColor = def.glowColor;
      p.alpha = 0.7;
      p.life = 0;
      p.maxLife = isSpecial ? 0.45 : 0.32;
      p.drag = 0.95;
      p.gravity = undefined;
      p.rotation = undefined;
      p.rotationSpeed = undefined;
      p.polygonSides = undefined;
      p.isCoin = false;
    }

    // 6. Coins (Priority 3 - Essential)
    for (let i = 0; i < coinCount; i++) {
      const p = this.obtainParticle(3);
      if (!p) break;

      p.type = 'coin';
      p.isCoin = true;
      p.x = planet.x + (Math.random() * 24 - 12);
      p.y = planet.y + (Math.random() * 24 - 12);
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 0.5) * 6 - 2;
      p.radius = 6;
      p.color = '#facc15';
      p.glowColor = '#fef08a';
      p.alpha = 1.0;
      p.life = 0;
      p.maxLife = 0.65;
      p.targetX = 40;
      p.targetY = 30;
      p.drag = undefined;
      p.gravity = undefined;
      p.rotation = undefined;
      p.rotationSpeed = undefined;
      p.polygonSides = undefined;
    }
  }

  /**
   * Spawns impact sparks against planet surface
   */
  public spawnImpactSparks(x: number, y: number, color: string, isCritical: boolean) {
    const count = this.qualityLevel === 'LOW' ? 3 : this.qualityLevel === 'MEDIUM' ? 5 : 8;

    for (let i = 0; i < count; i++) {
      const p = this.obtainParticle(2);
      if (!p) break;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isCritical ? 7 : 5) + 2;

      p.type = 'spark';
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.radius = Math.random() * 2 + 1;
      p.color = isCritical ? '#fef08a' : color;
      p.glowColor = color;
      p.alpha = 1.0;
      p.life = 0;
      p.maxLife = Math.random() * 0.12 + 0.12; // 0.12-0.24s
      p.drag = 0.92;
      p.gravity = undefined;
      p.rotation = undefined;
      p.rotationSpeed = undefined;
      p.polygonSides = undefined;
      p.isCoin = false;
    }
  }

  /**
   * Spawns lightweight projectile trail particles
   */
  public spawnProjectileTrail(x: number, y: number, radius: number, color: string) {
    if (this.qualityLevel === 'LOW' && Math.random() > 0.2) return;
    if (this.qualityLevel === 'MEDIUM' && Math.random() > 0.5) return;

    const p = this.obtainParticle(0); // Lowest priority (0)
    if (!p) return;

    p.type = 'spark';
    p.x = x + (Math.random() * 4 - 2);
    p.y = y + (Math.random() * 4 - 2);
    p.vx = (Math.random() - 0.5) * 1.2;
    p.vy = (Math.random() - 0.5) * 1.2;
    p.radius = radius * 0.5;
    p.color = color;
    p.glowColor = undefined;
    p.alpha = 0.7;
    p.life = 0;
    p.maxLife = 0.15;
    p.drag = undefined;
    p.gravity = undefined;
    p.rotation = undefined;
    p.rotationSpeed = undefined;
    p.polygonSides = undefined;
    p.isCoin = false;
  }

  /**
   * Main physics simulation update for all pooled particles (Zero Garbage Collection)
   */
  public update(dt: number) {
    // Adaptive Quality FPS Regulator
    this.frameTimes.push(dt);
    if (this.frameTimes.length > 30) this.frameTimes.shift();

    if (this.frameTimes.length === 30) {
      const avgDt = this.frameTimes.reduce((a, b) => a + b, 0) / 30;
      const currentFps = avgDt > 0 ? 1 / avgDt : 60;

      // Automatically drop quality if framerate dips on slower devices
      if (currentFps < 42 && this.qualityLevel !== 'LOW') {
        if (this.qualityLevel === 'HIGH') this.qualityLevel = 'MEDIUM';
        else if (this.qualityLevel === 'MEDIUM') this.qualityLevel = 'LOW';
        this.frameTimes = []; // reset window
      } else if (currentFps >= 58 && this.qualityLevel !== 'HIGH') {
        // Upgrade quality when running at stable 58+ FPS
        if (this.qualityLevel === 'LOW') this.qualityLevel = 'MEDIUM';
        this.frameTimes = [];
      }
    }

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        continue;
      }

      const lifeRatio = p.life / p.maxLife;
      p.alpha = Math.max(0, 1 - lifeRatio);

      // Lightweight physical calculations
      if (p.drag) {
        p.vx *= p.drag;
        p.vy *= p.drag;
      }

      if (p.gravity) {
        p.vy += p.gravity * dt * 60;
      }

      if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
        p.rotation += p.rotationSpeed * dt * 60;
      }

      if (p.type === 'shockwave') {
        p.radius += 180 * dt;
      }

      if (p.type === 'flash') {
        p.radius += 25 * dt;
      }

      if (p.type === 'smoke') {
        p.radius += 10 * dt;
      }

      // Coin homing
      if (p.isCoin && p.targetX !== undefined && p.targetY !== undefined) {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx += dx * 0.18 * dt * 60;
        p.vy += dy * 0.18 * dt * 60;
        p.vx *= 0.92;
        p.vy *= 0.92;
      }

      p.x += p.vx;
      p.y += p.vy;
    }
  }

  /**
   * Hardware-Accelerated Canvas Batch Renderer (NO shadowBlur overhead)
   */
  public render(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.pool[i];
      if (!p.active) continue;

      ctx.save();
      ctx.globalAlpha = p.alpha;

      switch (p.type) {
        case 'flash': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'shockwave': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, (p.strokeWidth || 4) * (1 - p.life / p.maxLife));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'debris': {
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          if (p.rotation !== undefined) {
            ctx.rotate(p.rotation);
          }

          const sides = p.polygonSides || 4;
          ctx.beginPath();
          for (let s = 0; s < sides; s++) {
            const angle = (s / sides) * Math.PI * 2;
            const r = s % 2 === 0 ? p.radius : p.radius * 0.6;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();

          if (p.secondaryColor) {
            ctx.fillStyle = p.secondaryColor;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'spark': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.radius;

          const trailX = p.x - p.vx * 2;
          const trailY = p.y - p.vy * 2;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(trailX, trailY);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'smoke':
        case 'ember': {
          if (p.type === 'ember') ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'coin': {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        default: {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
      }

      ctx.restore();
    }
  }
}
