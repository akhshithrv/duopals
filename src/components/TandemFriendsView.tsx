import React from 'react';
import {
  Flame,
  Sparkles,
  Clock,
  Award,
  Calendar,
  MessageCircle,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { Partner, UserProfile } from '../types';
import { sounds } from '../utils/sound';

interface TandemFriendsViewProps {
  user: UserProfile;
  partners: Partner[];
  onStartCallWithPartner: (partner: Partner) => void;
  onBackToLobby: () => void;
}

export const TandemFriendsView: React.FC<TandemFriendsViewProps> = ({
  user,
  partners,
  onStartCallWithPartner,
  onBackToLobby,
}) => {
  const milestones = [
    { title: 'First Tandem Exchange', desc: 'Complete 1 split conversation', completed: true },
    { title: '3-Day Speaking Streak', desc: 'Hold consecutive daily chats', completed: true },
    { title: 'Café & Tapas Master', desc: 'Discuss culinary traditions fluently', completed: true },
    { title: 'Tandem Mentor Badge', desc: 'Help 5 partners practice English', completed: false },
    { title: '30-Minute Conversationalist', desc: 'Accumulate 30 live speaking minutes', completed: false },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Stats Banner */}
      <section className="duo-card p-6 sm:p-8 bg-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#58cc02] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Your Spoken Fluency Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Conversational Milestones & Tandem Circle
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Practicing 5 minutes every day rewires your brain for spontaneous fluency.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onBackToLobby();
            }}
            className="duo-btn-green px-5 py-2.5 rounded-xl font-black text-sm shrink-0 cursor-pointer"
          >
            Practice Now
          </button>
        </div>

        {/* 4-Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Flame className="w-5 h-5 fill-orange-500" />
              <span className="text-xs font-extrabold uppercase">Daily Streak</span>
            </div>
            <div className="text-2xl font-black text-orange-900 tabular-nums">
              {user.speakingStreak} Days
            </div>
            <div className="text-[11px] font-bold text-orange-600 mt-0.5">
              Streak shield active 🛡️
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase">Total Tandem XP</span>
            </div>
            <div className="text-2xl font-black text-amber-900 tabular-nums">
              {user.tandemXp} XP
            </div>
            <div className="text-[11px] font-bold text-amber-600 mt-0.5">
              +35 XP per conversation
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase">Speaking Time</span>
            </div>
            <div className="text-2xl font-black text-emerald-900 tabular-nums">
              {user.totalSpeakingMinutes} Mins
            </div>
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
              Equal English / Spanish split
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase">CEFR Progress</span>
            </div>
            <div className="text-2xl font-black text-blue-900 tabular-nums">
              B1 Level
            </div>
            <div className="text-[11px] font-bold text-blue-600 mt-0.5">
              Target: B2 Conversational
            </div>
          </div>
        </div>
      </section>

      {/* Connected Tandem Friends List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Your Regular Tandem Partners</h2>
            <p className="text-xs text-slate-500 font-medium">
              Native speakers you have practiced with
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div key={partner.id} className="duo-card p-5 bg-white space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={partner.avatarUrl}
                    alt={partner.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{partner.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{partner.location}</p>
                    <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 w-fit">
                      {partner.nativeLanguage} ⇄ {partner.learningLanguage}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{partner.bio}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Accent:</span>
                    <span className="font-bold text-slate-800">{partner.accentNote.split('(')[0]}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Partner Streak:</span>
                    <span className="font-bold text-orange-600">🔥 {partner.streak} Days</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onStartCallWithPartner(partner);
                  }}
                  className="w-full duo-btn-blue py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Call {partner.name.split(' ')[0]} Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fluency Milestones Roadmap */}
      <section className="duo-card p-6 bg-white space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Conversational Passport Milestones</h2>
          <p className="text-xs text-slate-500 font-medium">
            Unlock new badges as your real-time speaking confidence builds
          </p>
        </div>

        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${
                m.completed
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/50 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    m.completed ? 'bg-[#58cc02] text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {m.completed ? <CheckCircle2 className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{m.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{m.desc}</p>
                </div>
              </div>

              <span
                className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  m.completed ? 'bg-emerald-100 text-[#58cc02]' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {m.completed ? 'Unlocked' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
