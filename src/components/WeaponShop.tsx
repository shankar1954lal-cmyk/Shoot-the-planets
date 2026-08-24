import React, { useRef, useEffect } from 'react';
import { UserProgress, WeaponId } from '../types/game';
import { WEAPON_CATALOG, calculateEffectiveStats, drawWeaponOnCanvas } from '../utils/weapons';
import { soundEngine } from '../utils/audio';
import { ArrowLeft, Coins, Check, Lock, Zap } from 'lucide-react';

interface WeaponShopProps {
  progress: UserProgress;
  onBack: () => void;
  onPurchaseWeapon: (weaponId: WeaponId, price: number) => void;
  onEquipWeapon: (weaponId: WeaponId) => void;
}

// Canvas Preview Component for Individual Weapon
const WeaponPreviewCanvas: React.FC<{ weaponId: WeaponId }> = ({ weaponId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw glowing background pedestal
      const def = WEAPON_CATALOG[weaponId];
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, 50, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Render Cannon Artwork
      drawWeaponOnCanvas(ctx, weaponId, cx - 15, cy, Math.sin(angle) * 0.1, 0, 1.2);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [weaponId]);

  return <canvas ref={canvasRef} width={200} height={120} className="mx-auto block" />;
};

export const WeaponShop: React.FC<WeaponShopProps> = ({
  progress,
  onBack,
  onPurchaseWeapon,
  onEquipWeapon,
}) => {
  const weaponIds: WeaponId[] = ['mk1', 'mk2', 'mk3', 'mk4', 'mk5'];

  return (
    <div className="relative w-full h-full flex flex-col p-6 bg-slate-950 text-white overflow-y-auto select-none">
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.1)_0%,rgba(3,7,18,0.95)_100%)] pointer-events-none" />

      {/* SHOP HEADER */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto mb-6">
        <button
          onClick={() => {
            soundEngine.playClickSound();
            onBack();
          }}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl text-slate-300 hover:text-white transition active:scale-95 cursor-pointer font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>BACK</span>
        </button>

        <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-wider">
          WEAPON ARMORY
        </h1>

        <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-lg">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-lg font-extrabold text-amber-300">
            {progress.coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* WEAPONS CARDS GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto pb-12">
        {weaponIds.map(id => {
          const def = WEAPON_CATALOG[id];
          const isOwned = progress.ownedWeapons.includes(id);
          const isEquipped = progress.equippedWeapon === id;
          const upgrades = progress.weaponUpgrades[id] || { damage: 0, fireRate: 0, energy: 0, critical: 0 };
          const stats = calculateEffectiveStats(id, upgrades);
          const canAfford = progress.coins >= def.price;

          return (
            <div
              key={id}
              className={`relative flex flex-col justify-between bg-slate-900/90 border rounded-3xl p-5 backdrop-blur-md shadow-xl transition-all ${
                isEquipped
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                  : isOwned
                  ? 'border-slate-700/80 hover:border-slate-500'
                  : 'border-slate-800 opacity-90'
              }`}
            >
              {/* TOP BADGE */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/30">
                  {def.id.toUpperCase()}
                </span>
                {isEquipped ? (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-cyan-300 bg-cyan-950 border border-cyan-400 px-3 py-0.5 rounded-full uppercase">
                    <Check className="w-3 h-3" /> EQUIPPED
                  </span>
                ) : isOwned ? (
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase">
                    OWNED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-950 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase">
                    <Coins className="w-3 h-3" /> {def.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* WEAPON CANNON ARTWORK PREVIEW */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl py-2 my-2">
                <WeaponPreviewCanvas weaponId={id} />
              </div>

              {/* WEAPON TITLES */}
              <div className="mb-3">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">{def.name}</h2>
                <p className="text-xs text-cyan-400 font-semibold">{def.subtitle}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{def.description}</p>
              </div>

              {/* STATS PROGRESS BARS */}
              <div className="flex flex-col gap-1.5 mb-4 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60">
                {/* DAMAGE */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">DAMAGE</span>
                  <div className="flex gap-1 w-28">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < stats.damage ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* FIRE RATE */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">FIRE RATE</span>
                  <div className="flex gap-1 w-28">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < stats.fireRate ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* ENERGY */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">ENERGY</span>
                  <div className="flex gap-1 w-28">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < stats.energy ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* CRITICAL */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">CRITICAL</span>
                  <div className="flex gap-1 w-28">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < stats.critical ? 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div>
                {isEquipped ? (
                  <button
                    disabled
                    className="w-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-black py-3 rounded-2xl text-xs uppercase tracking-wider cursor-default"
                  >
                    EQUIPPED IN CANNON
                  </button>
                ) : isOwned ? (
                  <button
                    onClick={() => {
                      soundEngine.playClickSound();
                      onEquipWeapon(id);
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition cursor-pointer"
                  >
                    EQUIP WEAPON
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      if (canAfford) {
                        soundEngine.playClickSound();
                        onPurchaseWeapon(id, def.price);
                      }
                    }}
                    className={`w-full flex items-center justify-center gap-2 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer'
                        : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>UNLOCK FOR {def.price.toLocaleString()} COINS</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>NEED {def.price.toLocaleString()} COINS</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
