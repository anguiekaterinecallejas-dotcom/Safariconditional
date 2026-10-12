import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimalAvatar } from './AnimalAvatar';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';
import confetti from 'canvas-confetti';
import { X, Play, Pause, RotateCcw, Volume2, Award, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface ExplainerVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteVideo: () => void;
}

interface VideoScene {
  id: number;
  title: string;
  speaker: 'owl' | 'penguin' | 'lion';
  speakerName: string;
  narration: string;
  visualHeading: string;
  visualGraphic: string;
  formulaHighlight?: string;
  exampleSentence?: string;
  badgeUnlock?: boolean;
}

const VIDEO_SCENES: VideoScene[] = [
  {
    id: 1,
    title: "1. Welcome to Condition Safari!",
    speaker: "owl",
    speakerName: "Professor Ollie",
    narration: "Hello students! Welcome to our English Grammar Safari. Today, we are mastering Zero Conditional and First Conditional in our school!",
    visualHeading: "What is a Conditional Sentence?",
    visualGraphic: "🏫",
    exampleSentence: "A condition is a cause, and the result is the effect!"
  },
  {
    id: 2,
    title: "2. The Zero Conditional: 100% Rules",
    speaker: "owl",
    speakerName: "Professor Ollie",
    narration: "Zero Conditional is for things that are ALWAYS true, like school rules and science facts! Look at the formula: If plus Present Simple, followed by Present Simple!",
    visualHeading: "Zero Conditional Formula",
    visualGraphic: "⚖️",
    formulaHighlight: "IF + Present Simple , Present Simple",
    exampleSentence: "If the bell rings, the lesson begins."
  },
  {
    id: 3,
    title: "3. Penny's School Rule Question",
    speaker: "penguin",
    speakerName: "Penny Penguin",
    narration: "Professor Ollie, what if a student arrives after the bell? If a student arrives late, the teacher marks them absent! Both verbs are in the Present Simple!",
    visualHeading: "Everyday Classroom Routine",
    visualGraphic: "🎒",
    formulaHighlight: "arrives (Present) ➔ marks (Present)",
    exampleSentence: "If you press the button, the smartboard turns off."
  },
  {
    id: 4,
    title: "4. The First Conditional: Future Possibilities",
    speaker: "lion",
    speakerName: "Captain Leo",
    narration: "Now hear this roar! First Conditional is for real future possibilities! We use: If plus Present Simple, and WILL plus Base Verb in the main clause!",
    visualHeading: "First Conditional Formula",
    visualGraphic: "🚀",
    formulaHighlight: "IF + Present Simple , WILL + Base Verb",
    exampleSentence: "If we study together, we will pass the spelling quiz!"
  },
  {
    id: 5,
    title: "5. The Golden Secret: Don't use WILL after IF!",
    speaker: "owl",
    speakerName: "Professor Ollie",
    narration: "Remember this golden secret: Never put WILL directly after IF! Always say 'If it rains', never 'If it will rain'. Now you are ready to play!",
    visualHeading: "Golden Secret Rule",
    visualGraphic: "⭐",
    formulaHighlight: "❌ If it will rain ➔ ✅ If it rains, we will stay inside",
    exampleSentence: "You did it! Claim your +20 Safari Score points!",
    badgeUnlock: true
  }
];

