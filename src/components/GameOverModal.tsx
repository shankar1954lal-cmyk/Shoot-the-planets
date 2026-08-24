import React from 'react';
import { soundEngine } from '../utils/audio';
import { RotateCcw, ShoppingBag, Home, Trophy, Coins, Zap, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  coinsEarned: number;
  totalCoins: number;
  xpEarned: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onOpenShop: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  coinsEarned,
  totalCoins,
  xpEarned,
  isNewHighScore,
  onPlayAgain,
  onOpenShop,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none animate-fade-in">
      <div className="flex flex-col items-center bg-slate-900 border border-red-500/30 p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
        {/* GAME OVER BADGE */}
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 uppercase tracking-widest mb-1">
          GAME OVER
        </h2>
        <p className="text-xs text-slate-400 mb-6 font-semibold uppercase tracking-wider">
          PLANET ESCAPED DEFENSE GRID
        </p>

        {/* NEW HIGH SCORE BADGE */}
        {isNewHighScore && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20 mb-4 animate-bounce">
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>NEW HIGH SCORE RECORD!</span>
          </div>
        )}

        {/* STATS SUMMARY BOX */}
        <div className="grid grid-cols-2 gap-3 w-full bg-slate-950/70 border border-slate-800 p-4 rounded-2xl mb-6">
          {/* FINAL SCORE */}
          <div className="flex flex-col items-center p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase">SCORE</span>
            <span className="text-2xl font-black text-white">{score.toLocaleString()}</span>
          </div>

          {/* BEST SCORE */}
          <div className="flex flex-col items-center p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase">BEST SCORE</span>
            <div className="flex items-center gap-1 text-purple-400 font-black text-xl">
              <Trophy className="w-4 h-4" />
              <span>{highScore.toLocaleString()}</span>
            </div>
          </div>

          {/* COINS EARNED */}
          <div className="flex flex-col items-center p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase">COINS EARNED</span>
            <div className="flex items-center gap-1 text-amber-400 font-black text-xl">
              <Coins className="w-4 h-4" />
              <span>+{coinsEarned.toLocaleString()}</span>
            </div>
          </div>

          {/* XP EARNED */}
          <div className="flex flex-col items-center p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase">XP EARNED</span>
            <div className="flex items-center gap-1 text-cyan-400 font-black text-xl">
              <Zap className="w-4 h-4" />
              <span>+{xpEarned.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* TOTAL COINS BALANCE */}
        <div className="flex items-center justify-between w-full bg-slate-950 border border-amber-500/20 px-4 py-2.5 rounded-xl mb-6">
          <span className="text-xs text-slate-400 font-bold uppercase">TOTAL COIN BALANCE:</span>
          <span className="text-sm font-extrabold text-amber-300">🪙 {totalCoins.toLocaleString()}</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3 w-full">
          {/* PLAY AGAIN */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onPlayAgain();
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 fill-slate-950" />
            <span>PLAY AGAIN</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            {/* SHOP */}
            <button
              onClick={() => {
                soundEngine.playClickSound();
                onOpenShop();
              }}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>SHOP</span>
            </button>

            {/* HOME */}
            <button
              onClick={() => {
                soundEngine.playClickSound();
                onHome();
              }}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>HOME</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
