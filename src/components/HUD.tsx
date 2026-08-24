import React from 'react';
import { UserProgress } from '../types/game';
import { calculateXpLevel } from '../utils/storage';
import { Pause, Heart, Zap, Coins } from 'lucide-react';

interface HUDProps {
  progress: UserProgress;
  score: number;
  combo: number;
  hearts: number;
  onPause: () => void;
  onDismissTutorial?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  progress,
  score,
  combo,
  hearts,
  onPause,
  onDismissTutorial,
}) => {
  const { level, currentXp, nextLevelXp } = calculateXpLevel(progress.xp);
  const xpPercent = Math.min(100, Math.max(0, (currentXp / nextLevelXp) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10 select-none">
      {/* TOP HUD BAR */}
      <div className="flex items-start justify-between w-full">
        {/* TOP LEFT: COINS & XP */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Coin Badge */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/10">
            <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-xl font-extrabold tracking-wide text-amber-300 drop-shadow">
              {progress.coins.toLocaleString()}
            </span>
          </div>

          {/* XP Bar & Level Badge */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1 rounded-xl shadow-md">
            <div className="flex items-center gap-1 bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-bold text-xs px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3 fill-cyan-400" />
              <span>LVL {level}</span>
            </div>
            <div className="flex flex-col gap-0.5 w-24">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium text-right">
                {currentXp} / {nextLevelXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* TOP CENTER: HEARTS */}
        <div className="flex items-center justify-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-4 py-2 rounded-full shadow-xl">
          {[1, 2, 3].map(index => {
            const isFilled = index <= hearts;
            return (
              <Heart
                key={index}
                className={`w-7 h-7 transition-all duration-300 ${
                  isFilled
                    ? 'text-red-500 fill-red-500 scale-100 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : 'text-slate-600 fill-slate-800 scale-90 opacity-40'
                }`}
              />
            );
          })}
        </div>

        {/* TOP RIGHT: PAUSE BUTTON */}
        <button
          onClick={onPause}
          className="pointer-events-auto bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 hover:border-slate-500 text-slate-200 p-3 rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
          title="Pause Game"
        >
          <Pause className="w-6 h-6 fill-current" />
        </button>
      </div>

      {/* CENTER HUD: SCORE & COMBO */}
      <div className="flex flex-col items-center justify-center gap-1 my-auto">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold drop-shadow">SCORE</span>
        <div className="text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {score.toLocaleString()}
        </div>

        {/* COMBO ALERT BADGE */}
        {combo >= 2 && (
          <div className="mt-2 animate-bounce bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-sm md:text-base px-4 py-1 rounded-full shadow-lg shadow-orange-500/30 uppercase tracking-wide">
            🔥 {combo}x COMBO!
          </div>
        )}
      </div>

      {/* FIRST TIME TUTORIAL HINT OVERLAY */}
      {!progress.tutorialCompleted && (
        <div className="pointer-events-auto flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 p-4 rounded-2xl shadow-2xl max-w-sm mx-auto mb-6 text-center animate-fade-in">
          <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase mb-1">
            🚀 TARGET & FIRE
          </span>
          <p className="text-xs text-slate-200 mb-3">
            Tap anywhere on the screen to aim your cannon and blast the launching planets before they escape!
          </p>
          <button
            onClick={onDismissTutorial}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-md active:scale-95 transition cursor-pointer"
          >
            GOT IT! PLAY
          </button>
        </div>
      )}
    </div>
  );
};
