import React from 'react';
import { motion } from 'motion/react';
import { AnimalName, AnimalMood } from '../types/grammar';

interface AnimalAvatarProps {
  animal: AnimalName;
  mood?: AnimalMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  speechText?: string;
  onClick?: () => void;
}

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({
  animal,
  mood = 'happy',
  size = 'md',
  className = '',
  speechText,
  onClick
}) => {
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48'
  };

  const animationVariants = {
    happy: {
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: "easeInOut" as const }
    },
    celebrate: {
      y: [0, -14, 0, -8, 0],
      rotate: [0, -4, 4, -2, 0],
      scale: [1, 1.08, 1],
      transition: { repeat: Infinity, duration: 1.4, ease: "easeInOut" as const }
    },
    thinking: {
      rotate: [-2, 3, -2],
      y: [0, -2, 0],
      transition: { repeat: Infinity, duration: 2.8, ease: "easeInOut" as const }
    },
    encouraging: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" as const }
    },
    talking: {
      y: [0, -3, 0],
      scale: [1, 1.02, 1],
      transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" as const }
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {speechText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative max-w-xs mb-3 px-4 py-2.5 bg-white text-slate-800 rounded-2xl shadow-lg border-2 border-amber-200 text-sm font-semibold leading-snug z-20"
        >
          <span className="text-amber-600 font-bold mr-1">
            {animal === 'owl' ? 'Prof. Ollie:' :
             animal === 'lion' ? 'Leo:' :
             animal === 'penguin' ? 'Penny:' :
             animal === 'fox' ? 'Detective Toby:' : 'Bella:'}
          </span>
          {speechText}
          {/* Speech bubble arrow pointing down */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
          <div className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 -z-10 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-amber-300" />
        </motion.div>
      )}

      <motion.div
        variants={animationVariants}
        animate={mood}
        onClick={onClick}
        className={`${sizeMap[size]} cursor-pointer select-none filter drop-shadow-md transition-transform hover:scale-105 active:scale-95`}
      >
        {animal === 'owl' && <OwlSVG mood={mood} />}
        {animal === 'lion' && <LionSVG mood={mood} />}
        {animal === 'penguin' && <PenguinSVG mood={mood} />}
        {animal === 'fox' && <FoxSVG mood={mood} />}
        {animal === 'bunny' && <BunnySVG mood={mood} />}
      </motion.div>
    </div>
  );
};

// SVG Sub-components with cute details

const OwlSVG: React.FC<{ mood: AnimalMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    {/* Shadow */}
    <ellipse cx="60" cy="112" rx="36" ry="7" fill="#cbd5e1" opacity="0.6" />
    {/* Body */}
    <ellipse cx="60" cy="72" rx="40" ry="42" fill="#8d5b4c" />
    <ellipse cx="60" cy="78" rx="28" ry="32" fill="#fef3c7" />
    {/* Feathers belly pattern */}
    <path d="M 50 72 Q 60 76 70 72" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M 48 82 Q 60 86 72 82" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M 52 92 Q 60 96 68 92" stroke="#d97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Wings */}
    <path d="M 20 65 Q 12 85 24 95 Q 26 78 28 68 Z" fill="#6e453b" />
    <path d="M 100 65 Q 108 85 96 95 Q 94 78 92 68 Z" fill="#6e453b" />
    {/* Eye circles */}
    <circle cx="44" cy="50" r="17" fill="#ffffff" stroke="#78350f" strokeWidth="2" />
    <circle cx="76" cy="50" r="17" fill="#ffffff" stroke="#78350f" strokeWidth="2" />
    {/* Eyeballs */}
    <circle cx={mood === 'thinking' ? "46" : "44"} cy={mood === 'thinking' ? "46" : "50"} r="8" fill="#1e293b" />
    <circle cx={mood === 'thinking' ? "78" : "76"} cy={mood === 'thinking' ? "46" : "50"} r="8" fill="#1e293b" />
    {/* Eye sparkle highlights */}
    <circle cx={mood === 'thinking' ? "48" : "46"} cy={mood === 'thinking' ? "44" : "48"} r="3" fill="#ffffff" />
    <circle cx={mood === 'thinking' ? "80" : "78"} cy={mood === 'thinking' ? "44" : "48"} r="3" fill="#ffffff" />
    {/* Spectacles/Glasses */}
    <circle cx="44" cy="50" r="15" fill="none" stroke="#f59e0b" strokeWidth="3" />
    <circle cx="76" cy="50" r="15" fill="none" stroke="#f59e0b" strokeWidth="3" />
    <line x1="59" y1="50" x2="61" y2="50" stroke="#f59e0b" strokeWidth="3" />
    {/* Beak */}
    <polygon points="56,58 64,58 60,67" fill="#f97316" />
    {/* Mortarboard graduation cap */}
    <polygon points="60,10 102,22 60,34 18,22" fill="#1e1b4b" />
    <rect x="42" y="27" width="36" height="11" rx="4" fill="#312e81" />
    <circle cx="60" cy="22" r="3" fill="#fbbf24" />
    <path d="M 60 22 Q 88 24 88 38" stroke="#fbbf24" strokeWidth="2" fill="none" />
    <circle cx="88" cy="40" r="3" fill="#fbbf24" />
    {/* Feet */}
    <ellipse cx="48" cy="112" rx="6" ry="3" fill="#f97316" />
    <ellipse cx="72" cy="112" rx="6" ry="3" fill="#f97316" />
  </svg>
);

