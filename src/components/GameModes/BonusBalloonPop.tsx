import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimalAvatar } from '../AnimalAvatar';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Zap, ArrowLeft, RefreshCw } from 'lucide-react';

interface BalloonItem {
  id: number;
  text: string;
  type: 'zero' | 'first';
  color: string;
  xPos: number; // percentage 10% to 80%
  speed: number;
}

interface BonusBalloonPopProps {
  onEarnScore: (points: number) => void;
  onBackToMenu: () => void;
}

const BALLOON_DATA = [
  { text: "we will celebrate", type: "first" },
  { text: "water boils at 100°C", type: "zero" },
  { text: "the teacher marks absent", type: "zero" },
  { text: "you will pass the quiz", type: "first" },
  { text: "the smartboard turns off", type: "zero" },
  { text: "she will call the doctor", type: "first" },
  { text: "ice melts in warm water", type: "zero" },
  { text: "we will read comics", type: "first" },
  { text: "you get green paint", type: "zero" },
  { text: "Mr. Davies will help", type: "first" },
  { text: "students leave quietly", type: "zero" },
  { text: "it will rain tomorrow", type: "first" },
];

const COLORS = [
  'from-pink-400 to-rose-500',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-purple-400 to-indigo-500'
];

export const BonusBalloonPop: React.FC<BonusBalloonPopProps> = ({
  onEarnScore,
  onBackToMenu
}) => {
  const [targetType, setTargetType] = useState<'zero' | 'first'>('first');
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Initialize round of balloons
  const spawnBalloons = () => {
    const list: BalloonItem[] = [];
    for (let i = 0; i < 6; i++) {
      const item = BALLOON_DATA[Math.floor(Math.random() * BALLOON_DATA.length)];
      list.push({
        id: Date.now() + i,
        text: item.text,
        type: item.type as 'zero' | 'first',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        xPos: 10 + Math.random() * 70,
        speed: 12 + Math.random() * 6
      });
    }
    setBalloons(list);
  };

  useEffect(() => {
    spawnBalloons();
  }, [targetType]);

  // Timer countdown
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          sound.playLevelUp();
          confetti({ particleCount: 70, spread: 80 });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const handlePop = (balloon: BalloonItem) => {
    sound.playClick();
    if (balloon.type === targetType) {
      sound.playCorrect();
      const points = 15;
      setGameScore(s => s + points);
      setPoppedCount(c => c + 1);
      onEarnScore(points);
      // Remove balloon and spawn replacement
      setBalloons(current => current.filter(b => b.id !== balloon.id));
      setTimeout(() => {
        const item = BALLOON_DATA[Math.floor(Math.random() * BALLOON_DATA.length)];
        setBalloons(current => [
          ...current,
          {
            id: Date.now(),
            text: item.text,
            type: item.type as 'zero' | 'first',
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            xPos: 10 + Math.random() * 70,
            speed: 12 + Math.random() * 6
          }
        ]);
      }, 500);
    } else {
      sound.playWrong();
      setGameScore(s => Math.max(0, s - 5));
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setTimeLeft(30);
    setGameScore(0);
    setPoppedCount(0);
    setIsGameOver(false);
    setTargetType(prev => prev === 'first' ? 'zero' : 'first');
    spawnBalloons();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header Bar */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-purple-100 flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>

        {/* Target Directive */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            Target: Pop {targetType === 'first' ? '1st Conditional (will + verb)' : 'Zero Conditional (Facts/Rules)'}!
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-extrabold text-slate-700">
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg">⏱️ {timeLeft}s</span>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg">⭐ {gameScore} Pts</span>
        </div>
      </div>

      {/* Balloon Stage Canvas */}
      <div className="relative h-96 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 rounded-3xl overflow-hidden shadow-xl border-4 border-white flex flex-col justify-between p-4 select-none">
        {/* Clouds decoration */}
        <div className="absolute top-4 left-6 text-4xl opacity-40 select-none pointer-events-none">☁️</div>
        <div className="absolute top-12 right-10 text-5xl opacity-40 select-none pointer-events-none">☁️</div>

        {/* Target instructions bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-2xl text-xs font-bold text-slate-700 shadow-sm">
            🎯 Tap the balloons containing: <strong className="text-purple-700 underline">{targetType === 'first' ? 'First Conditional clauses' : 'Zero Conditional clauses'}</strong>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setTargetType(prev => prev === 'first' ? 'zero' : 'first');
            }}
            className="text-xs font-extrabold bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Switch Target 🔁
          </button>
        </div>

        {/* Balloons floating area */}
        <div className="relative flex-1 w-full overflow-hidden">
          {!isGameOver && balloons.map(balloon => (
            <motion.div
              key={balloon.id}
              initial={{ y: 280, opacity: 0 }}
              animate={{ y: -60, opacity: [0, 1, 1, 0.8] }}
              transition={{ duration: balloon.speed, repeat: Infinity, ease: 'linear' }}
              onClick={() => handlePop(balloon)}
              style={{ left: `${balloon.xPos}%` }}
              className="absolute cursor-pointer select-none group"
            >
              {/* Balloon Body */}
              <div
                className={`w-28 sm:w-32 h-36 bg-gradient-to-t ${balloon.color} rounded-full shadow-lg flex flex-col items-center justify-center p-2 text-center text-white font-extrabold text-xs sm:text-sm drop-shadow-md transition-transform group-hover:scale-110 group-active:scale-90 relative`}
              >
                {/* Shiny Reflection */}
                <div className="absolute top-3 left-4 w-4 h-8 bg-white/40 rounded-full rotate-[-20deg]" />
                <span className="leading-tight px-1 drop-shadow-sm pointer-events-none">
                  {balloon.text}
                </span>
                {/* Knot & String */}
                <div className="absolute -bottom-2 w-3 h-3 bg-amber-700/60 rounded-full" />
                <div className="absolute -bottom-6 w-0.5 h-5 bg-slate-400" />
              </div>
            </motion.div>
          ))}

          {/* Game Over Screen */}
          {isGameOver && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 rounded-2xl z-20">
              <AnimalAvatar animal="bunny" mood="celebrate" size="md" className="mb-2" />
              <h3 className="text-2xl font-black text-amber-400">Time's Up!</h3>
              <p className="text-sm font-semibold text-slate-200 mt-1">
                You popped {poppedCount} correct conditional balloons!
              </p>
              <div className="text-3xl font-black text-emerald-400 my-3">
                +{gameScore} Bonus Safari Points!
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={onBackToMenu}
                  className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  Main Safari
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
