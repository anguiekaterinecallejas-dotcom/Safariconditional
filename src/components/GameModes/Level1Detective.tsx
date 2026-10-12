import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLASSROOM_SENTENCES } from '../../data/sentences';
import { SentenceItem, ConditionalType } from '../../types/grammar';
import { AnimalAvatar } from '../AnimalAvatar';
import { sound } from '../../utils/soundEffects';
import { speech } from '../../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, HelpCircle, Check, X, ArrowRight, Sparkles, Award } from 'lucide-react';

interface Level1DetectiveProps {
  onEarnScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
  onCompleteLevel: (stars: number) => void;
  onBackToMenu: () => void;
}

export const Level1Detective: React.FC<Level1DetectiveProps> = ({
  onEarnScore,
  onUpdateStreak,
  onCompleteLevel,
  onBackToMenu
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<ConditionalType | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // We test on the 10 educational sentences
  const currentSentence: SentenceItem = CLASSROOM_SENTENCES[currentIndex];

  const handleSpeakSentence = () => {
    sound.playClick();
    setIsSpeaking(true);
    speech.speak(currentSentence.text, () => {
      setIsSpeaking(false);
    });
  };

  const handleSelectAnswer = (type: ConditionalType) => {
    if (selectedAnswer !== null) return; // Prevent double clicking
    setSelectedAnswer(type);

    const isCorrect = type === currentSentence.type;
    setIsAnswerCorrect(isCorrect);
    onUpdateStreak(isCorrect);

    if (isCorrect) {
      sound.playCorrect();
      onEarnScore(showHint ? 15 : 25);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sound.playWrong();
      setMistakesCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < CLASSROOM_SENTENCES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setShowHint(false);
    } else {
      // Calculate Stars
      let stars = 3;
      if (mistakesCount >= 3) stars = 1;
      else if (mistakesCount >= 1) stars = 2;

      setIsFinished(true);
      sound.playLevelUp();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 }
      });
      onCompleteLevel(stars);
    }
  };

  if (isFinished) {
    const stars = mistakesCount >= 3 ? 1 : mistakesCount >= 1 ? 2 : 3;
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white/95 rounded-3xl shadow-xl text-center border-4 border-amber-300">
        <AnimalAvatar animal="fox" mood="celebrate" size="lg" className="mx-auto mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-2">Level 1 Complete!</h2>
        <p className="text-slate-600 mb-6 font-semibold">
          You analyzed all 10 educational sentences with Detective Toby!
        </p>

        <div className="flex justify-center items-center gap-3 text-4xl mb-6">
          <span className={stars >= 1 ? "text-amber-400 scale-110" : "text-slate-200"}>⭐</span>
          <span className={stars >= 2 ? "text-amber-400 scale-125" : "text-slate-200"}>⭐</span>
          <span className={stars >= 3 ? "text-amber-400 scale-110" : "text-slate-200"}>⭐</span>
        </div>

        <p className="text-sm font-bold text-amber-700 bg-amber-50 py-3 px-6 rounded-2xl max-w-md mx-auto mb-8 border border-amber-200">
          {stars === 3
            ? "Flawless Detective! You unlocked the 'Owl Detective' badge!"
            : "Great detective work! Practice will make you unstoppable!"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-2xl transition-all cursor-pointer"
          >
            Mission Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setIsAnswerCorrect(null);
              setShowHint(false);
              setMistakesCount(0);
              setIsFinished(false);
            }}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Play Level 1 Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress & Header */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            ← Exit
          </button>
          <span className="text-xs font-extrabold px-3 py-1 bg-amber-100 text-amber-800 rounded-full uppercase tracking-wider">
            Level 1: Detective Safari
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">
            Case {currentIndex + 1} of {CLASSROOM_SENTENCES.length}
          </span>
          <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / CLASSROOM_SENTENCES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Detective Challenge Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-slate-100 relative overflow-hidden">
        {/* Category Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-2xl text-xs font-extrabold uppercase tracking-wide">
            <span className="text-base">{currentSentence.categoryIcon}</span>
            <span>{currentSentence.category}</span>
          </div>

          <button
            onClick={handleSpeakSentence}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-sky-600 animate-pulse' : ''}`} />
            <span>Listen</span>
          </button>
        </div>

        {/* The Target Educational Sentence */}
        <div className="my-6 p-6 bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-3xl border border-amber-200 text-center">
          <p className="text-xl md:text-2xl font-black text-slate-800 leading-snug">
            "{currentSentence.text}"
          </p>
        </div>

        {/* Animal Guide Prompt */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
          <AnimalAvatar
            animal="fox"
            mood={selectedAnswer === null ? 'thinking' : isAnswerCorrect ? 'celebrate' : 'encouraging'}
            size="sm"
            className="shrink-0"
          />
          <div className="text-sm text-slate-700">
            <span className="font-extrabold text-amber-600 block">Detective Toby asks:</span>
            {selectedAnswer === null ? (
              <span>"Inspect this sentence closely! Is it an eternal school rule/truth or a real future outcome?"</span>
            ) : isAnswerCorrect ? (
              <span className="text-emerald-700 font-bold">"Spot on, detective! {currentSentence.dialogue}"</span>
            ) : (
              <span className="text-rose-700 font-bold">"Look closer! {currentSentence.whyClue}"</span>
            )}
          </div>
        </div>

        {/* Hint Disclosure */}
        <div className="mb-6 flex justify-end">
          {!showHint && selectedAnswer === null && (
            <button
              onClick={() => { sound.playClick(); setShowHint(true); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need Clue? (-10 Pts)</span>
            </button>
          )}

          {showHint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs bg-amber-100 text-amber-900 font-bold p-3 rounded-xl border border-amber-300 w-full"
            >
              🔍 <strong>Detective Clue:</strong> Look for: <em>"{currentSentence.clueWord}"</em>
            </motion.div>
          )}
        </div>

        {/* Interactive Answer Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Zero Conditional Button */}
          <motion.button
            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
            onClick={() => handleSelectAnswer('zero')}
            disabled={selectedAnswer !== null}
            className={`p-5 rounded-2xl font-black text-left flex items-start gap-4 transition-all cursor-pointer border-3 ${
              selectedAnswer === null
                ? 'bg-emerald-50/70 border-emerald-200 text-slate-800 hover:bg-emerald-100/70 hover:border-emerald-400 shadow-sm'
                : selectedAnswer === 'zero'
                ? isAnswerCorrect
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg'
                  : 'bg-rose-500 border-rose-600 text-white shadow-lg'
                : currentSentence.type === 'zero'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                : 'opacity-40 border-slate-200 bg-slate-50'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 mt-0.5">
              0
            </div>
            <div>
              <div className="text-base sm:text-lg">Zero Conditional</div>
              <p className="text-xs font-semibold opacity-90 mt-0.5">
                School rule, habit, or 100% universal truth.
              </p>
            </div>
          </motion.button>

          {/* First Conditional Button */}
          <motion.button
            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
            onClick={() => handleSelectAnswer('first')}
            disabled={selectedAnswer !== null}
            className={`p-5 rounded-2xl font-black text-left flex items-start gap-4 transition-all cursor-pointer border-3 ${
              selectedAnswer === null
                ? 'bg-sky-50/70 border-sky-200 text-slate-800 hover:bg-sky-100/70 hover:border-sky-400 shadow-sm'
                : selectedAnswer === 'first'
                ? isAnswerCorrect
                  ? 'bg-sky-500 border-sky-600 text-white shadow-lg'
                  : 'bg-rose-500 border-rose-600 text-white shadow-lg'
                : currentSentence.type === 'first'
                ? 'bg-sky-100 border-sky-400 text-sky-900'
                : 'opacity-40 border-slate-200 bg-slate-50'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-black shrink-0 mt-0.5">
              1
            </div>
            <div>
              <div className="text-base sm:text-lg">First Conditional</div>
              <p className="text-xs font-semibold opacity-90 mt-0.5">
                Real future possibility, promise, or consequence.
              </p>
            </div>
          </motion.button>
        </div>

        {/* Feedback Section & Next Button */}
        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="text-sm font-semibold text-slate-700">
                <span className="font-extrabold text-slate-900 block">Explanation:</span>
                {currentSentence.contextExplanation}
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
