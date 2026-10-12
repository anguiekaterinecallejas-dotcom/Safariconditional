export type ConditionalType = 'zero' | 'first';

export type AnimalName = 'owl' | 'lion' | 'penguin' | 'fox' | 'bunny';

export type AnimalMood = 'happy' | 'celebrate' | 'thinking' | 'encouraging' | 'talking';

export interface SentenceItem {
  id: number;
  text: string;
  ifClause: string;
  mainClause: string;
  type: ConditionalType;
  typeLabel: string;
  category: 'School Rule' | 'Study Habits' | 'Classroom Technology' | 'Group Project' | 'Library Policy' | 'Weather & Recess' | 'Art & Science' | 'Teacher Support' | 'School Health' | 'Quiz Motivation';
  categoryIcon: string;
  contextExplanation: string;
  ruleFormula: string;
  // For Verb Builder Challenge
  verbIfTarget: string;
  verbIfOptions: string[];
  verbMainTarget: string;
  verbMainOptions: string[];
  // Animal Guide dialogue
  animalGuide: AnimalName;
  dialogue: string;
  clueWord: string;
  whyClue: string;
}

export interface PlayerStats {
  score: number;
  streak: number;
  maxStreak: number;
  starsLevel1: number;
  starsLevel2: number;
  starsLevel3: number;
  starsBonus: number;
  badgesUnlocked: string[];
  completedSentenceIds: number[];
  videoWatched: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredCondition: string;
}
