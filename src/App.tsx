import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimalAvatar } from './components/AnimalAvatar';
import { GrammarLesson } from './components/GrammarLesson';
import { ExplainerVideoModal } from './components/ExplainerVideoModal';
import { Level1Detective } from './components/GameModes/Level1Detective';
import { Level2VerbBuilder } from './components/GameModes/Level2VerbBuilder';
import { Level3ClassroomQuest } from './components/GameModes/Level3ClassroomQuest';
import { BonusBalloonPop } from './components/GameModes/BonusBalloonPop';
import { ReportCardModal } from './components/ReportCardModal';
import { sound } from './utils/soundEffects';
import { speech } from './utils/speech';
import { PlayerStats, Badge } from './types/grammar';
import { BADGES } from './data/sentences';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Play,
  Award,
  Sparkles,
  Trophy,
  Flame,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Star,
  CheckCircle2,
  Zap,
  Gauge
} from 'lucide-react';

type ScreenMode = 'menu' | 'lesson' | 'level1' | 'level2' | 'level3' | 'bonus';

const INITIAL_STATS: PlayerStats = {
  score: 0,
  streak: 0,
  maxStreak: 0,
  starsLevel1: 0,
  starsLevel2: 0,
  starsLevel3: 0,
  starsBonus: 0,
  badgesUnlocked: [],
  completedSentenceIds: [],
  videoWatched: false
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('menu');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [isSlowSpeech, setIsSlowSpeech] = useState(speech.isSlowMode());

  // Player Stats with local storage persistence
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('grammar_safari_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_STATS;
      }
    }
    return INITIAL_STATS;
  });

  // Save stats on change
  useEffect(() => {
    localStorage.setItem('grammar_safari_stats', JSON.stringify(stats));
  }, [stats]);

  const handleEarnScore = (points: number) => {
    setStats(prev => {
      const newScore = prev.score + points;
      const newBadges = [...prev.badgesUnlocked];
      if (newScore >= 800 && !newBadges.includes('grand_master')) {
        newBadges.push('grand_master');
        sound.playLevelUp();
      }
      return {
        ...prev,
        score: newScore,
        badgesUnlocked: newBadges
      };
    });
  };

  const handleUpdateStreak = (isCorrect: boolean) => {
    setStats(prev => {
      const nextStreak = isCorrect ? prev.streak + 1 : 0;
      const nextMax = Math.max(prev.maxStreak, nextStreak);
      const newBadges = [...prev.badgesUnlocked];
      if (nextStreak >= 5 && !newBadges.includes('streak_master')) {
        newBadges.push('streak_master');
      }
      return {
        ...prev,
        streak: nextStreak,
        maxStreak: nextMax,
        badgesUnlocked: newBadges
      };
    });
  };

  const handleCompleteLevel1 = (stars: number) => {
    setStats(prev => {
      const newBadges = [...prev.badgesUnlocked];
      if (stars === 3 && !newBadges.includes('owl_detective')) {
        newBadges.push('owl_detective');
      }
      return {
        ...prev,
        starsLevel1: Math.max(prev.starsLevel1, stars),
        badgesUnlocked: newBadges
      };
    });
  };

  const handleCompleteLevel2 = (stars: number) => {
    setStats(prev => {
      const newBadges = [...prev.badgesUnlocked];
      if (stars === 3 && !newBadges.includes('verb_architect')) {
        newBadges.push('verb_architect');
      }
      return {
        ...prev,
        starsLevel2: Math.max(prev.starsLevel2, stars),
        badgesUnlocked: newBadges
      };
    });
  };

  const handleCompleteLevel3 = (stars: number) => {
    setStats(prev => {
      const newBadges = [...prev.badgesUnlocked];
      if (!newBadges.includes('classroom_hero')) {
        newBadges.push('classroom_hero');
      }
      return {
        ...prev,
        starsLevel3: Math.max(prev.starsLevel3, stars),
        badgesUnlocked: newBadges
      };
    });
  };

  const handleCompleteVideo = () => {
    setStats(prev => {
      const newBadges = [...prev.badgesUnlocked];
      if (!newBadges.includes('safari_novice')) {
        newBadges.push('safari_novice');
      }
      return {
        ...prev,
        score: prev.score + (prev.videoWatched ? 0 : 20),
        videoWatched: true,
        badgesUnlocked: newBadges
      };
    });
  };

  const handleToggleSound = () => {
    const updated = sound.toggleMute();
    setIsMuted(updated);
  };

  const handleToggleSpeechSpeed = () => {
    sound.playClick();
    const updated = speech.toggleSlowMode();
    setIsSlowSpeech(updated);
  };

  const handleResetProgress = () => {
    if (confirm("Reset your Grammar Safari progress and score?")) {
      setStats(INITIAL_STATS);
      sound.playClick();
    }
  };

  const totalStars = stats.starsLevel1 + stats.starsLevel2 + stats.starsLevel3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50 text-slate-800 flex flex-col font-sans select-none">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-amber-200/60 shadow-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div
            onClick={() => { sound.playClick(); setCurrentScreen('menu'); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              🦁
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 block leading-none">
                A2 EFL Gamified Adventure
              </span>
              <h1 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight">
                Grammar Safari Quest
              </h1>
            </div>
          </div>

          {/* Quick HUD: Score, Streak, Stars */}
          <div className="flex items-center gap-3">
            {/* Score */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 text-amber-900 rounded-xl font-extrabold text-xs md:text-sm border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span>{stats.score} Pts</span>
            </div>

            {/* Streak */}
            {stats.streak > 1 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-rose-500 text-white rounded-xl font-extrabold text-xs shadow-sm animate-pulse"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{stats.streak}x Combo</span>
              </motion.div>
            )}

            {/* Stars */}
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-xl font-bold text-xs border border-yellow-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{totalStars}/9 ⭐</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={handleToggleSpeechSpeed}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-bold"
                title={isSlowSpeech ? "Voice Speed: Slow (0.75x)" : "Voice Speed: Normal (1.0x)"}
              >
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  <span className="hidden lg:inline">{isSlowSpeech ? '0.75x' : '1.0x'}</span>
                </span>
              </button>

              <button
                onClick={handleToggleSound}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsReportOpen(true);
                }}
                className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-sm"
                title="View Certificate & Sentences"
              >
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* MENU SCREEN */}
          {currentScreen === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Hero Banner with Animal Welcomers */}
              <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-3xl p-6 md:p-10 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-amber-950 mb-3">
                    🏫 10 Real Classroom Scenarios • A2 Level English
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-950 leading-tight mb-3">
                    Zero & First Conditional Safari!
                  </h1>
                  <p className="text-slate-900 text-sm md:text-base font-semibold leading-relaxed mb-6">
                    Join Ollie the Owl, Leo the Lion, Penny the Penguin, and Toby the Fox!
                    Learn school rules, express future predictions, build sentences, and earn your official Grammar Certificate!
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setCurrentScreen('lesson');
                      }}
                      className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-5 h-5 text-amber-400" />
                      <span>Learn Rules (Grammar Guide)</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsVideoModalOpen(true);
                      }}
                      className="px-6 py-3.5 bg-white/90 hover:bg-white text-slate-950 font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-current text-purple-600" />
                      <span>Watch Explainer Video (+20 Pts)</span>
                    </button>
                  </div>
                </div>

                {/* Mascot cluster on the right */}
                <div className="hidden lg:flex absolute -right-4 -bottom-4 items-end gap-2 pointer-events-none select-none">
                  <AnimalAvatar animal="penguin" mood="celebrate" size="md" />
                  <AnimalAvatar animal="lion" mood="happy" size="lg" />
                  <AnimalAvatar animal="owl" mood="talking" size="md" />
                </div>
              </div>

              {/* Progressive Challenge Levels */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Mission Levels</h2>
                    <p className="text-xs md:text-sm text-slate-500 font-semibold">
                      Complete all 3 progressive stages to master the 10 educational scenarios!
                    </p>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                    {stats.starsLevel1 > 0 && stats.starsLevel2 > 0 && stats.starsLevel3 > 0
                      ? 'All Levels Complete! 🏆'
                      : 'Progressive Difficulty'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Level 1: Detective Safari */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-amber-200 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-lg">
                          1
                        </span>
                        <div className="flex gap-1 text-base">
                          <span className={stats.starsLevel1 >= 1 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                          <span className={stats.starsLevel1 >= 2 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                          <span className={stats.starsLevel1 >= 3 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <AnimalAvatar animal="fox" mood="happy" size="sm" />
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-800">Detective Safari</h3>
                          <span className="text-xs font-bold text-amber-600">Spot & Classify</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                        Investigate the 10 classroom sentences with Detective Toby. Identify whether each is a permanent school rule (Zero) or future prediction (First).
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setCurrentScreen('level1');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer text-sm"
                    >
                      {stats.starsLevel1 > 0 ? 'Play Level 1 Again' : 'Start Level 1'}
                    </button>
                  </motion.div>

                  {/* Level 2: Verb Puzzle Builder */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-sky-200 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 font-black flex items-center justify-center text-lg">
                          2
                        </span>
                        <div className="flex gap-1 text-base">
                          <span className={stats.starsLevel2 >= 1 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                          <span className={stats.starsLevel2 >= 2 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                          <span className={stats.starsLevel2 >= 3 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <AnimalAvatar animal="penguin" mood="happy" size="sm" />
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-800">Verb Builder</h3>
                          <span className="text-xs font-bold text-sky-600">Tense Architecture</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                        Assemble the correct verbs into the blanks! Choose the Present Simple for the condition and Present vs 'Will' for the main clause.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setCurrentScreen('level2');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer text-sm"
                    >
                      {stats.starsLevel2 > 0 ? 'Play Level 2 Again' : 'Start Level 2'}
                    </button>
                  </motion.div>

                  {/* Level 3: Classroom Quest */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border-2 border-emerald-200 flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-lg">
                          3
                        </span>
                        <div className="flex gap-1 text-base">
                          <span className={stats.starsLevel3 >= 1 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                          <span className={stats.starsLevel3 >= 2 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                          <span className={stats.starsLevel3 >= 3 ? "text-amber-400" : "text-slate-200"}>⭐</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <AnimalAvatar animal="lion" mood="happy" size="sm" />
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-800">Classroom Quest</h3>
                          <span className="text-xs font-bold text-emerald-600">Master 10 Scenarios</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                        The ultimate school journey! Solve each classroom scenario with streak combo multipliers, real student contexts, and graduation honors!
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        setCurrentScreen('level3');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer text-sm"
                    >
                      {stats.starsLevel3 > 0 ? 'Play Level 3 Again' : 'Start Level 3'}
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Bonus Mini-Game & Badges Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fast-Paced Mini-Game */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-3xl p-6 shadow-lg flex items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider mb-2 inline-block">
                      ⚡ Addictive Bonus Mini-Game
                    </span>
                    <h3 className="text-xl font-black mb-1">Safari Balloon Pop!</h3>
                    <p className="text-xs text-purple-100 font-medium mb-4">
                      Fast-action clause popping against the clock! Pop Zero or First conditional balloons to boost your score!
                    </p>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setCurrentScreen('bonus');
                      }}
                      className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
                    >
                      Play Balloon Pop 🎈
                    </button>
                  </div>
                  <AnimalAvatar animal="bunny" mood="happy" size="md" className="shrink-0 hidden sm:block" />
                </div>

                {/* Badges Preview Card */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        Safari Badges ({stats.badgesUnlocked.length} / {BADGES.length})
                      </h3>
                      <button
                        onClick={() => { sound.playClick(); setIsReportOpen(true); }}
                        className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto py-2">
                      {BADGES.map(b => {
                        const unlocked = stats.badgesUnlocked.includes(b.id);
                        return (
                          <div
                            key={b.id}
                            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[70px] text-center border ${
                              unlocked
                                ? 'bg-amber-50 border-amber-300 text-slate-800'
                                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-40'
                            }`}
                            title={b.name}
                          >
                            <span className="text-2xl">{b.icon}</span>
                            <span className="text-[10px] font-bold mt-1 truncate max-w-[65px]">{b.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Unlock all badges for maximum achievement!</span>
                    <button
                      onClick={handleResetProgress}
                      className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LESSON SCREEN */}
          {currentScreen === 'lesson' && (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <GrammarLesson
                onStartQuest={() => setCurrentScreen('level1')}
                onOpenVideo={() => setIsVideoModalOpen(true)}
              />
            </motion.div>
          )}

          {/* LEVEL 1: DETECTIVE SAFARI */}
          {currentScreen === 'level1' && (
            <motion.div
              key="level1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Level1Detective
                onEarnScore={handleEarnScore}
                onUpdateStreak={handleUpdateStreak}
                onCompleteLevel={handleCompleteLevel1}
                onBackToMenu={() => setCurrentScreen('menu')}
              />
            </motion.div>
          )}

          {/* LEVEL 2: VERB BUILDER */}
          {currentScreen === 'level2' && (
            <motion.div
              key="level2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Level2VerbBuilder
                onEarnScore={handleEarnScore}
                onUpdateStreak={handleUpdateStreak}
                onCompleteLevel={handleCompleteLevel2}
                onBackToMenu={() => setCurrentScreen('menu')}
              />
            </motion.div>
          )}

          {/* LEVEL 3: CLASSROOM QUEST */}
          {currentScreen === 'level3' && (
            <motion.div
              key="level3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Level3ClassroomQuest
                streak={stats.streak}
                onEarnScore={handleEarnScore}
                onUpdateStreak={handleUpdateStreak}
                onCompleteLevel={handleCompleteLevel3}
                onBackToMenu={() => setCurrentScreen('menu')}
              />
            </motion.div>
          )}

          {/* BONUS BALLOON POP */}
          {currentScreen === 'bonus' && (
            <motion.div
              key="bonus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BonusBalloonPop
                onEarnScore={handleEarnScore}
                onBackToMenu={() => setCurrentScreen('menu')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-amber-200/40">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-2">
          <span>🦁 English Grammar Safari • Zero & First Conditional Academy</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { sound.playClick(); setCurrentScreen('lesson'); }}
              className="hover:text-slate-800 underline cursor-pointer"
            >
              Grammar Guide
            </button>
            <button
              onClick={() => { sound.playClick(); setIsVideoModalOpen(true); }}
              className="hover:text-slate-800 underline cursor-pointer"
            >
              Explainer Video
            </button>
            <button
              onClick={() => { sound.playClick(); setIsReportOpen(true); }}
              className="hover:text-slate-800 underline cursor-pointer"
            >
              Report & Certificate
            </button>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <ExplainerVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onCompleteVideo={handleCompleteVideo}
      />

      {/* Report Card & Certificate Modal */}
      <ReportCardModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stats={stats}
      />
    </div>
  );
}
