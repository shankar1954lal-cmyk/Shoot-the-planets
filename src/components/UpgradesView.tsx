import React, { useState } from 'react';
import { UserProgress, WeaponId } from '../types/game';
import { WEAPON_CATALOG, calculateEffectiveStats } from '../utils/weapons';
import { soundEngine } from '../utils/audio';
import { ArrowLeft, Coins, Zap, Shield, Sparkles } from 'lucide-react';

interface UpgradesViewProps {
  progress: UserProgress;
  onBack: () => void;
  onUpgradeStat: (weaponId: WeaponId, stat: 'damage' | 'fireRate' | 'energy' | 'critical', cost: number) => void;
}

export const UpgradesView: React.FC<UpgradesViewProps> = ({
  progress,
  onBack,
  onUpgradeStat,
}) => {
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponId>(progress.equippedWeapon);

  const def = WEAPON_CATALOG[selectedWeapon];
  const upgrades = progress.weaponUpgrades[selectedWeapon] || { damage: 0, fireRate: 0, energy: 0, critical: 0 };
  const stats = calculateEffectiveStats(selectedWeapon, upgrades);

  // Upgrade Cost Formula: 150 * (upgradeLevel + 1)^1.4
  const getUpgradeCost = (currentLvl: number) => Math.floor(150 * Math.pow(currentLvl + 1, 1.4));

  const statConfigs: {
    key: 'damage' | 'fireRate' | 'energy' | 'critical';
    label: string;
    desc: string;
    val: number;
    lvl: number;
    max: number;
  }[] = [
    {
      key: 'damage',
      label: 'DAMAGE',
      desc: 'Increases projectile impact power to destroy tough celestial rock faster.',
      val: stats.damage,
      lvl: upgrades.damage,
      max: 10,
    },
    {
      key: 'fireRate',
      label: 'FIRE RATE',
      desc: 'Increases projectile velocity & reduces firing cooldown.',
      val: stats.fireRate,
      lvl: upgrades.fireRate,
      max: 10,
    },
    {
      key: 'energy',
      label: 'ENERGY BLAST',
      desc: 'Expands projectile energy hit radius and splash burst.',
      val: stats.energy,
      lvl: upgrades.energy,
      max: 10,
    },
    {
      key: 'critical',
      label: 'CRITICAL CHANCE',
      desc: 'Raises critical hit probability for double damage & bonus score.',
      val: stats.critical,
      lvl: upgrades.critical,
      max: 10,
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col p-6 bg-slate-950 text-white overflow-y-auto select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(245,158,11,0.08)_0%,rgba(3,7,18,0.95)_100%)] pointer-events-none" />

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

        <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 uppercase tracking-wider">
          STAT LAB & UPGRADES
        </h1>

        <div className="flex items-center gap-2 bg-slate-900 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-lg">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="text-lg font-extrabold text-amber-300">
            {progress.coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* WEAPON SELECTOR TABS */}
      <div className="relative z-10 flex items-center justify-center gap-2 max-w-4xl w-full mx-auto mb-6 overflow-x-auto py-2">
        {progress.ownedWeapons.map(id => {
          const wDef = WEAPON_CATALOG[id];
          const isSelected = selectedWeapon === id;

          return (
            <button
              key={id}
              onClick={() => {
                soundEngine.playClickSound();
                setSelectedWeapon(id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition cursor-pointer border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{wDef.name}</span>
            </button>
          );
        })}
      </div>

      {/* SELECTED WEAPON STAT UPGRADE PANEL */}
      <div className="relative z-10 max-w-3xl w-full mx-auto bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-md shadow-2xl mb-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-amber-300 uppercase">{def.name}</h2>
            <p className="text-xs text-slate-400">{def.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-extrabold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>LEVEL {upgrades.damage + upgrades.fireRate + upgrades.energy + upgrades.critical + 1}</span>
          </div>
        </div>

        {/* STATS LIST */}
        <div className="flex flex-col gap-5">
          {statConfigs.map(st => {
            const isMaxed = st.val >= st.max;
            const cost = getUpgradeCost(st.lvl);
            const canAfford = progress.coins >= cost;

            return (
              <div
                key={st.key}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950/70 border border-slate-800 p-4 rounded-2xl"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-extrabold text-sm uppercase tracking-wide text-white">{st.label}</span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-950 border border-amber-500/30 px-2 py-0.5 rounded-md">
                      {st.val} / {st.max}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{st.desc}</p>

                  {/* Progress bar */}
                  <div className="flex gap-1.5 w-full max-w-md">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2.5 flex-1 rounded-full ${
                          i < st.val ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* UPGRADE BUTTON */}
                <div className="w-full md:w-auto">
                  {isMaxed ? (
                    <button
                      disabled
                      className="w-full md:w-auto bg-slate-800 border border-slate-700 text-slate-500 font-extrabold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider cursor-default"
                    >
                      MAX LEVEL REACHED
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        if (canAfford) {
                          soundEngine.playClickSound();
                          onUpgradeStat(selectedWeapon, st.key, cost);
                        }
                      }}
                      className={`w-full md:w-auto flex items-center justify-center gap-2 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>UPGRADE ({cost.toLocaleString()} COINS)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
