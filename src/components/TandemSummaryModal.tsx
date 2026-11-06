import React, { useState } from 'react';
import { Sparkles, Flame, CheckCircle, ThumbsUp, UserPlus, ArrowRight, Share2 } from 'lucide-react';
import { Partner, UserProfile } from '../types';
import { sounds } from '../utils/sound';

interface TandemSummaryModalProps {
  partner: Partner;
  minutesCompleted: number;
  wordsSpoken: number;
  user: UserProfile;
  onClose: () => void;
}

export const TandemSummaryModal: React.FC<TandemSummaryModalProps> = ({
  partner,
  minutesCompleted,
  wordsSpoken,
  user,
  onClose,
}) => {
  const [kudosSent, setKudosSent] = useState(false);
  const [friendAdded, setFriendAdded] = useState(false);

  const handleSendKudos = () => {
    sounds.playTurnSuccess();
    setKudosSent(true);
  };

  const handleAddFriend = () => {
    sounds.playClick();
    setFriendAdded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-slate-100 text-center space-y-6 animate-scale-up">
        {/* Duo Mascot Celebration */}
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32">
          <img
            src="/src/assets/images/duo_mascot_tandem_1793929193834.jpg"
            alt="Duo Celebrating"
            className="w-full h-full object-cover rounded-3xl shadow-lg border-2 border-emerald-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-2xl shadow-md border-2 border-white">
            <Flame className="w-5 h-5 fill-white" />
          </div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#58cc02] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Tandem Session Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            ¡Excelente Conversación!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            You and {partner.name.split(' ')[0]} just completed a balanced 50/50 language exchange.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="flex justify-center mb-1">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-xl font-black text-amber-800 tabular-nums">+35</div>
            <div className="text-[11px] font-bold text-amber-600 uppercase">Tandem XP</div>
          </div>

          <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200">
            <div className="flex justify-center mb-1">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </div>
            <div className="text-xl font-black text-orange-800 tabular-nums">
              {user.speakingStreak + 1}
            </div>
            <div className="text-[11px] font-bold text-orange-600 uppercase">Day Streak</div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex justify-center mb-1">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-800 tabular-nums">
              {wordsSpoken || 32}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 uppercase">Words Spoken</div>
          </div>
        </div>

        {/* Reciprocal Impact Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Exchange Breakdown</span>
            <span className="text-[#58cc02] font-black">50% ES · 50% EN</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#58cc02]"></span>
              <span>You practiced spoken Spanish for {minutesCompleted} min</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1cb0f6]"></span>
              <span>You helped {partner.name.split(' ')[0]} practice spoken English</span>
            </div>
          </div>
        </div>

        {/* Kudos & Social Connection */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            onClick={handleSendKudos}
            disabled={kudosSent}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              kudosSent
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>{kudosSent ? 'High Five Sent!' : 'Send High Five Kudos'}</span>
          </button>

          <button
            onClick={handleAddFriend}
            disabled={friendAdded}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              friendAdded
                ? 'bg-blue-100 text-blue-800 border-blue-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>{friendAdded ? 'Added to Tandem Friends' : `Add ${partner.name.split(' ')[0]}`}</span>
          </button>
        </div>

        {/* Primary Action Button */}
        <div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full duo-btn-green py-3 px-6 rounded-2xl font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Daily Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
