import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLASSROOM_SENTENCES } from '../../data/sentences';
import { SentenceItem } from '../../types/grammar';
import { AnimalAvatar } from '../AnimalAvatar';
import { sound } from '../../utils/soundEffects';
import { speech } from '../../utils/speech';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, AlertCircle, ArrowRight, Trophy, Flame } from 'lucide-react';

interface Level3QuestProps {
  streak: number;
  onEarnScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
  onCompleteLevel: (stars: number) => void;
  onBackToMenu: () => void;
}

export const Level3ClassroomQuest: React.FC<Level3QuestProps> = ({
  streak,
  onEarnScore,
  onUpdateStreak,
  onCompleteLevel,
  onBackToMenu
}) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const item: SentenceItem = CLASSROOM_SENTENCES[currentScenarioIndex];

  // Generate 3 contextual options tailored to the classroom dilemma
  const getQuestionsOptions = (s: SentenceItem) => {
    if (s.type === 'zero') {
      return [
        {
          id: 1,
          text: s.text,
          isCorrect: true,
          label: "Zero Conditional (Permanent school rule/fact: Present + Present)"
        },
        {
          id: 2,
          text: s.text.replace("marks", "will mark").replace("turns off", "will turn off").replace("mix", "will mix").replace("feels", "will feel").replace("cannot borrow", "will not borrow"),
          isCorrect: false,
          label: "Incorrect: Using 'will' for a routine general school rule is inaccurate."
        },
        {
          id: 3,
          text: s.text.replace("arrives", "arrived").replace("press", "pressed").replace("loses", "lost").replace("mix", "mixed").replace("feels", "felt"),
          isCorrect: false,
          label: "Incorrect: Using past tense does not express a regular present procedure."
        }
      ];
    } else {
      return [
        {
          id: 1,
          text: s.text,
          isCorrect: true,
          label: "First Conditional (Real future outcome: Present Simple + WILL)"
        },
        {
          id: 2,
          text: s.text.replace("practice", "will practice").replace("finish", "will finish").replace("rains", "will rain").replace("raise", "will raise").replace("passes", "will pass"),
          isCorrect: false,
          label: "Incorrect: Golden Rule broken! Never put 'will' directly inside the 'if' clause!"
        },
        {
          id: 3,
          text: s.text.replace("will speak", "speaks").replace("will let", "lets").replace("will read", "reads").replace("will help", "helps").replace("will bring", "brings"),
          isCorrect: false,
          label: "Incorrect: Missing 'will' in the main clause for a specific future prediction."
        }
      ];
    }
  };

  const options = getQuestionsOptions(item);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    const chosen = options[index];
    setIsAnswered(true);
    setIsCorrect(chosen.isCorrect);
    onUpdateStreak(chosen.isCorrect);

    if (chosen.isCorrect) {
      sound.playCorrect();
      // Scoring with multiplier bonus based on streak
      const multiplier = streak >= 5 ? 3 : streak >= 2 ? 2 : 1;
      onEarnScore(35 * multiplier);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      sound.playWrong();
      setMistakes(prev => prev + 1);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentScenarioIndex < CLASSROOM_SENTENCES.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      let stars = 3;
      if (mistakes >= 4) stars = 1;
      else if (mistakes >= 2) stars = 2;

      setIsFinished(true);
      sound.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.4 }
      });
      onCompleteLevel(stars);
    }
  };

  const handleSpeak = (text: string) => {
    sound.playClick();
    setIsSpeaking(true);
    speech.speak(text, () => {
      setIsSpeaking(false);
    });
  };

  if (isFinished) {
    const stars = mistakes >= 4 ? 1 : mistakes >= 2 ? 2 : 3;
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white/95 rounded-3xl shadow-xl text-center border-4 border-emerald-400">
        <AnimalAvatar animal="lion" mood="celebrate" size="lg" className="mx-auto mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-2">Classroom Safari Mastered!</h2>
        <p className="text-slate-600 mb-6 font-semibold">
          You passed all 10 educational scenarios with high honor and grammar precision!
        </p>

        <div className="flex justify-center items-center gap-3 text-4xl mb-6">
          <span className={stars >= 1 ? "text-amber-400 scale-110" : "text-slate-200"}>⭐</span>
          <span className={stars >= 2 ? "text-amber-400 scale-125" : "text-slate-200"}>⭐</span>
          <span className={stars >= 3 ? "text-amber-400 scale-110" : "text-slate-200"}>⭐</span>
        </div>

        <p className="text-sm font-bold text-emerald-800 bg-emerald-50 py-3 px-6 rounded-2xl max-w-md mx-auto mb-8 border border-emerald-200">
          {stars === 3
            ? "Trophy Unlocked: 'Classroom Hero'! You are the ultimate Conditional King!"
            : "Great job completing the entire school journey!"}
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
              setCurrentScenarioIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setIsCorrect(false);
              setMistakes(0);
              setIsFinished(false);
            }}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Play Quest Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            ← Exit
          </button>
          <span className="text-xs font-extrabold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            Level 3: Classroom Quest
          </span>
        </div>

        {streak >= 2 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-full text-xs shadow-md animate-pulse">
            <Flame className="w-4 h-4 fill-current text-red-600" />
            <span>{streak}x Combo Multiplier!</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Station {currentScenarioIndex + 1}/10
          </span>
          <div className="w-20 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all duration-300"
              style={{ width: `${((currentScenarioIndex + 1) / CLASSROOM_SENTENCES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Classroom Station Stage */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-slate-100 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-2xl text-xs font-extrabold uppercase tracking-wide">
            <span className="text-lg">{item.categoryIcon}</span>
            <span>Scenario: {item.category}</span>
          </div>

          <span className="text-xs font-bold text-slate-400">
            Target Type: <strong className="text-slate-700">{item.typeLabel}</strong>
          </span>
        </div>

        {/* Narrative Classroom Prompt */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-2xl border border-teal-200 my-4 flex items-start gap-4">
          <AnimalAvatar
            animal={item.animalGuide}
            mood={!isAnswered ? 'talking' : isCorrect ? 'celebrate' : 'encouraging'}
            size="sm"
            className="shrink-0"
          />
          <div>
            <h3 className="font-black text-teal-900 text-base md:text-lg mb-1">
              Classroom Situation #{item.id}:
            </h3>
            <p className="text-sm font-semibold text-slate-700 leading-snug">
              {item.contextExplanation}
            </p>
          </div>
        </div>

        {/* Question: Which sentence structure is grammatically correct? */}
        <div className="my-5">
          <h4 className="font-extrabold text-slate-800 text-sm md:text-base mb-3">
            Choose the correct English conditional sentence for this situation:
          </h4>

          <div className="space-y-3">
            {options.map((opt, idx) => (
              <motion.button
                key={opt.id}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl text-left font-bold text-sm md:text-base transition-all cursor-pointer border-2 flex items-start gap-3 ${
                  !isAnswered
                    ? 'bg-slate-50 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-300 text-slate-800 shadow-sm'
                    : selectedOption === idx
                    ? opt.isCorrect
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg'
                      : 'bg-rose-500 border-rose-600 text-white shadow-lg'
                    : opt.isCorrect
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                    : 'opacity-40 bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                </span>
                <div className="flex-1">
                  <div>"{opt.text}"</div>
                  {isAnswered && (
                    <div className="text-xs mt-1 opacity-90 font-medium">
                      {opt.label}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Feedback & Progression */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSpeak(item.text)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Pronounce</span>
                </button>

                <div className="text-xs font-semibold text-slate-600">
                  Formula: <span className="font-mono font-bold text-teal-800">{item.ruleFormula}</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
