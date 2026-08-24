import React, { useRef, useEffect } from 'react';
import {
  UserProgress,
  GameSettings,
  ActivePlanet,
  Projectile,
  Particle,
  FloatingText,
  PlanetType,
} from '../types/game';
import { PLANET_DEFINITIONS, drawPlanetOnCanvas } from '../utils/planetGenerator';
import { WEAPON_CATALOG, calculateEffectiveStats, drawWeaponOnCanvas } from '../utils/weapons';
import { soundEngine } from '../utils/audio';
import { SKINS_CATALOG, TRAILS_CATALOG, THEMES_CATALOG } from '../utils/cosmeticsCatalog';
import { ParticleEngine } from '../utils/particleEngine';
import { SpaceBackgroundEngine } from '../utils/spaceBackground';

interface GameCanvasProps {
  progress: UserProgress;
  settings: GameSettings;
  score: number;
  combo: number;
  hearts: number;
  runXp: number;
  isPaused: boolean;
  onUpdateScore: (addedScore: number, addedCoins: number, addedXp: number, newCombo: number) => void;
  onLoseHeart: () => void;
  onGameOver: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  progress,
  settings,
  score,
  combo,
  hearts,
  runXp,
  isPaused,
  onUpdateScore,
  onLoseHeart,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep state intact inside 60FPS loop without stale closures
  const stateRef = useRef({
    progress,
    settings,
    score,
    combo,
    hearts,
    runXp,
    isPaused,
  });

