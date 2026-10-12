import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimalAvatar } from './AnimalAvatar';
import { sound } from '../utils/soundEffects';
import { speech } from '../utils/speech';
import { Volume2, Sparkles, CheckCircle2, ArrowRight, Lightbulb, BookOpen, Layers } from 'lucide-react';

interface GrammarLessonProps {
  onStartQuest: () => void;
  onOpenVideo: () => void;
}

export const GrammarLesson: React.FC<GrammarLessonProps> = ({ onStartQuest, onOpenVideo }) => {
  const [activeTab, setActiveTab] = useState<'zero' | 'first' | 'compare'>('zero');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  // Mini test state
  const [testAnswer, setTestAnswer] = useState<string | null>(null);
  const [isTestCorrect, setIsTestCorrect] = useState<boolean | null>(null);

  const handleSpeak = (text: string, id: string) => {
    sound.playClick();
    setIsSpeaking(id);
    speech.speak(text, () => {
      setIsSpeaking(null);
    });
  };

  const handleQuickCheck = (selected: 'zero' | 'first') => {
    setTestAnswer(selected);
    if (selected === 'first') {
      setIsTestCorrect(true);
      sound.playCorrect();
    } else {
      setIsTestCorrect(false);
      sound.playWrong();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-amber-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-amber-100">
        <div className="flex items-center gap-4">
          <AnimalAvatar animal="owl" mood="happy" size="md" />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold tracking-wide uppercase mb-1">
              <BookOpen className="w-3.5 h-3.5" /> A2 Grammar Academy
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Mastering Zero & First Conditional
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Learn how condition and consequence work together in English school life!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              sound.playClick();
              onOpenVideo();
            }}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            Watch Explainer Video (+20 Pts)
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 my-6 p-1.5 bg-slate-100 rounded-2xl">
        <button
          onClick={() => { sound.playClick(); setActiveTab('zero'); }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'zero'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">0</span>
          Zero Conditional (Rules & Facts)
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('first'); }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'first'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
          First Conditional (Future & Promises)
        </button>
        <button
          onClick={() => { sound.playClick(); setActiveTab('compare'); }}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'compare'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          Side-by-Side Comparison
        </button>
      </div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {activeTab === 'zero' && (
          <motion.div
            key="tab-zero"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Rule Formula Box */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 text-emerald-300 font-black text-6xl opacity-30 select-none">
                100%
              </div>
              <h2 className="text-xl font-black text-emerald-800 flex items-center gap-2">
                <span className="p-1.5 bg-emerald-200 text-emerald-800 rounded-lg text-sm">FORMULA</span>
                The Zero Conditional Pattern
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    IF / WHEN CLAUSE (Condition)
                  </span>
                  <div className="text-lg font-extrabold text-slate-800">
                    If / When + <span className="text-emerald-600 underline decoration-2">Present Simple</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">e.g. If the bell rings...</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    MAIN CLAUSE (Result)
                  </span>
                  <div className="text-lg font-extrabold text-slate-800">
                    <span className="text-emerald-600 underline decoration-2">Present Simple</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">e.g. ...the teacher marks students late.</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 bg-emerald-100/60 p-3.5 rounded-xl text-emerald-900 text-sm">
                <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>When to use Zero Conditional?</strong> Use it for <span className="underline font-bold">universal truths</span>, <span className="underline font-bold">habits</span>, <span className="underline font-bold">school rules</span>, and <span className="underline font-bold">scientific facts</span>. It is 100% always true whenever the condition occurs!
                </div>
              </div>
            </div>

            {/* Educational Classroom Examples */}
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-3 flex items-center gap-2">
                🎓 School & Classroom Examples:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-300 shadow-sm transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">School Rule</span>
                      <button
                        onClick={() => handleSpeak("If a student arrives after the bell rings, the teacher marks them late.", "z1")}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className={`w-4 h-4 ${isSpeaking === 'z1' ? 'text-emerald-600 animate-pulse' : ''}`} />
                      </button>
                    </div>
                    <p className="text-slate-800 font-bold text-base leading-snug">
                      "If a student <span className="text-emerald-600 bg-emerald-50 px-1 rounded">arrives</span> late, the teacher <span className="text-emerald-600 bg-emerald-50 px-1 rounded">marks</span> them absent."
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic">
                    💡 Routine: It happens every time without exception.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-emerald-300 shadow-sm transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">Art & Science</span>
                      <button
                        onClick={() => handleSpeak("If you mix blue paint and yellow paint, you get green paint.", "z2")}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className={`w-4 h-4 ${isSpeaking === 'z2' ? 'text-emerald-600 animate-pulse' : ''}`} />
                      </button>
                    </div>
                    <p className="text-slate-800 font-bold text-base leading-snug">
                      "If you <span className="text-emerald-600 bg-emerald-50 px-1 rounded">mix</span> blue and yellow paint, you <span className="text-emerald-600 bg-emerald-50 px-1 rounded">get</span> green."
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic">
                    💡 Universal scientific reality in art class!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'first' && (
          <motion.div
            key="tab-first"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Rule Formula Box */}
            <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 text-sky-300 font-black text-6xl opacity-30 select-none">
                🔮
              </div>
              <h2 className="text-xl font-black text-sky-800 flex items-center gap-2">
                <span className="p-1.5 bg-sky-200 text-sky-800 rounded-lg text-sm">FORMULA</span>
                The First Conditional Pattern
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-sky-100">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">
                    IF CLAUSE (Possible Condition)
                  </span>
                  <div className="text-lg font-extrabold text-slate-800">
                    If + <span className="text-sky-600 underline decoration-2">Present Simple</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">e.g. If you study hard...</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-sky-100">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">
                    MAIN CLAUSE (Future Result)
                  </span>
                  <div className="text-lg font-extrabold text-slate-800">
                    <span className="text-sky-600 underline decoration-2">WILL + Base Verb</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">e.g. ...you will pass the exam!</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 bg-sky-100/60 p-3.5 rounded-xl text-sky-900 text-sm">
                <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>When to use First Conditional?</strong> Use it for <span className="underline font-bold">real future possibilities</span>, <span className="underline font-bold">promises</span>, <span className="underline font-bold">plans</span>, or <span className="underline font-bold">consequences</span>.
                  <br />
                  <span className="text-red-700 font-bold">⚠️ Warning rule:</span> Never put "will" right after "if"! (Say <em>"If it rains"</em>, NOT <em>"If it will rain"</em>).
                </div>
              </div>
            </div>

            {/* Educational Classroom Examples */}
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-3 flex items-center gap-2">
                🎓 School & Classroom Examples:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-sky-300 shadow-sm transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full">Motivation & Reward</span>
                      <button
                        onClick={() => handleSpeak("If everyone passes Friday's quiz, our teacher will bring cupcakes.", "f1")}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className={`w-4 h-4 ${isSpeaking === 'f1' ? 'text-sky-600 animate-pulse' : ''}`} />
                      </button>
                    </div>
                    <p className="text-slate-800 font-bold text-base leading-snug">
                      "If everyone <span className="text-sky-600 bg-sky-50 px-1 rounded">passes</span> Friday's quiz, our teacher <span className="text-sky-600 bg-sky-50 px-1 rounded">will bring</span> cupcakes."
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic">
                    💡 Real future possibility with a planned reward!
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-sky-300 shadow-sm transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full">Classroom Activity</span>
                      <button
                        onClick={() => handleSpeak("If you raise your hand, Mr. Davies will help you.", "f2")}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className={`w-4 h-4 ${isSpeaking === 'f2' ? 'text-sky-600 animate-pulse' : ''}`} />
                      </button>
                    </div>
                    <p className="text-slate-800 font-bold text-base leading-snug">
                      "If you <span className="text-sky-600 bg-sky-50 px-1 rounded">raise</span> your hand, Mr. Davies <span className="text-sky-600 bg-sky-50 px-1 rounded">will help</span> you."
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 italic">
                    💡 An immediate future outcome waiting to happen.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'compare' && (
          <motion.div
            key="tab-compare"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Direct Comparison Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-sm border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-4 font-black">Feature</th>
                    <th className="p-4 font-black text-emerald-700 bg-emerald-50/50">Zero Conditional (0)</th>
                    <th className="p-4 font-black text-sky-700 bg-sky-50/50">First Conditional (1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-bold text-slate-800">Meaning</td>
                    <td className="p-4 text-emerald-900 bg-emerald-50/20">General truths, permanent rules, habits</td>
                    <td className="p-4 text-sky-900 bg-sky-50/20">Specific future event, realistic prediction</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-800">If-Clause Verb</td>
                    <td className="p-4 font-mono font-bold text-emerald-700 bg-emerald-50/20">Present Simple</td>
                    <td className="p-4 font-mono font-bold text-sky-700 bg-sky-50/20">Present Simple</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-800">Main Clause Verb</td>
                    <td className="p-4 font-mono font-bold text-emerald-700 bg-emerald-50/20">Present Simple</td>
                    <td className="p-4 font-mono font-bold text-sky-700 bg-sky-50/20">WILL + Base Verb</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-800">Certainty</td>
                    <td className="p-4 bg-emerald-50/20">100% Guaranteed always</td>
                    <td className="p-4 bg-sky-50/20">High probability in the future</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-800">Classroom Clue</td>
                    <td className="p-4 text-xs bg-emerald-50/20">"Whenever it happens, this is the rule."</td>
                    <td className="p-4 text-xs bg-sky-50/20">"If we do this today, that will happen tomorrow."</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Interactive Mini-Quiz to verify before starting */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <AnimalAvatar animal="fox" mood="thinking" size="sm" />
                <div>
                  <h4 className="font-extrabold text-amber-900">Detective Toby's Quick Check:</h4>
                  <p className="text-slate-700 text-sm">
                    "If we finish our project early, the teacher <strong>will let</strong> us play a game."
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <button
                  onClick={() => handleQuickCheck('zero')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    testAnswer === 'zero'
                      ? 'bg-red-500 text-white'
                      : 'bg-white border-2 border-amber-200 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  It's Zero Conditional
                </button>
                <button
                  onClick={() => handleQuickCheck('first')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    testAnswer === 'first'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border-2 border-amber-200 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  It's First Conditional
                </button>

                {isTestCorrect !== null && (
                  <span className={`text-sm font-bold flex items-center gap-1.5 ml-2 ${isTestCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                    {isTestCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Brilliant! Notice "will let"—that's First Conditional!
                      </>
                    ) : (
                      "Look closely at 'will let'—'will' means First Conditional!"
                    )}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Button */}
      <div className="mt-8 pt-6 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-xl">🌟</span>
          <span>10 Educational Classroom Situations Ready in 3 Progressive Levels!</span>
        </div>

        <button
          onClick={() => {
            sound.playLevelUp();
            onStartQuest();
          }}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>Start Safari Quest Now</span>
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
