import React from 'react';
import { UserProgress, GameStateMode } from '../types/game';
import { WEAPON_CATALOG } from '../utils/weapons';
import { Play, ShoppingBag, Zap, Sparkles, Settings, Trophy, Coins, Shield } from 'lucide-react';

interface MainMenuProps {
  progress: UserProgress;
  onNavigate: (mode: GameStateMode) => void;
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onNavigate,
  onStartGame,
}) => {
  const equippedDef = WEAPON_CATALOG[progress.equippedWeapon];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 bg-slate-950 text-white overflow-hidden select-none">
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,rgba(3,7,18,0.95)_100%)] pointer-events-none" />

      {/* TOP HEADER BAR */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto">
        {/* COIN BALANCE BADGE */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-lg shadow-amber-500/10">
          <Coins className="w-5 h-5 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">COINS</span>
            <span className="text-lg font-extrabold text-amber-300 tracking-wide">
              {progress.coins.toLocaleString()}
            </span>
          </div>
        </div>

        {/* HIGH SCORE BADGE */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-purple-500/40 px-4 py-2 rounded-2xl shadow-lg shadow-purple-500/10">
          <Trophy className="w-5 h-5 text-purple-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">BEST SCORE</span>
            <span className="text-lg font-extrabold text-purple-300 tracking-wide">
              {progress.highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* SETTINGS BUTTON */}
        <button
          onClick={() => onNavigate('SETTINGS')}
          className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-2xl text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* CENTER LOGO & MAIN PLAY ACTION */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-2xl mx-auto">
        {/* SUBTITLE */}
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-[0.3em] mb-2 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>ENDLESS COSMIC ARCADE</span>
        </div>

        {/* TITLE */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400 drop-shadow-[0_10px_25px_rgba(56,189,248,0.3)] mb-4 uppercase">
          SHOOT THE PLANET
        </h1>

        {/* EQUIPPED WEAPON STATUS BADGE */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-cyan-500/30 px-4 py-1.5 rounded-xl mb-8">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium">Equipped Cannon:</span>
          <span className="text-xs font-extrabold text-cyan-300 uppercase">{equippedDef.name}</span>
        </div>

        {/* BIG PLAY BUTTON */}
        <button
          onClick={onStartGame}
          className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-2xl md:text-3xl px-12 py-5 rounded-3xl shadow-[0_0_35px_rgba(56,189,248,0.5)] active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
        >
          <Play className="w-8 h-8 fill-slate-950 group-hover:scale-110 transition-transform" />
          <span>START MISSION</span>
        </button>
      </div>

      {/* BOTTOM NAVIGATION GRID */}
      <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-4 max-w-3xl w-full mx-auto">
        {/* WEAPON SHOP */}
        <button
          onClick={() => onNavigate('SHOP')}
          className="flex flex-col items-center justify-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 p-4 rounded-2xl shadow-lg transition active:scale-95 cursor-pointer group"
        >
          <ShoppingBag className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-extrabold uppercase tracking-wide text-cyan-200">WEAPON SHOP</span>
          <span className="text-[10px] text-slate-400">Unlock MK-I to MK-V</span>
        </button>

        {/* UPGRADES */}
        <button
          onClick={() => onNavigate('UPGRADES')}
          className="flex flex-col items-center justify-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 p-4 rounded-2xl shadow-lg transition active:scale-95 cursor-pointer group"
        >
          <Zap className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-extrabold uppercase tracking-wide text-amber-200">UPGRADES</span>
          <span className="text-[10px] text-slate-400">Boost Damage & Speed</span>
        </button>

        {/* COSMETICS */}
        <button
          onClick={() => onNavigate('COSMETICS')}
          className="flex flex-col items-center justify-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-purple-500/40 hover:border-purple-400 p-4 rounded-2xl shadow-lg transition active:scale-95 cursor-pointer group"
        >
          <Sparkles className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-extrabold uppercase tracking-wide text-purple-200">COSMETICS</span>
          <span className="text-[10px] text-slate-400">Custom Plasma Trails</span>
        </button>
      </div>
    </div>
  );
};