  useEffect(() => {
    stateRef.current = { progress, settings, score, combo, hearts, runXp, isPaused };
  }, [progress, settings, score, combo, hearts, runXp, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // --- GAME ENGINE ENTITIES ---
    let activePlanets: ActivePlanet[] = [];
    let projectiles: Projectile[] = [];
    const particleEngine = new ParticleEngine(150);
    let floatingTexts: FloatingText[] = [];

    let cannonAngle = -Math.PI / 2; // Facing straight up
    let recoilOffset = 0;
    let muzzleFlashLife = 0;
    let screenShakeTime = 0;
    let screenShakeIntensity = 0;

    // Multi-Planet Wave Spawning State
    let pendingSpawns = 0;
    let launchDelayTimer = 0.2; // Seconds between launches in a wave
    let waveCooldownTimer = 0.5; // Breathing room between waves
    let availableSectors = [0, 1, 2];

    const spaceBackgroundEngine = new SpaceBackgroundEngine();

    // Resize Handler
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const activeTheme = THEMES_CATALOG.find(t => t.id === stateRef.current.progress.equippedTheme) || THEMES_CATALOG[0];
      spaceBackgroundEngine.resize(width, height, activeTheme);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // --- PLANET LAUNCH PHYSICS ENGINE ---
    const spawnSinglePlanetFromQueue = () => {
      if (width <= 0 || height <= 0) return;

      const runXp = stateRef.current.runXp;
      const speedMultiplier = Math.min(2.8, 1.0 + 0.35 * Math.pow(runXp / 300, 0.6));

      if (availableSectors.length === 0) {
        availableSectors = [0, 1, 2];
      }
      const sectorIndex = availableSectors.splice(
        Math.floor(Math.random() * availableSectors.length),
        1
      )[0];

      const sectorRanges = [
        [width * 0.12, width * 0.34],
        [width * 0.38, width * 0.62],
        [width * 0.66, width * 0.88],
      ];

      const [minX, maxX] = sectorRanges[sectorIndex] || [width * 0.2, width * 0.8];
      const spawnX = minX + Math.random() * (maxX - minX);

      // Decide Planet Type: Legendary (+100) vs Rare (+50) vs Normal (+5)
      const roll = Math.random();
      let selectedType: PlanetType = 'earth';

      if (roll < 0.02) {
        // 2% Very Rare Legendary Planet (+100 coins)
        selectedType = 'special_legendary';
      } else if (roll < 0.09) {
        // 7% Rare Special Planet (+50 coins)
        selectedType = 'special_golden';
      } else {
        // 91% Normal Planets (+5 coins)
        const normalTypes: PlanetType[] = ['earth', 'mars', 'desert', 'rocky', 'ice', 'volcanic', 'gas_giant', 'crystal'];
        selectedType = normalTypes[Math.floor(Math.random() * normalTypes.length)];
      }

      const def = PLANET_DEFINITIONS[selectedType];
      const baseR = def.baseRadius * (width < 600 ? 0.85 : 1.0);
      const radius = Math.max(22, baseR * Math.max(0.7, 1.0 - (speedMultiplier - 1.0) * 0.12));
      const spawnY = height + radius + 10;

      const targetCenters = [width * 0.4, width * 0.5, width * 0.6];
      const targetCenterX = targetCenters[sectorIndex] + (Math.random() * 100 - 50);
      const deltaX = targetCenterX - spawnX;

      const baseUpwardVelocity = -(height * 0.021 + Math.random() * (height * 0.005));
      const vy = baseUpwardVelocity * speedMultiplier;
      const gravity = 0.35 * Math.pow(speedMultiplier, 0.8);

      const timeToApex = Math.abs(vy / gravity);
      const vx = deltaX / (timeToApex * 1.8);

      activePlanets.push({
        id: Math.random().toString(),
        type: selectedType,
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        radius,
        mass: radius * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        coinValue: def.coinValue,
        isSpecial: def.isSpecial,
        maxHp: selectedType === 'special_legendary' ? 3 : def.isSpecial ? 2 : 1,
        currentHp: selectedType === 'special_legendary' ? 3 : def.isSpecial ? 2 : 1,
        timeAlive: 0,
      });
    };

    // --- SHOOTING & CANNON MECHANICS ---
    const handleTapToShoot = (clientX: number, clientY: number) => {
      const { progress: p, hearts, isPaused } = stateRef.current;
      if (isPaused || hearts <= 0) return;

      const rect = canvas.getBoundingClientRect();
      const tapX = clientX - rect.left;
      const tapY = clientY - rect.top;

      // Cannon Position: Bottom Center
      const cannonX = width * 0.5;
      const cannonY = height - 40;

      // Calculate Aim Angle
      const dx = tapX - cannonX;
      const dy = tapY - cannonY;
      const angle = Math.atan2(dy, dx);

      // Clamp angle so cannon only aims upwards (-170 deg to -10 deg)
      const clampedAngle = Math.max(-Math.PI * 0.95, Math.min(-Math.PI * 0.05, angle));
      cannonAngle = clampedAngle;

      // Trigger recoil & muzzle flash
      recoilOffset = 18;
      muzzleFlashLife = 0.1;

      // Get Weapon Effective Stats
      const weaponId = p.equippedWeapon;
      const upgrades = p.weaponUpgrades[weaponId] || { damage: 0, fireRate: 0, energy: 0, critical: 0 };
      const stats = calculateEffectiveStats(weaponId, upgrades);
      const weaponDef = WEAPON_CATALOG[weaponId];

      // Play Weapon Shoot Audio
      soundEngine.playShootSound(weaponId);

      // Calculate Projectile Speed & Radius
      const projSpeed = 18 + stats.fireRate * 2.5;
      const projRadius = 6 + stats.energy * 1.5;

      // Critical Roll
      const isCrit = Math.random() < stats.critical / 100 + 0.05;
      const damageVal = stats.damage * (isCrit ? 2 : 1);

      // Get Equipped Trail Cosmetic
      const activeTrail = TRAILS_CATALOG.find(t => t.id === p.equippedTrail) || TRAILS_CATALOG[0];

      // Spawn Projectile
      projectiles.push({
        id: Math.random().toString(),
        x: cannonX + Math.cos(clampedAngle) * 50,
        y: cannonY + Math.sin(clampedAngle) * 50,
        vx: Math.cos(clampedAngle) * projSpeed,
        vy: Math.sin(clampedAngle) * projSpeed,
        radius: projRadius,
        damage: damageVal,
        isCritical: isCrit,
        color: activeTrail.color || weaponDef.projectileColor,
        trailColor: activeTrail.color || weaponDef.glowColor,
      });
    };

    // Touch / Pointer Event Listeners
    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      handleTapToShoot(e.clientX, e.clientY);
    };

    canvas.addEventListener('pointerdown', handlePointerDown);

    // --- MAIN 60 FPS RENDER & PHYSICS LOOP ---
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const { isPaused, hearts, combo, settings: st } = stateRef.current;

      if (!isPaused && hearts > 0) {
        // --- 1. UPDATE PHYSICS ---

        // Recoil decay
        recoilOffset = Math.max(0, recoilOffset - dt * 90);
        muzzleFlashLife = Math.max(0, muzzleFlashLife - dt);

        // Screen Shake decay
        if (screenShakeTime > 0) {
          screenShakeTime -= dt;
        }

        // --- SMART SPAWN MANAGER ---
        if (pendingSpawns === 0 && activePlanets.length < 3) {
          waveCooldownTimer -= dt;
          if (waveCooldownTimer <= 0) {
            const xp = stateRef.current.runXp;
            const h = stateRef.current.hearts;

            let desiredWave = 1;
            if (xp < 80) {
              desiredWave = Math.random() < 0.05 ? 2 : 1;
            } else if (xp < 300) {
              desiredWave = Math.random() < 0.25 ? 2 : 1;
            } else if (xp < 800) {
              const r = Math.random();
              if (r < 0.35) desiredWave = 1;
              else if (r < 0.90) desiredWave = 2;
              else desiredWave = h >= 2 ? 3 : 2;
            } else if (xp < 2000) {
              const r = Math.random();
              if (r < 0.25) desiredWave = 1;
              else if (r < 0.70) desiredWave = 2;
              else desiredWave = h >= 2 ? 3 : 2;
            } else {
              const r = Math.random();
              if (r < 0.15) desiredWave = 1;
              else if (r < 0.55) desiredWave = 2;
              else desiredWave = h >= 2 ? 3 : 2;
            }

            const maxCanAdd = 3 - activePlanets.length;
            pendingSpawns = Math.min(desiredWave, maxCanAdd);
            availableSectors = [0, 1, 2];
            launchDelayTimer = 0.05;
          }
        }

        // Process Staggered Launches (0.25s - 0.55s delay)
        if (pendingSpawns > 0) {
          launchDelayTimer -= dt;
          if (launchDelayTimer <= 0) {
            spawnSinglePlanetFromQueue();
            pendingSpawns--;
            launchDelayTimer = 0.25 + Math.random() * 0.35;
            waveCooldownTimer = 1.0 + Math.random() * 0.8;
          }
        }

        // Update Active Planets Physics & Escaped Planet Miss Checks
        const speedMultiplier = Math.min(2.8, 1.0 + 0.35 * Math.pow(stateRef.current.runXp / 300, 0.6));
        const gravity = 0.35 * Math.pow(speedMultiplier, 0.8);

        for (let i = activePlanets.length - 1; i >= 0; i--) {
          const planet = activePlanets[i];
          planet.timeAlive = (planet.timeAlive || 0) + dt;
          planet.x += planet.vx;
          planet.y += planet.vy;
          planet.vy += gravity;
          planet.rotation += planet.rotationSpeed;

          // Check if planet fell below screen (MISS)
          if (planet.y > height + planet.radius + 20 && planet.vy > 0) {
            activePlanets.splice(i, 1);

            soundEngine.playMissSound();
            onLoseHeart();

            // Miss splash sparks
            particleEngine.spawnImpactSparks(planet.x, height - 10, '#ef4444', false);

            floatingTexts.push({
              id: Math.random().toString(),
              x: Math.max(80, Math.min(width - 80, planet.x)),
              y: height - 80,
              text: 'PLANET ESCAPED! -1 ❤️',
              color: '#ef4444',
              fontSize: 20,
              alpha: 1,
              vy: -1.5,
            });
          }
        }

        // Update Projectiles & Check Collisions
        for (let i = projectiles.length - 1; i >= 0; i--) {
          const p = projectiles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Projectile trail particles
          particleEngine.spawnProjectileTrail(p.x, p.y, p.radius, p.trailColor);

          // Off-screen projectile cleanup
          if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
            projectiles.splice(i, 1);
            continue;
          }

          // Collision Detection across all active planets
          let projectileHit = false;
          for (let j = activePlanets.length - 1; j >= 0; j--) {
            const planet = activePlanets[j];
            const dx = p.x - planet.x;
            const dy = p.y - planet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= planet.radius + p.radius) {
              projectileHit = true;
              planet.currentHp -= p.damage;
              planet.hasBeenHit = true;

              // Spawn impact sparks
              particleEngine.spawnImpactSparks(p.x, p.y, p.color, p.isCritical);

              if (planet.currentHp <= 0) {
                const destroyedPlanet = planet;
                activePlanets.splice(j, 1);

                const isSpecial = destroyedPlanet.isSpecial;
                const isLegendary = destroyedPlanet.type === 'special_legendary';

                // Base Coins: Normal = 5, Rare Special = 50, Very Rare Legendary = 100
                const baseCoins = destroyedPlanet.coinValue;

                // Fast / Perfect Hit Bonus (+2 coins): timeAlive <= 2.2s or critical hit
                const timeAlive = destroyedPlanet.timeAlive || 0;
                const isFastHit = timeAlive <= 2.2 || p.isCritical;
                const fastHitBonus = isFastHit ? 2 : 0;

                // Combo Bonus: Small additional coin bonus based on combo streak
                const newCombo = combo + 1;
                const comboBonus = newCombo >= 3 ? Math.min(5, Math.floor(newCombo / 3)) : 0;

                const totalCoinsEarned = baseCoins + fastHitBonus + comboBonus;

                const comboMultiplier = Math.min(5, 1 + Math.floor(newCombo / 3) * 0.5);
                const scoreEarned = Math.floor((10 * comboMultiplier) + (isLegendary ? 300 : isSpecial ? 150 : 0) + (p.isCritical ? 25 : 0));
                const xpEarned = isLegendary ? 200 : isSpecial ? 100 : 15;

                onUpdateScore(scoreEarned, totalCoinsEarned, xpEarned, newCombo);

                soundEngine.playExplosionSound(isSpecial, p.isCritical);
                soundEngine.playCoinSound();
                if (newCombo % 3 === 0) {
                  soundEngine.playComboSound(newCombo);
                }

                if (st.screenShake) {
                  screenShakeTime = isLegendary ? 0.6 : isSpecial ? 0.45 : 0.25;
                  screenShakeIntensity = isLegendary ? 20 : isSpecial ? 14 : 7;
                }

                // Spawn multi-layered pooled particle explosion
                particleEngine.spawnPlanetExplosion(
                  destroyedPlanet,
                  p.isCritical,
                  st.highParticleQuality
                );

                if (floatingTexts.length > 8) {
                  floatingTexts.shift();
                }

                floatingTexts.push({
                  id: Math.random().toString(),
                  x: destroyedPlanet.x,
                  y: destroyedPlanet.y - 10,
                  text: `+${totalCoinsEarned} 🪙`,
                  color: isLegendary ? '#f43f5e' : isSpecial ? '#fef08a' : '#facc15',
                  fontSize: isLegendary ? 32 : isSpecial ? 28 : 22,
                  alpha: 1,
                  vy: -2,
                });

                if (isFastHit) {
                  floatingTexts.push({
                    id: Math.random().toString(),
                    x: destroyedPlanet.x,
                    y: destroyedPlanet.y - 35,
                    text: 'PERFECT FAST HIT! +2🪙',
                    color: '#38bdf8',
                    fontSize: 18,
                    alpha: 1,
                    vy: -2.2,
                  });
                }

                if (newCombo >= 3 && newCombo % 3 === 0) {
                  floatingTexts.push({
                    id: Math.random().toString(),
                    x: destroyedPlanet.x,
                    y: destroyedPlanet.y + 20,
                    text: `🔥 ${newCombo}x COMBO! (+${comboBonus}🪙)`,
                    color: '#fb923c',
                    fontSize: 22,
                    alpha: 1,
                    vy: -1.8,
                  });
                }
              }

              break;
            }
          }

          if (projectileHit) {
            projectiles.splice(i, 1);
          }
        }

