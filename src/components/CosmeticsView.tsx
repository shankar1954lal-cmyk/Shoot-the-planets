import React, { useState } from 'react';
import { UserProgress } from '../types/game';
import { soundEngine } from '../utils/audio';
import { TRAILS_CATALOG, SKINS_CATALOG, THEMES_CATALOG } from '../utils/cosmeticsCatalog';
import { ArrowLeft, Coins, Check, Lock, Sparkles, Palette, Flame, Orbit } from 'lucide-react';

interface CosmeticsViewProps {
  progress: UserProgress;
  onBack: () => void;
  onUnlockTrail: (trailId: string, price: number) => void;
  onEquipTrail: (trailId: string) => void;
  onUnlockSkin: (skinId: string, price: number) => void;
  onEquipSkin: (skinId: string) => void;
  onUnlockTheme: (themeId: string, price: number) => void;
  onEquipTheme: (themeId: string) => void;
}

export { TRAILS_CATALOG, SKINS_CATALOG, THEMES_CATALOG };

export const CosmeticsView: React.FC<CosmeticsViewProps> = ({
  progress,
  onBack,
  onUnlockTrail,
  onEquipTrail,
  onUnlockSkin,
  onEquipSkin,
  onUnlockTheme,
  onEquipTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'TRAILS' | 'SKINS' | 'THEMES'>('TRAILS');

  return (
    <div className="relative w-full h-full flex flex-col p-6 bg-slate-950 text-white overflow-y-auto select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,rgba(3,7,18,0.95)_100%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl mx-auto mb-6">
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

        <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 uppercase tracking-wider">
          COSMETICS SHOP
        </h1>

        <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-lg">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-lg font-extrabold text-amber-300">
            {progress.coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="relative z-10 flex justify-center gap-3 max-w-2xl mx-auto w-full mb-8">
        <button
          onClick={() => {
            soundEngine.playClickSound();
            setActiveTab('TRAILS');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'TRAILS'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>PROJECTILE TRAILS</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            setActiveTab('SKINS');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'SKINS'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>WEAPON SKINS</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            setActiveTab('THEMES');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-wider transition cursor-pointer ${
            activeTab === 'THEMES'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
          }`}
        >
          <Orbit className="w-4 h-4" />
          <span>NEBULA THEMES</span>
        </button>
      </div>

      {/* TAB 1: PROJECTILE TRAILS */}
      {activeTab === 'TRAILS' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mx-auto pb-12">
          {TRAILS_CATALOG.map(trail => {
            const isUnlocked = progress.unlockedTrails.includes(trail.id);
            const isEquipped = progress.equippedTrail === trail.id;
            const canAfford = progress.coins >= trail.price;

            return (
              <div
                key={trail.id}
                className={`flex flex-col justify-between bg-slate-900/90 border rounded-3xl p-5 backdrop-blur-md shadow-xl transition ${
                  isEquipped
                    ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-sm uppercase text-white">{trail.name}</span>
                  {isEquipped ? (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-purple-300 bg-purple-950 border border-purple-400 px-3 py-0.5 rounded-full uppercase">
                      <Check className="w-3 h-3" /> EQUIPPED
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-950 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase">
                      <Coins className="w-3 h-3" /> {trail.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl py-6 my-2">
                  <div
                    className="w-4 h-4 rounded-full animate-ping"
                    style={{ backgroundColor: trail.color, boxShadow: `0 0 15px ${trail.glow}` }}
                  />
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: trail.color, boxShadow: `0 0 20px ${trail.glow}` }}
                  />
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: trail.color, boxShadow: `0 0 25px ${trail.glow}` }}
                  />
                </div>

                <div className="mt-4">
                  {isEquipped ? (
                    <button
                      disabled
                      className="w-full bg-purple-950 border border-purple-500/50 text-purple-300 font-black py-3 rounded-2xl text-xs uppercase tracking-wider cursor-default"
                    >
                      EQUIPPED
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playClickSound();
                        onEquipTrail(trail.id);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition cursor-pointer"
                    >
                      EQUIP TRAIL
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          soundEngine.playClickSound();
                          onUnlockTrail(trail.id, trail.price);
                        }
                      }}
                      className={`w-full flex items-center justify-center gap-2 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg active:scale-95 cursor-pointer'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>UNLOCK FOR {trail.price.toLocaleString()} COINS</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>NEED {trail.price.toLocaleString()} COINS</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: WEAPON SKINS */}
      {activeTab === 'SKINS' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mx-auto pb-12">
          {SKINS_CATALOG.map(skin => {
            const isUnlocked = progress.unlockedSkins.includes(skin.id);
            const isEquipped = progress.equippedSkin === skin.id;
            const canAfford = progress.coins >= skin.price;

            return (
              <div
                key={skin.id}
                className={`flex flex-col justify-between bg-slate-900/90 border rounded-3xl p-5 backdrop-blur-md shadow-xl transition ${
                  isEquipped
                    ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-sm uppercase text-white">{skin.name}</span>
                  {isEquipped ? (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-purple-300 bg-purple-950 border border-purple-400 px-3 py-0.5 rounded-full uppercase">
                      <Check className="w-3 h-3" /> EQUIPPED
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-950 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase">
                      <Coins className="w-3 h-3" /> {skin.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 bg-slate-950 border border-slate-800 rounded-2xl py-6 my-2">
                  <div
                    className="w-10 h-10 rounded-2xl border-2 border-slate-700 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: skin.primaryColor }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: skin.accentColor }}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-400">Primary Chassis</span>
                    <span className="text-xs font-bold text-slate-200" style={{ color: skin.accentColor }}>
                      Energy Cores
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  {isEquipped ? (
                    <button
                      disabled
                      className="w-full bg-purple-950 border border-purple-500/50 text-purple-300 font-black py-3 rounded-2xl text-xs uppercase tracking-wider cursor-default"
                    >
                      EQUIPPED
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playClickSound();
                        onEquipSkin(skin.id);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition cursor-pointer"
                    >
                      EQUIP SKIN
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          soundEngine.playClickSound();
                          onUnlockSkin(skin.id, skin.price);
                        }
                      }}
                      className={`w-full flex items-center justify-center gap-2 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg active:scale-95 cursor-pointer'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>UNLOCK FOR {skin.price.toLocaleString()} COINS</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>NEED {skin.price.toLocaleString()} COINS</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: BACKGROUND NEBULAS */}
      {activeTab === 'THEMES' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mx-auto pb-12">
          {THEMES_CATALOG.map(theme => {
            const isUnlocked = progress.unlockedThemes.includes(theme.id);
            const isEquipped = progress.equippedTheme === theme.id;
            const canAfford = progress.coins >= theme.price;

            return (
              <div
                key={theme.id}
                className={`flex flex-col justify-between bg-slate-900/90 border rounded-3xl p-5 backdrop-blur-md shadow-xl transition ${
                  isEquipped
                    ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-sm uppercase text-white">{theme.name}</span>
                  {isEquipped ? (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-purple-300 bg-purple-950 border border-purple-400 px-3 py-0.5 rounded-full uppercase">
                      <Check className="w-3 h-3" /> EQUIPPED
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-950 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase">
                      <Coins className="w-3 h-3" /> {theme.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div
                  className="relative w-full h-24 rounded-2xl overflow-hidden border border-slate-800 my-2 flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at center, ${theme.gradientStart} 0%, ${theme.gradientMid} 60%, rgba(3,7,18,0.95) 100%)`,
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full absolute top-3 left-6 shadow-sm"
                    style={{ backgroundColor: theme.starTint }}
                  />
                  <div
                    className="w-2 h-2 rounded-full absolute bottom-4 right-10 shadow-sm"
                    style={{ backgroundColor: theme.starTint }}
                  />
                  <span className="text-xs font-black tracking-widest text-slate-300 uppercase opacity-75">
                    NEBULA PREVIEW
                  </span>
                </div>

                <div className="mt-4">
                  {isEquipped ? (
                    <button
                      disabled
                      className="w-full bg-purple-950 border border-purple-500/50 text-purple-300 font-black py-3 rounded-2xl text-xs uppercase tracking-wider cursor-default"
                    >
                      EQUIPPED
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playClickSound();
                        onEquipTheme(theme.id);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition cursor-pointer"
                    >
                      EQUIP THEME
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          soundEngine.playClickSound();
                          onUnlockTheme(theme.id, theme.price);
                        }
                      }}
                      className={`w-full flex items-center justify-center gap-2 font-black py-3 rounded-2xl text-xs uppercase tracking-wider transition ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg active:scale-95 cursor-pointer'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>UNLOCK FOR {theme.price.toLocaleString()} COINS</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>NEED {theme.price.toLocaleString()} COINS</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
