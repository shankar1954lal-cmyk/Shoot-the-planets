import React, { useState, useEffect, useCallback } from 'react';
import { GameStateMode, UserProgress, GameSettings, WeaponId } from './types/game';
import {
  loadUserProgress,
  saveUserProgress,
  loadGameSettings,
  saveGameSettings,
  DEFAULT_PROGRESS,
} from './utils/storage';
import { soundEngine } from './utils/audio';

import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { WeaponShop } from './components/WeaponShop';
import { UpgradesView } from './components/UpgradesView';
import { CosmeticsView } from './components/CosmeticsView';
import { SettingsModal } from './components/SettingsModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  const [mode, setMode] = useState<GameStateMode>('MENU');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [settings, setSettings] = useState<GameSettings>(loadGameSettings);

  // Gameplay Run State
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [runCoinsEarned, setRunCoinsEarned] = useState<number>(0);
  const [runXpEarned, setRunXpEarned] = useState<number>(0);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Sync Progress to LocalStorage
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Sync Settings
  useEffect(() => {
    saveGameSettings(settings);
    soundEngine.updateSettings(settings);
  }, [settings]);

  // Handle Starting a Fresh Gameplay Run
  const handleStartGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setHearts(3);
    setRunCoinsEarned(0);
    setRunXpEarned(0);
    setIsNewHighScore(false);
    setMode('PLAYING');

    if (settings.musicVolume > 0) {
      soundEngine.startMusic();
    }
  }, [settings]);

  // Update Score, Coins, XP on Planet Destruction
  const handleUpdateScore = useCallback(
    (addedScore: number, addedCoins: number, addedXp: number, newCombo: number) => {
      setScore(prev => prev + addedScore);
      setCombo(newCombo);
      setRunCoinsEarned(prev => prev + addedCoins);
      setRunXpEarned(prev => prev + addedXp);

      // Add to persistent totals
      setProgress(prev => {
        const newCoins = prev.coins + addedCoins;
        const newXp = prev.xp + addedXp;
        const currentScore = score + addedScore;
        const newHighScore = Math.max(prev.highScore, currentScore);

        return {
          ...prev,
          coins: newCoins,
          xp: newXp,
          highScore: newHighScore,
        };
      });
    },
    [score]
  );

  // Lose 1 Heart on Planet Escape
  const handleLoseHeart = useCallback(() => {
    setCombo(0); // Reset combo streak on miss
    setHearts(prev => {
      const nextHearts = prev - 1;
      if (nextHearts <= 0) {
        // Trigger Game Over
        setTimeout(() => {
          soundEngine.playGameOverSound();
          setProgress(p => {
            if (score > p.highScore) {
              setIsNewHighScore(true);
            }
            return p;
          });
          setMode('GAMEOVER');
        }, 300);
      }
      return Math.max(0, nextHearts);
    });
  }, [score]);

  // Dismiss Tutorial Hint
  const handleDismissTutorial = useCallback(() => {
    setProgress(prev => ({ ...prev, tutorialCompleted: true }));
  }, []);

  // Weapon Shop Purchase
  const handlePurchaseWeapon = useCallback((weaponId: WeaponId, price: number) => {
    setProgress(prev => {
      if (prev.coins < price || prev.ownedWeapons.includes(weaponId)) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        ownedWeapons: [...prev.ownedWeapons, weaponId],
        equippedWeapon: weaponId, // Auto-equip newly bought weapon!
      };
    });
  }, []);

  // Equip Weapon
  const handleEquipWeapon = useCallback((weaponId: WeaponId) => {
    setProgress(prev => ({ ...prev, equippedWeapon: weaponId }));
  }, []);

  // Upgrade Weapon Stat
  const handleUpgradeStat = useCallback(
    (weaponId: WeaponId, stat: 'damage' | 'fireRate' | 'energy' | 'critical', cost: number) => {
      setProgress(prev => {
        if (prev.coins < cost) return prev;
        const currentUpgrades = prev.weaponUpgrades[weaponId] || { damage: 0, fireRate: 0, energy: 0, critical: 0 };
        return {
          ...prev,
          coins: prev.coins - cost,
          weaponUpgrades: {
            ...prev.weaponUpgrades,
            [weaponId]: {
              ...currentUpgrades,
              [stat]: currentUpgrades[stat] + 1,
            },
          },
        };
      });
    },
    []
  );

  // Cosmetics Trail Unlock & Equip
  const handleUnlockTrail = useCallback((trailId: string, price: number) => {
    setProgress(prev => {
      if (prev.coins < price || prev.unlockedTrails.includes(trailId)) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        unlockedTrails: [...prev.unlockedTrails, trailId],
        equippedTrail: trailId,
      };
    });
  }, []);

  const handleEquipTrail = useCallback((trailId: string) => {
    setProgress(prev => ({ ...prev, equippedTrail: trailId }));
  }, []);

  // Cosmetics Skin Unlock & Equip
  const handleUnlockSkin = useCallback((skinId: string, price: number) => {
    setProgress(prev => {
      if (prev.coins < price || prev.unlockedSkins.includes(skinId)) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        unlockedSkins: [...prev.unlockedSkins, skinId],
        equippedSkin: skinId,
      };
    });
  }, []);

  const handleEquipSkin = useCallback((skinId: string) => {
    setProgress(prev => ({ ...prev, equippedSkin: skinId }));
  }, []);

  // Cosmetics Theme Unlock & Equip
  const handleUnlockTheme = useCallback((themeId: string, price: number) => {
    setProgress(prev => {
      if (prev.coins < price || prev.unlockedThemes.includes(themeId)) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        unlockedThemes: [...prev.unlockedThemes, themeId],
        equippedTheme: themeId,
      };
    });
  }, []);

  const handleEquipTheme = useCallback((themeId: string) => {
    setProgress(prev => ({ ...prev, equippedTheme: themeId }));
  }, []);

  // Reset Progress Data
  const handleResetProgress = useCallback(() => {
    localStorage.clear();
    setProgress(DEFAULT_PROGRESS);
    setMode('MENU');
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-950 font-sans overflow-hidden select-none">
      {/* 1. MAIN MENU SCREEN */}
      {mode === 'MENU' && (
        <MainMenu
          progress={progress}
          onNavigate={setMode}
          onStartGame={handleStartGame}
        />
      )}

      {/* 2. WEAPON SHOP ARMORY */}
      {mode === 'SHOP' && (
        <WeaponShop
          progress={progress}
          onBack={() => setMode('MENU')}
          onPurchaseWeapon={handlePurchaseWeapon}
          onEquipWeapon={handleEquipWeapon}
        />
      )}

      {/* 3. STAT LAB & UPGRADES */}
      {mode === 'UPGRADES' && (
        <UpgradesView
          progress={progress}
          onBack={() => setMode('MENU')}
          onUpgradeStat={handleUpgradeStat}
        />
      )}

      {/* 4. COSMETICS VIEW */}
      {mode === 'COSMETICS' && (
        <CosmeticsView
          progress={progress}
          onBack={() => setMode('MENU')}
          onUnlockTrail={handleUnlockTrail}
          onEquipTrail={handleEquipTrail}
          onUnlockSkin={handleUnlockSkin}
          onEquipSkin={handleEquipSkin}
          onUnlockTheme={handleUnlockTheme}
          onEquipTheme={handleEquipTheme}
        />
      )}

      {/* 5. SETTINGS MODAL */}
      {mode === 'SETTINGS' && (
        <SettingsModal
          settings={settings}
          onBack={() => setMode('MENU')}
          onUpdateSettings={setSettings}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* 6. GAMEPLAY VIEW (PLAYING / PAUSED / GAMEOVER) */}
      {(mode === 'PLAYING' || mode === 'PAUSED' || mode === 'GAMEOVER') && (
        <div className="relative w-full h-full">
          <GameCanvas
            progress={progress}
            settings={settings}
            score={score}
            combo={combo}
            hearts={hearts}
            runXp={runXpEarned}
            isPaused={mode === 'PAUSED'}
            onUpdateScore={handleUpdateScore}
            onLoseHeart={handleLoseHeart}
            onGameOver={() => setMode('GAMEOVER')}
          />

          <HUD
            progress={progress}
            score={score}
            combo={combo}
            hearts={hearts}
            onPause={() => setMode('PAUSED')}
            onDismissTutorial={handleDismissTutorial}
          />

          {/* PAUSE MODAL OVERLAY */}
          {mode === 'PAUSED' && (
            <PauseModal
              onResume={() => setMode('PLAYING')}
              onRestart={handleStartGame}
              onHome={() => setMode('MENU')}
            />
          )}

          {/* GAME OVER MODAL OVERLAY */}
          {mode === 'GAMEOVER' && (
            <GameOverModal
              score={score}
              highScore={progress.highScore}
              coinsEarned={runCoinsEarned}
              totalCoins={progress.coins}
              xpEarned={runXpEarned}
              isNewHighScore={isNewHighScore}
              onPlayAgain={handleStartGame}
              onOpenShop={() => setMode('SHOP')}
              onHome={() => setMode('MENU')}
            />
          )}
        </div>
      )}
    </div>
  );
}
