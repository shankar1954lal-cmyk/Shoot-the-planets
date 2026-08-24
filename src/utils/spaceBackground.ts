import { BackgroundThemeCosmetic } from '../types/game';

interface StarLayer1 {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  speed: number;
}

interface StarLayer2 {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  speed: number;
}

interface StarLayer3 {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinklePhase: number;
  hasFlare: boolean;
  speed: number;
}

interface NebulaCloud {
  x: number;
  y: number;
  radiusRatio: number;
  driftX: number;
  driftY: number;
  pulsePhase: number;
  pulseSpeed: number;
  colorPrimary: string;
  colorSecondary: string;
}

interface CosmicDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  wavePhase: number;
  waveSpeed: number;
  color: string;
}

/**
 * HIGH-PERFORMANCE PARALLAX DEEP-SPACE BACKGROUND ENGINE
 * Multi-layer parallax depth with dynamic stars, twinkling clusters,
 * drifting nebulae, volumetric stardust, and screen shake coupling.
 */
export class SpaceBackgroundEngine {
  private width: number = 0;
  private height: number = 0;

  private layer1Stars: StarLayer1[] = []; // Deep stars (0.5 - 1.2px)
  private layer2Stars: StarLayer2[] = []; // Mid stars (1.2 - 2.2px, twinkling)
  private layer3Stars: StarLayer3[] = []; // Foreground bright stars (2.2 - 3.5px with cross flares)
  private cosmicDust: CosmicDust[] = [];   // Floating stardust specks
  private nebulae: NebulaCloud[] = [];     // Dynamic drifting cosmic nebulae

  private totalTime: number = 0;

