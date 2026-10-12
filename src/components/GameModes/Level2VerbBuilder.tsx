import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLASSROOM_SENTENCES } from '../../data/sentences';
import { SentenceItem } from '../../types/grammar';
import { AnimalAvatar } from '../AnimalAvatar';
import { sound } from '../../utils/soundEffects';
import { speech } from '../../utils/speech';
import confetti from 'canvas-confetti';
import { Check, X, ArrowRight, RotateCcw, Volume2, Sparkles, Wrench } from 'lucide-react';

interface Level2VerbBuilderProps {
  onEarnScore: (points: number) => void;
  onUpdateStreak: (isCorrect: boolean) => void;
  onCompleteLevel: (stars: number) => void;
  onBackToMenu: () => void;
}

export const Level2VerbBuilder: React.FC<Level2VerbBuilderProps> = ({
  onEarnScore,
  onUpdateStreak,
  onCompleteLevel,
  onBackToMenu
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIfVerb, setSelectedIfVerb] = useState<string | null>(null);
  const [selectedMainVerb, setSelectedMainVerb] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sentence: SentenceItem = CLASSROOM_SENTENCES[currentIndex];

  const handleSelectIf = (verb: string) => {
    if (isEvaluated) return;
    sound.playClick();
    setSelectedIfVerb(verb);
  };

  const handleSelectMain = (verb: string) => {
    if (isEvaluated) return;
    sound.playClick();
    setSelectedMainVerb(verb);
  };

  const handleCheckAnswer = () => {
    if (!selectedIfVerb || !selectedMainVerb) return;

    const ifPassed = selectedIfVerb === sentence.verbIfTarget;
    const mainPassed = selectedMainVerb === sentence.verbMainTarget;
    const passed = ifPassed && mainPassed;

    setIsEvaluated(true);
    setIsCorrect(passed);
    onUpdateStreak(passed);

    if (passed) {
      sound.playCorrect();
      onEarnScore(30);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      sound.playWrong();
      setMistakes(prev => prev + 1);
    }
  };

  const handleNextSentence = () => {
    sound.playClick();
    if (currentIndex < CLASSROOM_SENTENCES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedIfVerb(null);
      setSelectedMainVerb(null);
      setIsEvaluated(false);
      setIsCorrect(false);
    } else {
      let stars = 3;
      if (mistakes >= 4) stars = 1;
      else if (mistakes >= 2) stars = 2;

      setIsFinished(true);
      sound.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
      onCompleteLevel(stars);
    }
  };

  const handleSpeak = () => {
    sound.playClick();
    setIsSpeaking(true);
    speech.speak(sentence.text, () => {
      setIsSpeaking(false);
    });
  };

  if (isFinished) {
    const stars = mistakes >= 4 ? 1 : mistakes >= 2 ? 2 : 3;
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white/95 rounded-3xl shadow-xl text-center border-4 border-sky-400">
        <AnimalAvatar animal="penguin" mood="celebrate" size="lg" className="mx-auto mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-2">Verb Puzzle Solved!</h2>
        <p className="text-slate-600 mb-6 font-semibold">
          You mastered building both the If-clause and Main-clause verbs across all 10 scenarios!
        </p>

        <div className="flex justify-center items-center gap-3 text-4xl mb-6">
          <span className={stars >= 1 ? "text-amber-400 scale-110" : "text-slate-200"}>⭐</span>
          <span className={stars >= 2 ? "text-amber-400 scale-125" : "text-slate-200"}>⭐</span>
          <span className={stars >= 3 ? "text-amber-400 scale-110" : "text-slate-200"}>⭐</span>
        </div>

        <p className="text-sm font-bold text-sky-800 bg-sky-50 py-3 px-6 rounded-2xl max-w-md mx-auto mb-8 border border-sky-200">
          {stars === 3
            ? "Amazing! You earned the 'Verb Architect' badge!"
            : "Super job assembling the conditional sentences!"}
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
              setSelectedIfVerb(null);
              setSelectedMainVerb(null);
              setIsEvaluated(false);
              setIsCorrect(false);
              setMistakes(0);
              setIsFinished(false);
            }}
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Build Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Progress */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-sky-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            ← Exit
          </button>
          <span className="text-xs font-extrabold px-3 py-1 bg-sky-100 text-sky-800 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            Level 2: Verb Puzzle Builder
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">
            Puzzle {currentIndex + 1} of {CLASSROOM_SENTENCES.length}
          </span>
          <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / CLASSROOM_SENTENCES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Puzzle Workbench */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-slate-100 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-2xl text-xs font-extrabold uppercase tracking-wide">
            <span>{sentence.categoryIcon}</span>
            <span>{sentence.category}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Formula: {sentence.type === 'zero' ? 'Zero (If + Pres, Pres)' : 'First (If + Pres, Will + Verb)'}
          </div>
        </div>

        {/* Puzzle Sentence Canvas */}
        <div className="my-6 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-sky-300 text-center">
          <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
            <span className="text-sky-700 font-extrabold">If </span>
            {sentence.id === 1 && "a student "}
            {sentence.id === 2 && "you "}
            {sentence.id === 3 && "you "}
            {sentence.id === 4 && "we "}
            {sentence.id === 5 && "a student "}
            {sentence.id === 6 && "it "}
            {sentence.id === 7 && "you "}
            {sentence.id === 8 && "you "}
            {sentence.id === 9 && "a child "}
            {sentence.id === 10 && "everyone "}

            {/* If Slot */}
            <span
              className={`inline-block px-3 py-1 mx-1.5 rounded-xl border-2 font-mono font-black text-sm md:text-base align-middle shadow-sm ${
                selectedIfVerb
                  ? isEvaluated
                    ? selectedIfVerb === sentence.verbIfTarget
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-sky-500 text-white border-sky-600'
                  : 'bg-white text-slate-400 border-dashed border-sky-400'
              }`}
            >
              {selectedIfVerb || '[ Slot 1: If-Verb ]'}
            </span>

            {sentence.id === 1 && " after the bell rings, the teacher "}
            {sentence.id === 2 && " your English every day, you "}
            {sentence.id === 3 && " the red power button, the screen "}
            {sentence.id === 4 && " our group project early, the teacher "}
            {sentence.id === 5 && " their library card, they "}
            {sentence.id === 6 && " during recess this afternoon, pupils "}
            {sentence.id === 7 && " blue and yellow paint, you "}
            {sentence.id === 8 && " your hand, Mr. Davies "}
            {sentence.id === 9 && " sick in class, the teacher "}
            {sentence.id === 10 && " Friday's quiz, our teacher "}

            {/* Main Slot */}
            <span
              className={`inline-block px-3 py-1 mx-1.5 rounded-xl border-2 font-mono font-black text-sm md:text-base align-middle shadow-sm ${
                selectedMainVerb
                  ? isEvaluated
                    ? selectedMainVerb === sentence.verbMainTarget
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-indigo-500 text-white border-indigo-600'
                  : 'bg-white text-slate-400 border-dashed border-indigo-400'
              }`}
            >
              {selectedMainVerb || '[ Slot 2: Main-Verb ]'}
            </span>

            {sentence.id === 1 && " them late."}
            {sentence.id === 2 && " fluently soon."}
            {sentence.id === 3 && " off."}
            {sentence.id === 4 && " us play."}
            {sentence.id === 5 && " any new books."}
            {sentence.id === 6 && " comics."}
            {sentence.id === 7 && " green paint."}
            {sentence.id === 8 && " you with the question."}
            {sentence.id === 9 && " them to the nurse."}
            {sentence.id === 10 && " victory cupcakes."}
          </p>
        </div>

        {/* Verb Bank Selection Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Column 1: If-Clause Verb Options */}
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-sky-800 mb-3 flex items-center justify-between">
              <span>Choose Slot 1 (If-Clause):</span>
              <span className="text-slate-500 lowercase font-normal">Present Simple</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {sentence.verbIfOptions.map(verb => (
                <button
                  key={verb}
                  onClick={() => handleSelectIf(verb)}
                  disabled={isEvaluated}
                  className={`py-2.5 px-2 rounded-xl font-mono font-bold text-sm transition-all cursor-pointer border-2 ${
                    selectedIfVerb === verb
                      ? 'bg-sky-600 text-white border-sky-700 shadow-md scale-105'
                      : 'bg-white hover:bg-sky-100 border-sky-200 text-slate-700'
                  }`}
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Main-Clause Verb Options */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-800 mb-3 flex items-center justify-between">
              <span>Choose Slot 2 (Main-Clause):</span>
              <span className="text-slate-500 lowercase font-normal">
                {sentence.type === 'zero' ? 'Present Simple' : 'will + verb'}
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {sentence.verbMainOptions.map(verb => (
                <button
                  key={verb}
                  onClick={() => handleSelectMain(verb)}
                  disabled={isEvaluated}
                  className={`py-2.5 px-2 rounded-xl font-mono font-bold text-sm transition-all cursor-pointer border-2 ${
                    selectedMainVerb === verb
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                      : 'bg-white hover:bg-indigo-100 border-indigo-200 text-slate-700'
                  }`}
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animal Guidance */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
          <AnimalAvatar
            animal={sentence.animalGuide}
            mood={!isEvaluated ? 'talking' : isCorrect ? 'celebrate' : 'encouraging'}
            size="sm"
            className="shrink-0"
          />
          <div className="text-sm text-slate-700">
            <span className="font-extrabold text-indigo-700 block">Classroom Coach:</span>
            {!isEvaluated ? (
              <span>"Pick one verb tile for Slot 1 and one for Slot 2, then press Check Sentence!"</span>
            ) : isCorrect ? (
              <span className="text-emerald-700 font-bold">
                "Fantastic sentence engineering! {sentence.dialogue}"
              </span>
            ) : (
              <span className="text-rose-700 font-bold">
                "Not quite right! Target: '{sentence.verbIfTarget}' + '{sentence.verbMainTarget}'. Formula: {sentence.ruleFormula}"
              </span>
            )}
          </div>
        </div>

        {/* Evaluation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {isEvaluated && (
              <button
                onClick={handleSpeak}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear Full Sentence</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isEvaluated ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedIfVerb || !selectedMainVerb}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-40 text-white font-black rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Check Sentence
              </button>
            ) : (
              <button
                onClick={handleNextSentence}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next Puzzle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
