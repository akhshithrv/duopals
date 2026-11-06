export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  greeting: string;
  speechCode: string;
  samplePhrases: string[];
}

export interface Partner {
  id: string;
  name: string;
  age: number;
  location: string;
  nativeLanguage: string;
  learningLanguage: string;
  nativeLangCode: string;
  learningLangCode: string;
  proficiencyInUserLang: string;
  avatarUrl: string;
  bio: string;
  interests: string[];
  speakingSpeed: string;
  accentNote: string;
  streak: number;
  onlineStatus: string;
}

export interface SuggestedVocab {
  term: string;
  translation: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  languagePrompts?: Record<string, string[]>;
  suggestedVocab?: Record<string, SuggestedVocab[]>;
  phase1Prompts: {
    target: string[];
    suggestedVocab: SuggestedVocab[];
  };
  phase2Prompts: {
    native: string[];
    suggestedVocab: SuggestedVocab[];
  };
}

export interface Message {
  id: string;
  speaker: 'user' | 'partner' | 'system';
  speakerName?: string;
  text: string;
  translation?: string;
  correction?: string;
  reaction?: string;
  timestamp: number;
  language: string;
}

export type SessionPhase = 'phase1_target' | 'halfway_switch' | 'phase2_native' | 'summary';

export interface UserProfile {
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
  nativeLangCode: string;
  targetLangCode: string;
  speakingStreak: number;
  totalSpeakingMinutes: number;
  tandemXp: number;
  gems: number;
  streakProtected: boolean;
  dailyGoalMinutes: number;
  minutesCompletedToday: number;
}