const LionSVG: React.FC<{ mood: AnimalMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <ellipse cx="60" cy="112" rx="36" ry="7" fill="#cbd5e1" opacity="0.6" />
    {/* Mane */}
    <circle cx="60" cy="56" r="48" fill="#d97706" />
    <circle cx="60" cy="56" r="43" fill="#ea580c" />
    {/* Ears */}
    <circle cx="32" cy="26" r="11" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
    <circle cx="32" cy="26" r="6" fill="#fcd34d" />
    <circle cx="88" cy="26" r="11" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
    <circle cx="88" cy="26" r="6" fill="#fcd34d" />
    {/* Head */}
    <circle cx="60" cy="58" r="34" fill="#fbbf24" />
    {/* Cheeks */}
    <circle cx="44" cy="68" r="6" fill="#fef08a" opacity="0.7" />
    <circle cx="76" cy="68" r="6" fill="#fef08a" opacity="0.7" />
    {/* Eyes */}
    {mood === 'celebrate' ? (
      <>
        <path d="M 40 54 Q 48 46 56 54" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 64 54 Q 72 46 80 54" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="46" cy="52" r="5" fill="#1e293b" />
        <circle cx="74" cy="52" r="5" fill="#1e293b" />
        <circle cx="48" cy="50" r="1.8" fill="#ffffff" />
        <circle cx="76" cy="50" r="1.8" fill="#ffffff" />
      </>
    )}
    {/* Nose & Mouth muzzle */}
    <ellipse cx="60" cy="68" rx="14" ry="9" fill="#fef3c7" />
    <polygon points="55,63 65,63 60,69" fill="#b45309" />
    <path d="M 60 69 L 60 74" stroke="#78350f" strokeWidth="2" />
    <path d="M 54 73 Q 60 78 66 73" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Whiskers */}
    <line x1="32" y1="67" x2="42" y2="68" stroke="#78350f" strokeWidth="1.5" />
    <line x1="30" y1="72" x2="42" y2="72" stroke="#78350f" strokeWidth="1.5" />
    <line x1="78" y1="68" x2="88" y2="67" stroke="#78350f" strokeWidth="1.5" />
    <line x1="78" y1="72" x2="90" y2="72" stroke="#78350f" strokeWidth="1.5" />
    {/* Golden Star badge */}
    <g transform="translate(60, 98) scale(0.7)">
      <polygon points="0,-12 4,-4 12,-3 6,3 8,11 0,7 -8,11 -6,3 -12,-3 -4,-4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
    </g>
  </svg>
);

const PenguinSVG: React.FC<{ mood: AnimalMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <ellipse cx="60" cy="112" rx="34" ry="7" fill="#cbd5e1" opacity="0.6" />
    {/* Blue Backpack behind */}
    <rect x="22" y="48" width="18" height="34" rx="8" fill="#0284c7" />
    <rect x="80" y="48" width="18" height="34" rx="8" fill="#0284c7" />
    {/* Body */}
    <ellipse cx="60" cy="66" rx="34" ry="42" fill="#1e293b" />
    {/* White Belly */}
    <ellipse cx="60" cy="72" rx="22" ry="32" fill="#f8fafc" />
    {/* Wings */}
    <path d="M 28 60 Q 14 74 24 90 Q 32 78 32 66 Z" fill="#0f172a" />
    <path d="M 92 60 Q 106 74 96 90 Q 88 78 88 66 Z" fill="#0f172a" />
    {/* Blush */}
    <circle cx="44" cy="56" r="4" fill="#fda4af" opacity="0.8" />
    <circle cx="76" cy="56" r="4" fill="#fda4af" opacity="0.8" />
    {/* Eyes */}
    {mood === 'celebrate' ? (
      <>
        <path d="M 44 48 Q 50 42 56 48" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 64 48 Q 70 42 76 48" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="48" cy="48" r="4.5" fill="#0f172a" />
        <circle cx="72" cy="48" r="4.5" fill="#0f172a" />
        <circle cx="49" cy="46" r="1.5" fill="#ffffff" />
        <circle cx="73" cy="46" r="1.5" fill="#ffffff" />
      </>
    )}
    {/* Beak */}
    <polygon points="54,54 66,54 60,64" fill="#f97316" />
    {/* Cute Winter/School scarf */}
    <path d="M 38 64 Q 60 74 82 64 Q 74 72 60 74 Q 46 72 38 64 Z" fill="#ef4444" />
    <rect x="66" y="66" width="10" height="20" rx="3" fill="#ef4444" />
    {/* Feet */}
    <ellipse cx="48" cy="108" rx="8" ry="4" fill="#f97316" />
    <ellipse cx="72" cy="108" rx="8" ry="4" fill="#f97316" />
  </svg>
);

