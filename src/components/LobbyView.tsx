import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  Radio,
  BookOpen,
  Coffee,
  MapPin,
  Utensils,
  PlayCircle,
  Globe2,
} from 'lucide-react';
import { Partner, Topic, UserProfile, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getLocalizedPrompts } from '../data/languages';
import { sounds } from '../utils/sound';

interface LobbyViewProps {
  user: UserProfile;
  partners: Partner[];
  topics: Topic[];
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onStartCall: (partner: Partner, isDemoDuration: boolean) => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  user,
  partners,
  topics,
  selectedTopic,
  onSelectTopic,
  selectedLanguage,
  onSelectLanguage,
  onStartCall,
}) => {
  const [isMatching, setIsMatching] = useState(false);
  const [isFastDemo, setIsFastDemo] = useState(true);
  const [partnerFilter, setPartnerFilter] = useState<string>('all'); // 'all' or lang code

  // Filter partners based on language tab or active language
  const displayedPartners = partners.filter((p) => {
    if (partnerFilter === 'all') return true;
    return p.nativeLangCode === partnerFilter;
  });

  const handleQuickMatch = () => {
    sounds.playClick();
    setIsMatching(true);
    // Prioritize partners matching current selected language
    const candidatePartners = partners.filter(
      (p) => p.nativeLangCode === selectedLanguage.code
    );
    const pool = candidatePartners.length > 0 ? candidatePartners : partners;

    setTimeout(() => {
      setIsMatching(false);
      const randomPartner = pool[Math.floor(Math.random() * pool.length)];
      onStartCall(randomPartner, isFastDemo);
    }, 1200);
  };

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'coffee':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'map-pin':
        return <MapPin className="w-5 h-5 text-emerald-600" />;
      case 'utensils':
        return <Utensils className="w-5 h-5 text-orange-600" />;
      default:
        return <Compass className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner: Playful Duolingo Visual Presentation */}
      <section className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-12">
          <div className="w-80 h-80 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full w-fit backdrop-blur-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse text-lime-300" />
              <span>Real-Time Exchange · All Languages</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Real speaking practice. <br />
              <span className="text-lime-300">
                In {selectedLanguage.name} {selectedLanguage.flag} & Beyond.
              </span>
            </h1>

            <p className="text-emerald-50 text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              Match with a native speaker of your target language who is learning English. 5 minutes total:
              2.5 minutes in their language, 2.5 minutes in English. Equal practice, zero anxiety.
            </p>

            {/* Quick Match Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleQuickMatch}
                disabled={isMatching}
                className="duo-btn-orange px-6 py-3.5 rounded-2xl text-base font-black shadow-md flex items-center gap-3 cursor-pointer"
              >
                {isMatching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Finding a {selectedLanguage.name} partner...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Quick Match in {selectedLanguage.name}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Demo Mode Toggle */}
              <div className="bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/20 text-xs font-bold">
                <Clock className="w-4 h-4 text-lime-300" />
                <span>Session Duration:</span>
                <button
                  type="button"
                  onClick={() => setIsFastDemo(!isFastDemo)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    isFastDemo
                      ? 'bg-lime-400 text-slate-900 font-black'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {isFastDemo ? '⚡ 60s Fast Demo' : '⏱️ 5 min Full'}
                </button>
              </div>
            </div>
          </div>

          {/* Duo Mascot Graphic */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-white/10 p-2 shadow-xl border-4 border-white/20">
                <img
                  src="/src/assets/images/duo_mascot_tandem_1793929193834.jpg"
                  alt="Duo with Headset"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white text-slate-900 px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-extrabold flex items-center gap-1.5">
                <span>{selectedLanguage.flag} ⇄ 🇺🇸</span>
                <span className="text-[#58cc02]">{selectedLanguage.name} Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selection Quick Strip */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#58cc02]" />
            <h2 className="text-base font-extrabold text-slate-900">Explore Languages for Tandem</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">8 Supported Languages</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  sounds.playClick();
                  onSelectLanguage(lang);
                  setPartnerFilter(lang.code);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 text-xs font-black transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'border-[#58cc02] bg-emerald-50 text-[#58cc02] shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                  ({lang.greeting})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Daily Quest Strip */}
      <section className="duo-card p-5 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">Today's Daily Speaking Quest</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                +35 XP Reward
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Complete 1 Tandem exchange in {selectedLanguage.name} {selectedLanguage.flag} to keep your {user.speakingStreak}-day streak alive!
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Daily Goal</span>
            <span className="tabular-nums">
              {user.minutesCompletedToday} / {user.dailyGoalMinutes} min
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (user.minutesCompletedToday / user.dailyGoalMinutes) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Topic Selector with Localized Previews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Choose Today's Topic</h2>
            <p className="text-xs text-slate-500 font-medium">
              Guided cues and vocabulary adapt automatically into {selectedLanguage.name} {selectedLanguage.flag}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            const localized = getLocalizedPrompts(topic.id, selectedLanguage.code);

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onSelectTopic(topic);
                }}
                className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#58cc02] bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-slate-100">{getTopicIcon(topic.icon)}</div>
                  {isSelected && (
                    <span className="text-xs font-black text-[#58cc02] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Active Topic
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{topic.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Sample cue in target language */}
                {localized.prompts[0] && (
                  <div className="mt-2.5 p-2 rounded-xl bg-white border border-slate-100 text-[11px] text-slate-600 font-medium italic">
                    "{localized.prompts[0]}"
                  </div>
                )}

                <div className="mt-3 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{localized.vocab.length} {selectedLanguage.name} phrases included</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Online Native Partners Grid with Language Filter */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Active Native Partners ({displayedPartners.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Fluent native speakers paired for reciprocal English exchange
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => {
                sounds.playClick();
                setPartnerFilter('all');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                partnerFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  sounds.playClick();
                  setPartnerFilter(l.code);
                  onSelectLanguage(l);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  partnerFilter === l.code
                    ? 'bg-[#58cc02] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedPartners.map((partner) => (
            <div
              key={partner.id}
              className="duo-card p-5 border-2 border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={partner.avatarUrl}
                    alt={partner.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 text-base">{partner.name}</h3>
                      <span className="text-xs text-slate-400 font-bold">· {partner.age}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500">{partner.location}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                      <span>Native: {partner.nativeLanguage}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{partner.bio}</p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Interests
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {partner.interests.map((interest) => (
                      <span
                        key={interest}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
                  <span>Accent: {partner.accentNote.split('(')[0]}</span>
                  <span className="text-orange-600 font-bold">🔥 {partner.streak} streak</span>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onStartCall(partner, isFastDemo);
                  }}
                  className="w-full duo-btn-green py-2.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Call {partner.name.split(' ')[0]} Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