        // Update Space Background Parallax Engine
        spaceBackgroundEngine.update(dt);

        // Update Particles Engine
        particleEngine.update(dt);

        // Update Floating Texts
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
          const ft = floatingTexts[i];
          ft.y += ft.vy;
          ft.alpha -= dt * 1.5;

          if (ft.alpha <= 0) {
            floatingTexts.splice(i, 1);
          }
        }
      }

      // --- 2. CANVAS DRAWING ---
      // Get Equipped Background Theme Cosmetic
      const activeTheme = THEMES_CATALOG.find(t => t.id === stateRef.current.progress.equippedTheme) || THEMES_CATALOG[0];

      let shakeX = 0;
      let shakeY = 0;

      if (screenShakeTime > 0) {
        shakeX = (Math.random() - 0.5) * screenShakeIntensity;
        shakeY = (Math.random() - 0.5) * screenShakeIntensity;
      }

      // Render Parallax Deep Space Background (Nebulae, 3 Star Layers, Cosmic Dust)
      spaceBackgroundEngine.render(ctx, activeTheme, shakeX, shakeY);

      ctx.save();

      // Screen Shake translation for active game elements
      if (shakeX !== 0 || shakeY !== 0) {
        ctx.translate(shakeX, shakeY);
      }

      // Draw Active Planets
      activePlanets.forEach(planet => {
        drawPlanetOnCanvas(
          ctx,
          planet.type,
          planet.x,
          planet.y,
          planet.radius,
          planet.rotation,
          planet.isSpecial
        );

        // Draw Health Bar if Special Planet took hit
        if (planet.isSpecial && planet.currentHp < planet.maxHp) {
          const barW = 60;
          const barH = 6;
          const bx = planet.x - barW / 2;
          const by = planet.y - planet.radius - 16;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(bx, by, barW, barH);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(bx, by, barW * (planet.currentHp / planet.maxHp), barH);
        }
      });

      // Draw Projectiles
      projectiles.forEach(p => {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Particles via HTML5 Canvas Particle Engine
      particleEngine.render(ctx);

      // Draw Floating Texts
      floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${ft.fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // Draw Cannon Weapon at Bottom Center
      const cannonX = width * 0.5;
      const cannonY = height - 45;
      const equippedWeapon = stateRef.current.progress.equippedWeapon;
      const activeSkin = SKINS_CATALOG.find(s => s.id === stateRef.current.progress.equippedSkin) || SKINS_CATALOG[0];

      drawWeaponOnCanvas(ctx, equippedWeapon, cannonX, cannonY, cannonAngle, recoilOffset, 1.0, activeSkin);

      // Draw Muzzle Flash Effect
      if (muzzleFlashLife > 0) {
        ctx.save();
        ctx.translate(cannonX, cannonY);
        ctx.rotate(cannonAngle);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = WEAPON_CATALOG[equippedWeapon].glowColor;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(55, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none touch-none">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
    </div>
  );
};
