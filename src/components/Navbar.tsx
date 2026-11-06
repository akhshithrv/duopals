import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, ChevronDown, Check, Globe } from 'lucide-react';
import { UserProfile, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { sounds } from '../utils/sound';

interface NavbarProps {
  user: UserProfile;
  activeView: 'lobby' | 'room' | 'history';
  onNavigate: (view: 'lobby' | 'history') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  onNavigate,
  soundEnabled,
  onToggleSound,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('lobby');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#58cc02] border-b-4 border-[#58a700] flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:bg-[#61e002] transition-colors">
              DT
            </div>
            <div>
              <span className="text-xl font-extrabold text-[#58cc02] tracking-tight block leading-tight">
                duolingo <span className="text-[#1cb0f6]">tandem</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                All Languages Exchange
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('lobby');
            }}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
              activeView === 'lobby'
                ? 'text-[#58cc02] border-[#58cc02]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Practice Lobby
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('history');
            }}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 cursor-pointer ${
              activeView === 'history'
                ? 'text-[#1cb0f6] border-[#1cb0f6]'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            My Tandem Friends & Stats
          </button>
        </nav>

        {/* Zone 3: Language Selector & Gamification Stats */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Multi-Language Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                sounds.playClick();
                setIsLangMenuOpen(!isLangMenuOpen);
              }}
              className="flex items-center gap-2 text-xs font-black text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Change your target learning language"
            >
              <Globe className="w-4 h-4 text-[#1cb0f6]" />
              <span>
                🇺🇸 ⇄ {selectedLanguage.flag} {selectedLanguage.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-2 z-50 animate-scale-up">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2 py-1">
                  Choose Learning Language
                </div>
                <div className="space-y-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === selectedLanguage.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          sounds.playClick();
                          onSelectLanguage(lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-[#58cc02]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <div className="text-left">
                            <span className="block leading-tight">{lang.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {lang.nativeName}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#58cc02]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Speaking Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 font-extrabold text-sm shadow-xs">
            <span className="text-base" role="img" aria-label="flame">
              🔥
            </span>
            <span className="tabular-nums">{user.speakingStreak}</span>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-tight hidden sm:inline">
              Streak
            </span>
          </div>

          {/* Tandem XP */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="tabular-nums">{user.tandemXp}</span>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-tight">
              XP
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-[#58cc02]" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