  public init(w: number, h: number, theme: BackgroundThemeCosmetic) {
    this.width = w;
    this.height = h;

    this.layer1Stars = [];
    this.layer2Stars = [];
    this.layer3Stars = [];
    this.cosmicDust = [];
    this.nebulae = [];

    if (w <= 0 || h <= 0) return;

    // 1. Layer 1: Deep Distant Stars
    const countL1 = Math.floor((w * h) / 7500) + 60;
    for (let i = 0; i < countL1; i++) {
      this.layer1Stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 0.8 + 0.5,
        baseAlpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 8 + 6, // 6-14 px/s
      });
    }

    // 2. Layer 2: Midground Twinkling Stars
    const countL2 = Math.floor((w * h) / 12000) + 35;
    for (let i = 0; i < countL2; i++) {
      this.layer2Stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.0 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.4,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 3 + 1.5,
        speed: Math.random() * 15 + 18, // 18-33 px/s
      });
    }

    // 3. Layer 3: Foreground Cross Flare Stars
    const countL3 = Math.floor((w * h) / 25000) + 14;
    for (let i = 0; i < countL3; i++) {
      this.layer3Stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.2 + 2.2,
        baseAlpha: Math.random() * 0.3 + 0.6,
        twinklePhase: Math.random() * Math.PI * 2,
        hasFlare: Math.random() < 0.6,
        speed: Math.random() * 25 + 35, // 35-60 px/s
      });
    }

    // 4. Layer 4: Cosmic Dust Specks
    const countDust = Math.floor((w * h) / 18000) + 24;
    for (let i = 0; i < countDust; i++) {
      this.cosmicDust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: Math.random() * 0.6 + 0.4,
        size: Math.random() * 1.8 + 1.0,
        alpha: Math.random() * 0.5 + 0.3,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 1.5 + 0.8,
        color: i % 3 === 0 ? (theme.starTint || '#ffffff') : i % 2 === 0 ? '#38bdf8' : '#facc15',
      });
    }

    // 5. Deep Space Nebulae Clouds
    this.nebulae = [
      {
        x: 0.3,
        y: 0.25,
        radiusRatio: 0.55,
        driftX: 0.003,
        driftY: 0.002,
        pulsePhase: 0,
        pulseSpeed: 0.4,
        colorPrimary: theme.gradientStart || 'rgba(126, 34, 206, 0.25)',
        colorSecondary: theme.gradientMid || 'rgba(30, 58, 138, 0.15)',
      },
      {
        x: 0.75,
        y: 0.65,
        radiusRatio: 0.5,
        driftX: -0.002,
        driftY: 0.003,
        pulsePhase: 2.1,
        pulseSpeed: 0.3,
        colorPrimary: theme.gradientMid || 'rgba(56, 189, 248, 0.2)',
        colorSecondary: 'rgba(168, 85, 247, 0.12)',
      },
      {
        x: 0.5,
        y: 0.85,
        radiusRatio: 0.6,
        driftX: 0.001,
        driftY: -0.002,
        pulsePhase: 4.2,
        pulseSpeed: 0.35,
        colorPrimary: 'rgba(15, 23, 42, 0.4)',
        colorSecondary: theme.gradientStart || 'rgba(126, 34, 206, 0.15)',
      },
    ];
  }

  public resize(w: number, h: number, theme: BackgroundThemeCosmetic) {
    if (this.width !== w || this.height !== h) {
      this.init(w, h, theme);
    }
  }

  public update(dt: number) {
    this.totalTime += dt;
    const w = this.width;
    const h = this.height;
    if (w <= 0 || h <= 0) return;

    // 1. Layer 1 Parallax Update
    for (let i = 0; i < this.layer1Stars.length; i++) {
      const s = this.layer1Stars[i];
      s.y += s.speed * dt;
      if (s.y > h) {
        s.y = 0;
        s.x = Math.random() * w;
      }
    }

    // 2. Layer 2 Parallax Update
    for (let i = 0; i < this.layer2Stars.length; i++) {
      const s = this.layer2Stars[i];
      s.y += s.speed * dt;
      s.twinklePhase += s.twinkleSpeed * dt;
      if (s.y > h) {
        s.y = 0;
        s.x = Math.random() * w;
      }
    }

    // 3. Layer 3 Parallax Update
    for (let i = 0; i < this.layer3Stars.length; i++) {
      const s = this.layer3Stars[i];
      s.y += s.speed * dt;
      s.twinklePhase += 2.0 * dt;
      if (s.y > h) {
        s.y = 0;
        s.x = Math.random() * w;
      }
    }

    // 4. Cosmic Dust Floating Update
    for (let i = 0; i < this.cosmicDust.length; i++) {
      const d = this.cosmicDust[i];
      d.wavePhase += d.waveSpeed * dt;
      d.x += (Math.sin(d.wavePhase) * 0.6 + d.vx) * dt * 60;
      d.y += d.vy * dt * 60;

      if (d.y > h) {
        d.y = 0;
        d.x = Math.random() * w;
      }
      if (d.x < 0) d.x = w;
      if (d.x > w) d.x = 0;
    }

    // 5. Nebulae Drift & Breathing Pulsation
    for (let i = 0; i < this.nebulae.length; i++) {
      const neb = this.nebulae[i];
      neb.pulsePhase += neb.pulseSpeed * dt;
      neb.x += neb.driftX * dt * 0.1;
      neb.y += neb.driftY * dt * 0.1;

      if (neb.x < 0.1) neb.driftX = Math.abs(neb.driftX);
      if (neb.x > 0.9) neb.driftX = -Math.abs(neb.driftX);
      if (neb.y < 0.1) neb.driftY = Math.abs(neb.driftY);
      if (neb.y > 0.9) neb.driftY = -Math.abs(neb.driftY);
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    theme: BackgroundThemeCosmetic,
    shakeX: number = 0,
    shakeY: number = 0
  ) {
    const w = this.width;
    const h = this.height;
    if (w <= 0 || h <= 0) return;

    // 0. Base Deep Void Background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    // 1. Render Deep Space Nebulae Clouds (Parallax Factor 0.05)
    const nebShakeX = shakeX * 0.05;
    const nebShakeY = shakeY * 0.05;

    for (let i = 0; i < this.nebulae.length; i++) {
      const neb = this.nebulae[i];
      const cx = neb.x * w + nebShakeX;
      const cy = neb.y * h + nebShakeY;
      const baseR = Math.min(w, h) * neb.radiusRatio;
      const pulseR = baseR * (1 + Math.sin(neb.pulsePhase) * 0.08);

      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, pulseR);
      grad.addColorStop(0, theme.gradientStart || neb.colorPrimary);
      grad.addColorStop(0.55, theme.gradientMid || neb.colorSecondary);
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Render Layer 1: Deep Distant Stars (Parallax Factor 0.15)
    const l1ShakeX = shakeX * 0.15;
    const l1ShakeY = shakeY * 0.15;
    ctx.fillStyle = theme.starTint || '#ffffff';

    for (let i = 0; i < this.layer1Stars.length; i++) {
      const s = this.layer1Stars[i];
      ctx.globalAlpha = s.baseAlpha;
      ctx.beginPath();
      ctx.arc(s.x + l1ShakeX, s.y + l1ShakeY, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Render Layer 2: Midground Twinkling Stars (Parallax Factor 0.35)
    const l2ShakeX = shakeX * 0.35;
    const l2ShakeY = shakeY * 0.35;

    for (let i = 0; i < this.layer2Stars.length; i++) {
      const s = this.layer2Stars[i];
      const alpha = Math.max(0.1, Math.min(1.0, s.baseAlpha + Math.sin(s.twinklePhase) * 0.25));
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x + l2ShakeX, s.y + l2ShakeY, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Render Layer 3: Foreground Bright Stars & Cross Flares (Parallax Factor 0.65)
    const l3ShakeX = shakeX * 0.65;
    const l3ShakeY = shakeY * 0.65;

    for (let i = 0; i < this.layer3Stars.length; i++) {
      const s = this.layer3Stars[i];
      const alpha = Math.max(0.2, Math.min(1.0, s.baseAlpha + Math.sin(s.twinklePhase) * 0.2));
      const sx = s.x + l3ShakeX;
      const sy = s.y + l3ShakeY;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
      ctx.fill();

      if (s.hasFlare && alpha > 0.5) {
        ctx.strokeStyle = theme.starTint || '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = alpha * 0.5;

        const flareLen = s.size * 3.5;
        ctx.beginPath();
        ctx.moveTo(sx - flareLen, sy);
        ctx.lineTo(sx + flareLen, sy);
        ctx.moveTo(sx, sy - flareLen);
        ctx.lineTo(sx, sy + flareLen);
        ctx.stroke();
      }
    }

    // 5. Render Layer 4: Cosmic Dust Specks (Parallax Factor 0.85)
    const dShakeX = shakeX * 0.85;
    const dShakeY = shakeY * 0.85;

    for (let i = 0; i < this.cosmicDust.length; i++) {
      const d = this.cosmicDust[i];
      ctx.globalAlpha = d.alpha;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x + dShakeX, d.y + dShakeY, d.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
  }
}
