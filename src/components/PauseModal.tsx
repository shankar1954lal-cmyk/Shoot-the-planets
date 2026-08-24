import React from 'react';
import { soundEngine } from '../utils/audio';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none animate-fade-in">
      <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase tracking-wider mb-6">
          GAME PAUSED
        </h2>

        <div className="flex flex-col gap-3.5 w-full">
          {/* RESUME */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onResume();
            }}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-4 rounded-2xl text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>RESUME MISSION</span>
          </button>

          {/* RESTART */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onRestart();
            }}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART RUN</span>
          </button>

          {/* HOME */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onHome();
            }}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider active:scale-95 transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