const FoxSVG: React.FC<{ mood: AnimalMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <ellipse cx="60" cy="112" rx="34" ry="7" fill="#cbd5e1" opacity="0.6" />
    {/* Ears */}
    <polygon points="26,14 48,38 20,44" fill="#ea580c" />
    <polygon points="28,20 44,38 24,42" fill="#1e293b" />
    <polygon points="94,14 100,44 72,38" fill="#ea580c" />
    <polygon points="92,20 96,42 76,38" fill="#1e293b" />
    {/* Head & Body */}
    <circle cx="60" cy="58" r="32" fill="#ea580c" />
    {/* White cheek patches */}
    <path d="M 30 54 Q 60 76 60 84 Q 60 76 90 54 Q 92 78 60 90 Q 28 78 30 54 Z" fill="#ffffff" />
    {/* Eyes */}
    <circle cx="46" cy="54" r="4.5" fill="#1e293b" />
    <circle cx="74" cy="54" r="4.5" fill="#1e293b" />
    <circle cx="48" cy="52" r="1.5" fill="#ffffff" />
    <circle cx="76" cy="52" r="1.5" fill="#ffffff" />
    {/* Detective Magnifying Glass */}
    <g transform="translate(68, 38)">
      <circle cx="12" cy="12" r="10" fill="#bae6fd" opacity="0.6" stroke="#475569" strokeWidth="2.5" />
      <line x1="20" y1="20" x2="28" y2="28" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
    </g>
    {/* Black Nose */}
    <ellipse cx="60" cy="74" rx="4.5" ry="3.5" fill="#1e293b" />
    <path d="M 56 78 Q 60 82 64 78" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

const BunnySVG: React.FC<{ mood: AnimalMood }> = ({ mood }) => (
  <svg viewBox="0 0 120 120" className="w-full h-full">
    <ellipse cx="60" cy="112" rx="34" ry="7" fill="#cbd5e1" opacity="0.6" />
    {/* Long Ears */}
    <ellipse cx="44" cy="24" rx="8" ry="24" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1.5" />
    <ellipse cx="44" cy="26" rx="4" ry="16" fill="#f472b6" />
    <ellipse cx="76" cy="24" rx="8" ry="24" fill="#fbcfe8" stroke="#ec4899" strokeWidth="1.5" />
    <ellipse cx="76" cy="26" rx="4" ry="16" fill="#f472b6" />
    {/* Head & Body */}
    <circle cx="60" cy="68" r="32" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1.5" />
    {/* Cheeks */}
    <circle cx="42" cy="74" r="5" fill="#f472b6" opacity="0.5" />
    <circle cx="78" cy="74" r="5" fill="#f472b6" opacity="0.5" />
    {/* Eyes */}
    <circle cx="48" cy="64" r="4.5" fill="#4a044e" />
    <circle cx="72" cy="64" r="4.5" fill="#4a044e" />
    <circle cx="49" cy="62" r="1.5" fill="#ffffff" />
    <circle cx="73" cy="62" r="1.5" fill="#ffffff" />
    {/* Nose and mouth */}
    <polygon points="57,71 63,71 60,75" fill="#ec4899" />
    <path d="M 56 76 Q 60 80 64 76" stroke="#db2777" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Bow tie or hair clip */}
    <polygon points="34,42 42,46 34,50" fill="#a855f7" />
    <polygon points="50,42 42,46 50,50" fill="#a855f7" />
    <circle cx="42" cy="46" r="3" fill="#fbbf24" />
  </svg>
);
