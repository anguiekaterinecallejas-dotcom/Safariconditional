import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLASSROOM_SENTENCES, BADGES } from '../data/sentences';
import { PlayerStats } from '../types/grammar';
import { AnimalAvatar } from './AnimalAvatar';
import { sound } from '../utils/soundEffects';
import { X, Award, CheckCircle2, Printer, Star, Sparkles, BookOpen } from 'lucide-react';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  stats
}) => {
  const [studentName, setStudentName] = useState('English Champion');
  const [activeTab, setActiveTab] = useState<'certificate' | 'sentences'>('certificate');

  if (!isOpen) return null;

  const totalStars = stats.starsLevel1 + stats.starsLevel2 + stats.starsLevel3;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-yellow-200" />
              <div>
                <h3 className="font-black text-xl leading-none">
                  Grammar Safari Report & Certificate
                </h3>
                <span className="text-xs text-amber-100 font-medium">
                  Zero & First Conditional Achievement Dossier
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tab buttons */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
            <button
              onClick={() => { sound.playClick(); setActiveTab('certificate'); }}
              className={`pb-3 px-4 font-black text-sm flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
                activeTab === 'certificate'
                  ? 'border-amber-500 text-amber-700 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              Official Certificate
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('sentences'); }}
              className={`pb-3 px-4 font-black text-sm flex items-center gap-2 border-b-2 cursor-pointer transition-all ${
                activeTab === 'sentences'
                  ? 'border-amber-500 text-amber-700 bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              10 Classroom Sentences Review
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {activeTab === 'certificate' ? (
              <div className="space-y-6">
                {/* Name Input */}
                <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <label htmlFor="student-name-input" className="text-sm font-bold text-amber-900 shrink-0">
                    Student Name on Certificate:
                  </label>
                  <input
                    id="student-name-input"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="flex-1 bg-white px-3 py-2 rounded-xl border border-amber-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your name..."
                  />
                  <button
                    onClick={() => {
                      sound.playClick();
                      window.print();
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                </div>

                {/* Printable Certificate Frame */}
                <div className="p-8 border-8 border-double border-amber-400 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/60 rounded-3xl text-center relative shadow-inner">
                  {/* Decorative Corner Seals */}
                  <div className="absolute top-4 left-4 text-2xl">🌿</div>
                  <div className="absolute top-4 right-4 text-2xl">🦁</div>
                  <div className="absolute bottom-4 left-4 text-2xl">🦉</div>
                  <div className="absolute bottom-4 right-4 text-2xl">🐧</div>

                  <span className="text-xs font-black tracking-widest text-amber-600 uppercase block mb-1">
                    CERTIFICATE OF ENGLISH GRAMMAR EXCELLENCE
                  </span>

                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 font-heading">
                    Grammar Safari Graduate
                  </h1>

                  <p className="text-sm text-slate-600 mb-4">
                    This certifies that the outstanding scholar
                  </p>

                  <div className="inline-block px-8 py-2 bg-amber-100/70 border-b-2 border-amber-500 rounded-xl mb-4">
                    <span className="text-2xl md:text-3xl font-black text-amber-900 font-heading">
                      {studentName || 'English Student'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 max-w-lg mx-auto font-medium leading-relaxed mb-6">
                    has successfully investigated, constructed, and mastered the
                    <strong> Zero Conditional</strong> and <strong>First Conditional</strong>
                    tenses through 10 educational classroom scenarios with highest distinction!
                  </p>

                  {/* Badges / Stats ribbon on certificate */}
                  <div className="flex flex-wrap items-center justify-center gap-6 my-6 p-4 bg-white/80 rounded-2xl border border-amber-200">
                    <div className="text-center">
                      <span className="text-xs text-slate-500 font-bold block">SAFARI SCORE</span>
                      <span className="text-2xl font-black text-emerald-600">{stats.score} Pts</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-slate-500 font-bold block">TOTAL STARS</span>
                      <span className="text-2xl font-black text-amber-500">{totalStars} / 9 ⭐</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-slate-500 font-bold block">MAX COMBO</span>
                      <span className="text-2xl font-black text-rose-500">{stats.maxStreak}x Streak</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-amber-200 max-w-md mx-auto">
                    <div>
                      <div className="font-bold text-slate-700">Prof. Ollie & Captain Leo</div>
                      <div>Safari Academy Directors</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-700">A2 EFL Proficiency</div>
                      <div>Verified Classroom Mastery</div>
                    </div>
                  </div>
                </div>

                {/* Badges Earned */}
                <div>
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-3">
                    Badges Unlocked ({stats.badgesUnlocked.length} / {BADGES.length}):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {BADGES.map(badge => {
                      const isUnlocked = stats.badgesUnlocked.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                            isUnlocked
                              ? 'bg-amber-50/70 border-amber-300 text-slate-800 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                          }`}
                        >
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <div className="text-xs font-black">{badge.name}</div>
                            <div className="text-[11px] leading-tight text-slate-500">
                              {isUnlocked ? badge.description : `Req: ${badge.requiredCondition}`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Sentences List View */
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs font-semibold mb-4 border border-blue-200">
                  📖 Complete Guide to the 10 Classroom Educational Sentences. Review them to solidify your mastery of Zero and First Conditional rules!
                </div>

                <div className="space-y-3">
                  {CLASSROOM_SENTENCES.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-amber-300 transition-all shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                          #{idx + 1} {s.categoryIcon} {s.category}
                        </span>
                        <span
                          className={`text-xs font-black px-3 py-1 rounded-full ${
                            s.type === 'zero'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {s.typeLabel}
                        </span>
                      </div>

                      <p className="font-extrabold text-slate-900 text-base mb-1">
                        "{s.text}"
                      </p>

                      <div className="text-xs font-mono font-bold text-amber-700 bg-amber-50/80 px-2.5 py-1 rounded-lg inline-block mb-2">
                        Formula: {s.ruleFormula}
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        💡 <strong>Why?</strong> {s.contextExplanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
