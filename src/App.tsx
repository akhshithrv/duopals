/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LobbyView } from './components/LobbyView';
import { TandemRoom } from './components/TandemRoom';
import { TandemSummaryModal } from './components/TandemSummaryModal';
import { TandemFriendsView } from './components/TandemFriendsView';
import { Partner, Topic, UserProfile, SupportedLanguage } from './types';
import { ALL_PARTNERS, SUPPORTED_LANGUAGES } from './data/languages';

const DEFAULT_TOPICS: Topic[] = [
  {
    id: 'cafe-culture',
    title: 'Café Culture & Weekend Rituals',
    category: 'Daily Life',
    icon: 'coffee',
    description: 'Talk about your favorite morning drink, neighborhood cafes, and how you spend Saturday mornings.',
    phase1Prompts: {
      target: [
        '¿Cómo tomas el café por la mañana?',
        '¿Qué sueles hacer los sábados para relajarte?',
        '¿Tienes una cafetería favorita en tu ciudad?',
      ],
      suggestedVocab: [
        { term: 'café con leche', translation: 'coffee with milk' },
        { term: 'desayuno típico', translation: 'typical breakfast' },
      ],
    },
    phase2Prompts: {
      native: [
        'What is a traditional breakfast where you live?',
        'Do you prefer making coffee at home or going out to a cafe?',
      ],
      suggestedVocab: [
        { term: 'morning routine', translation: 'daily morning rhythm' },
      ],
    },
  },
  {
    id: 'travel-stories',
    title: 'Travel Disasters & Hidden Gems',
    category: 'Travel',
    icon: 'map-pin',
    description: 'Share a memorable journey, getting lost in a new city, or an unexpected place you fell in love with.',
    phase1Prompts: {
      target: [
        '¿Cuál es el lugar más bonito que has visitado?',
        '¿Alguna vez te has perdido en un viaje?',
      ],
      suggestedVocab: [
        { term: 'paisaje increíble', translation: 'incredible scenery' },
      ],
    },
    phase2Prompts: {
      native: [
        'What was the best trip you ever took?',
        'Have you ever had a travel mishap like a missed flight?',
      ],
      suggestedVocab: [
        { term: 'hidden gem', translation: 'secret spot' },
      ],
    },
  },
  {
    id: 'food-and-cooking',
    title: 'Street Food & Comfort Dishes',
    category: 'Culture',
    icon: 'utensils',
    description: 'Exchange local culinary secrets, family recipes, and dishes you could eat every single day.',
    phase1Prompts: {
      target: [
        '¿Cuál es tu comida favorita de tu país?',
        '¿Te gusta cocinar en casa o pedir comida?',
      ],
      suggestedVocab: [
        { term: 'ingredientes frescos', translation: 'fresh ingredients' },
      ],
    },
    phase2Prompts: {
      native: [
        'What dish does your family always cook for celebrations?',
        'Is there a local food in your city that visitors must try?',
      ],
      suggestedVocab: [
        { term: 'comfort food', translation: 'cozy meal' },
      ],
    },
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<'lobby' | 'room' | 'history'>('lobby');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active target language being learned
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    SUPPORTED_LANGUAGES[0] // Spanish default
  );

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Rivera',
    nativeLanguage: 'English 🇺🇸',
    targetLanguage: `${selectedLanguage.name} ${selectedLanguage.flag}`,
    nativeLangCode: 'en',
    targetLangCode: selectedLanguage.code,
    speakingStreak: 7,
    totalSpeakingMinutes: 25,
    tandemXp: 1240,
    gems: 480,
    streakProtected: true,
    dailyGoalMinutes: 5,
    minutesCompletedToday: 0,
  });

  const [partners, setPartners] = useState<Partner[]>(ALL_PARTNERS);
  const [topics] = useState<Topic[]>(DEFAULT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(DEFAULT_TOPICS[0]);
  const [activePartner, setActivePartner] = useState<Partner>(ALL_PARTNERS[0]);
  const [isFastDemo, setIsFastDemo] = useState(true);

  // Summary Modal State
  const [showSummary, setShowSummary] = useState(false);
  const [lastSessionStats, setLastSessionStats] = useState<{
    minutesCompleted: number;
    wordsSpoken: number;
  }>({
    minutesCompleted: 5,
    wordsSpoken: 35,
  });

  // When language changes, update user target language
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setUser((prev) => ({
      ...prev,
      targetLanguage: `${lang.name} ${lang.flag}`,
      targetLangCode: lang.code,
    }));
  };

  const handleStartCall = (partner: Partner, fastDemo: boolean) => {
    setActivePartner(partner);
    setIsFastDemo(fastDemo);
    setActiveView('room');
  };

  const handleEndCall = (stats: { minutesCompleted: number; wordsSpoken: number }) => {
    setLastSessionStats(stats);
    setUser((prev) => ({
      ...prev,
      speakingStreak: prev.speakingStreak + 1,
      totalSpeakingMinutes: prev.totalSpeakingMinutes + stats.minutesCompleted,
      tandemXp: prev.tandemXp + 35,
      minutesCompletedToday: Math.min(
        prev.dailyGoalMinutes,
        prev.minutesCompletedToday + stats.minutesCompleted
      ),
    }));
    setShowSummary(true);
    setActiveView('lobby');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#4b4b4b] flex flex-col font-sans">
      <Navbar
        user={user}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      <main className="flex-1 pb-16">
        {activeView === 'lobby' && (
          <LobbyView
            user={user}
            partners={partners}
            topics={topics}
            selectedTopic={selectedTopic}
            onSelectTopic={(topic) => setSelectedTopic(topic)}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            onStartCall={handleStartCall}
          />
        )}

        {activeView === 'room' && (
          <TandemRoom
            partner={activePartner}
            topic={selectedTopic}
            isFastDemo={isFastDemo}
            soundEnabled={soundEnabled}
            onEndCall={handleEndCall}
          />
        )}

        {activeView === 'history' && (
          <TandemFriendsView
            user={user}
            partners={partners}
            onStartCallWithPartner={(partner) => handleStartCall(partner, true)}
            onBackToLobby={() => setActiveView('lobby')}
          />
        )}
      </main>

      {/* Completion & Streak Reward Modal */}
      {showSummary && (
        <TandemSummaryModal
          partner={activePartner}
          minutesCompleted={lastSessionStats.minutesCompleted}
          wordsSpoken={lastSessionStats.wordsSpoken}
          user={user}
          onClose={() => setShowSummary(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#58cc02]">Duolingo Tandem</span>
            <span>·</span>
            <span>All Languages Reciprocal Spoken Exchange</span>
          </div>
          <div className="text-slate-400">
            Spanish · French · Japanese · German · Korean · Italian · Portuguese · Mandarin
          </div>
        </div>
      </footer>
    </div>
  );
}