export const ExplainerVideoModal: React.FC<ExplainerVideoModalProps> = ({
  isOpen,
  onClose,
  onCompleteVideo
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scene = VIDEO_SCENES[currentSceneIndex];

  // Narration playback
  const playCurrentSceneNarration = () => {
    speech.speak(scene.narration, () => {
      if (isPlaying && currentSceneIndex < VIDEO_SCENES.length - 1) {
        autoPlayTimerRef.current = setTimeout(() => {
          setCurrentSceneIndex(prev => prev + 1);
        }, 1200);
      } else if (isPlaying && currentSceneIndex === VIDEO_SCENES.length - 1) {
        finishVideo();
      }
    });
  };

  useEffect(() => {
    if (isOpen && isPlaying) {
      playCurrentSceneNarration();
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [currentSceneIndex, isPlaying, isOpen]);

  const handleTogglePlay = () => {
    sound.playClick();
    if (!isPlaying) {
      setIsPlaying(true);
      playCurrentSceneNarration();
    } else {
      setIsPlaying(false);
      speech.stop();
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    }
  };

  const handleNextScene = () => {
    sound.playClick();
    speech.stop();
    if (currentSceneIndex < VIDEO_SCENES.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      finishVideo();
    }
  };

  const handlePrevScene = () => {
    sound.playClick();
    speech.stop();
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    sound.playClick();
    speech.stop();
    setCurrentSceneIndex(0);
    setIsPlaying(false);
  };

  const finishVideo = () => {
    setIsPlaying(false);
    setHasCompleted(true);
    sound.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onCompleteVideo();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider">
                Video Lesson
              </span>
              <h3 className="font-extrabold text-lg text-white">
                Zero vs First Conditional Safari Video
              </h3>
            </div>
            <button
              onClick={() => {
                speech.stop();
                sound.playClick();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video Canvas / Stage */}
          <div className="relative aspect-video bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
            {/* Whiteboard / Chalkboard Background decoration */}
            <div className="absolute inset-4 rounded-2xl border-2 border-indigo-500/20 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Stage Indicator */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-amber-400 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                {scene.title}
              </span>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full text-xs text-slate-300">
                <span>Scene {currentSceneIndex + 1} of {VIDEO_SCENES.length}</span>
              </div>
            </div>

            {/* Center Visual Lesson Frame */}
            <div className="my-auto flex flex-col items-center justify-center text-center relative z-10 px-4">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 max-w-xl"
              >
                <div className="text-5xl sm:text-6xl drop-shadow-lg animate-bounce">
                  {scene.visualGraphic}
                </div>

                <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-300">
                  {scene.visualHeading}
                </h4>

                {scene.formulaHighlight && (
                  <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-emerald-300 font-mono font-bold text-base sm:text-lg shadow-inner">
                    {scene.formulaHighlight}
                  </div>
                )}

                {scene.exampleSentence && (
                  <p className="text-slate-200 text-sm sm:text-base font-semibold italic bg-black/30 py-2 px-4 rounded-xl border border-white/10">
                    "{scene.exampleSentence}"
                  </p>
                )}
              </motion.div>
            </div>

            {/* Bottom Subtitle / Narration Box */}
            <div className="relative z-10 flex items-center gap-4 bg-black/60 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/15">
              <AnimalAvatar
                animal={scene.speaker}
                mood={isPlaying ? 'talking' : 'happy'}
                size="sm"
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-amber-400 mb-0.5">
                  {scene.speakerName} speaks:
                </div>
                <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed line-clamp-2">
                  {scene.narration}
                </p>
              </div>
              <button
                onClick={() => speech.speak(scene.narration)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Replay Voice"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Controls Bar */}
          <div className="px-6 py-4 bg-slate-800 flex flex-wrap items-center justify-between gap-4 border-t border-slate-700">
            {/* Progress Chapters */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
              {VIDEO_SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playClick();
                    speech.stop();
                    setCurrentSceneIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer flex-1 ${
                    idx === currentSceneIndex
                      ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                      : idx < currentSceneIndex
                      ? 'bg-emerald-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestart}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrevScene}
                disabled={currentSceneIndex === 0}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
                title="Previous Scene"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Play Narration</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNextScene}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Next Scene"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {currentSceneIndex === VIDEO_SCENES.length - 1 && (
                <button
                  onClick={finishVideo}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-2"
                >
                  <Award className="w-5 h-5" />
                  <span>Claim +20 Pts!</span>
                </button>
              )}
            </div>
          </div>

          {hasCompleted && (
            <div className="px-6 py-3 bg-emerald-600/90 text-white text-xs sm:text-sm font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Explainer Video Complete! 20 Bonus Points Added to Your Score!</span>
              </div>
              <button
                onClick={onClose}
                className="underline hover:text-emerald-100 cursor-pointer"
              >
                Continue to Levels
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
