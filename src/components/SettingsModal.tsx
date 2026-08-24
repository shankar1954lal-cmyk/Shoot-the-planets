import React from 'react';
import { GameSettings } from '../types/game';
import { soundEngine } from '../utils/audio';
import { ArrowLeft, Volume2, VolumeX, Music, Smartphone, Sparkles, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onBack: () => void;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onBack,
  onUpdateSettings,
  onResetProgress,
}) => {
  const handleSfxChange = (val: number) => {
    const updated = { ...settings, sfxVolume: val };
    onUpdateSettings(updated);
    soundEngine.updateSettings(updated);
  };

  const handleMusicChange = (val: number) => {
    const updated = { ...settings, musicVolume: val };
    onUpdateSettings(updated);
    soundEngine.updateSettings(updated);
    if (val > 0) {
      soundEngine.startMusic();
    } else {
      soundEngine.stopMusic();
    }
  };

  const toggleScreenShake = () => {
    const updated = { ...settings, screenShake: !settings.screenShake };
    onUpdateSettings(updated);
  };

  const toggleParticleQuality = () => {
    const updated = { ...settings, highParticleQuality: !settings.highParticleQuality };
    onUpdateSettings(updated);
  };

  return (
    <div className="relative w-full h-full flex flex-col p-6 bg-slate-950 text-white overflow-y-auto select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,rgba(3,7,18,0.95)_100%)] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
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
          SETTINGS
        </h1>

        <div className="w-20" />
      </div>

      {/* SETTINGS CARD */}
      <div className="relative z-10 max-w-2xl w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col gap-6">
        {/* SFX VOLUME */}
        <div className="flex flex-col gap-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
              {settings.sfxVolume > 0 ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <span>SOUND EFFECTS (SFX)</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {Math.round(settings.sfxVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.sfxVolume}
            onChange={e => handleSfxChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* MUSIC VOLUME */}
        <div className="flex flex-col gap-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-300">
              <Music className="w-5 h-5 text-purple-400" />
              <span>COSMIC MUSIC SYNTH</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {Math.round(settings.musicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.musicVolume}
            onChange={e => handleMusicChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        {/* SCREEN SHAKE TOGGLE */}
        <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <span>IMPACT SCREEN SHAKE</span>
          </div>
          <button
            onClick={toggleScreenShake}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition cursor-pointer ${
              settings.screenShake ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        {/* PARTICLE QUALITY */}
        <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>HIGH PARTICLE QUALITY</span>
          </div>
          <button
            onClick={toggleParticleQuality}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition cursor-pointer ${
              settings.highParticleQuality ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        {/* RESET PROGRESS */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all game progress, coins, and weapon unlocks?')) {
                onResetProgress();
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-400 font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET GAME PROGRESS DATA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
