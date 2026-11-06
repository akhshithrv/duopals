import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  PhoneOff,
  Globe,
  Sparkles,
  ArrowRight,
  Send,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Lightbulb,
} from 'lucide-react';
import { Partner, Topic, Message, SessionPhase, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getLocalizedPrompts } from '../data/languages';
import { sounds, speakText, playAiVoiceAudio, stopSpeaking } from '../utils/sound';

interface TandemRoomProps {
  partner: Partner;
  topic: Topic;
  isFastDemo: boolean;
  soundEnabled: boolean;
  onEndCall: (stats: { minutesCompleted: number; wordsSpoken: number }) => void;
}

export const TandemRoom: React.FC<TandemRoomProps> = ({
  partner,
  topic,
  isFastDemo,
  soundEnabled,
  onEndCall,
}) => {
  // Session duration: Fast demo is 60s (30s each half), Full is 300s (150s each half)
  const totalDuration = isFastDemo ? 60 : 300;
  const halfDuration = totalDuration / 2;

  const targetLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === partner.nativeLangCode) || SUPPORTED_LANGUAGES[0];

  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalDuration);
  const [phase, setPhase] = useState<SessionPhase>('phase1_target'); // 'phase1_target' (Target) or 'phase2_native' (English)
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isMicListening, setIsMicListening] = useState<boolean>(false);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState<boolean>(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
  const [showHelperModal, setShowHelperModal] = useState<boolean>(false);
  const [helperQuery, setHelperQuery] = useState<string>('');
  const [helperResult, setHelperResult] = useState<{ translated: string; phonetic: string; tip: string } | null>(null);
  const [isHelperLoading, setIsHelperLoading] = useState<boolean>(false);
  const [showHalfwayNotification, setShowHalfwayNotification] = useState<boolean>(false);
  const [wordsSpokenCount, setWordsSpokenCount] = useState<number>(0);
  const [isPromptsExpanded, setIsPromptsExpanded] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition for active language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = phase === 'phase1_target' ? targetLangInfo.speechCode : 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            handleSendMessage(transcript);
          }
          setIsMicListening(false);
        };

        recognition.onerror = () => {
          setIsMicListening(false);
        };

        recognition.onend = () => {
          setIsMicListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopSpeaking();
    };
  }, [phase, targetLangInfo.speechCode]);

  // Initial partner greeting in their native language
  useEffect(() => {
    const greetingsByLang: Record<string, string> = {
      es: `¡Hola! Qué alegría conocerte. Soy ${partner.name.split(' ')[0]} de ${partner.location.split(',')[0]}. Me encanta hablar de "${topic.title}". ¿Cómo estás hoy?`,
      fr: `Bonjour ! Enchanté de faire votre connaissance. Je suis ${partner.name.split(' ')[0]} de ${partner.location.split(',')[0]}. Parlons de "${topic.title}". Comment allez-vous ?`,
      ja: `こんにちは！はじめまして、${partner.location.split(',')[0]}の${partner.name.split(' ')[0]}です。「${topic.title}」について楽しく話しましょう！お元気ですか？`,
      de: `Hallo! Schön dich kennenzulernen. Ich bin ${partner.name.split(' ')[0]} aus ${partner.location.split(',')[0]}. Lass uns über "${topic.title}" sprechen. Wie geht's dir?`,
      ko: `안녕하세요! 만나서 반가워요. 저는 ${partner.location.split(',')[0]}에 사는 ${partner.name.split(' ')[0]}입니다. 오늘 "${topic.title}"에 대해 이야기해봐요! 잘 지내셨나요?`,
      it: `Ciao! Piacere di conoscerti. Sono ${partner.name.split(' ')[0]} da ${partner.location.split(',')[0]}. Parliamo di "${topic.title}". Come stai oggi?`,
      pt: `Olá! Prazer em te conhecer. Sou ${partner.name.split(' ')[0]} de ${partner.location.split(',')[0]}. Vamos bater um papo sobre "${topic.title}". Tudo bem com você?`,
      zh: `你好！很高兴认识你。我是来自${partner.location.split(',')[0]}的${partner.name.split(' ')[0]}。我们今天一起来聊聊"${topic.title}"吧。你今天怎么样？`,
    };

    const initialGreeting =
      phase === 'phase1_target'
        ? greetingsByLang[partner.nativeLangCode] || greetingsByLang.es
        : `Hi! Now it's my turn to practice English with you! Can we talk about "${topic.title}"?`;

    const initialMessage: Message = {
      id: 'msg-0',
      speaker: 'partner',
      speakerName: partner.name,
      text: initialGreeting,
      translation:
        phase === 'phase1_target'
          ? `Hello! So nice to meet you. I'm ${partner.name.split(' ')[0]} from ${partner.location.split(',')[0]}. Let's talk about "${topic.title}". How are you today?`
          : `¡Hola! ¡Ahora me toca practicar inglés contigo! ¿Podemos hablar de "${topic.title}"?`,
      timestamp: Date.now(),
      language: phase === 'phase1_target' ? partner.nativeLangCode : 'en',
    };

    setMessages([initialMessage]);

    if (soundEnabled) {
      setTimeout(() => {
        // Fetch real Gemini AI Voice for the greeting
        fetch('/api/tandem/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: initialGreeting,
            voiceName: partner.voiceName || 'Kore',
            partnerLocation: partner.location,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.audioData) {
              setIsPartnerSpeaking(true);
              playAiVoiceAudio(
                data.audioData,
                () => setIsPartnerSpeaking(true),
                () => setIsPartnerSpeaking(false)
              );
              // Save audioData onto the initial message
              setMessages((prev) =>
                prev.map((m) => (m.id === 'msg-0' ? { ...m, audioData: data.audioData } : m))
              );
            } else {
              setIsPartnerSpeaking(true);
              speakText(
                initialGreeting,
                phase === 'phase1_target' ? partner.nativeLangCode : 'en',
                () => setIsPartnerSpeaking(true),
                () => setIsPartnerSpeaking(false)
              );
            }
          })
          .catch(() => {
            setIsPartnerSpeaking(true);
            speakText(
              initialGreeting,
              phase === 'phase1_target' ? partner.nativeLangCode : 'en',
              () => setIsPartnerSpeaking(true),
              () => setIsPartnerSpeaking(false)
            );
          });
      }, 500);
    }
  }, [partner]);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpire();
          return 0;
        }

        // Halfway switch point
        if (prev === halfDuration + 1 && phase === 'phase1_target') {
          triggerHalfwaySwitch();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [halfDuration, phase]);

  // Scroll transcript to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  const triggerHalfwaySwitch = () => {
    sounds.playHalfwaySwitch();
    setPhase('phase2_native');
    setShowHalfwayNotification(true);

    const switchMsg: Message = {
      id: `sys-switch-${Date.now()}`,
      speaker: 'system',
      text: `🔔 The Halfway Chime! Phase 2: Now switch to English. Help ${partner.name.split(' ')[0]} practice!`,
      timestamp: Date.now(),
      language: 'en',
    };
    setMessages((prev) => [...prev, switchMsg]);

    setTimeout(() => {
      setShowHalfwayNotification(false);
    }, 5000);
  };

  const handleTimeExpire = () => {
    sounds.playCompletionFanfare();
    const elapsedMinutes = Math.round((totalDuration - secondsRemaining) / 60) || 1;
    onEndCall({
      minutesCompleted: elapsedMinutes,
      wordsSpoken: wordsSpokenCount,
    });
  };

  const toggleMic = () => {
    sounds.playClick();
    if (isMicListening) {
      recognitionRef.current?.stop();
      setIsMicListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang =
            phase === 'phase1_target' ? targetLangInfo.speechCode : 'en-US';
          recognitionRef.current.start();
          setIsMicListening(true);
        } else {
          alert('Voice input simulated: you can also type your message in the chat bar below!');
        }
      } catch (err) {
        setIsMicListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sounds.playTurnSuccess();
    setInputText('');
    const userWords = text.split(/\s+/).length;
    setWordsSpokenCount((prev) => prev + userWords);

    const userMessageObj: Message = {
      id: `user-${Date.now()}`,
      speaker: 'user',
      speakerName: 'You',
      text,
      timestamp: Date.now(),
      language: phase === 'phase1_target' ? partner.nativeLangCode : 'en',
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setIsPartnerTyping(true);

    try {
      const response = await fetch('/api/tandem/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: partner.id,
          currentLanguage: phase === 'phase1_target' ? partner.nativeLangCode : 'en',
          sessionPhase: phase,
          topicTitle: topic.title,
          userMessage: text,
          messageHistory: messages.slice(-5).map((m) => ({
            speaker: m.speaker === 'user' ? 'User' : partner.name,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      setIsPartnerTyping(false);

      const partnerMessageObj: Message = {
        id: `partner-${Date.now()}`,
        speaker: 'partner',
        speakerName: partner.name,
        text: data.replyText,
        translation: data.translation,
        correction: data.correction,
        reaction: data.reaction,
        timestamp: Date.now(),
        language: phase === 'phase1_target' ? partner.nativeLangCode : 'en',
        audioData: data.audioData,
      };

      setMessages((prev) => [...prev, partnerMessageObj]);

      // Speak partner response using Gemini AI Voice (or Web Speech API fallback)
      if (soundEnabled) {
        setIsPartnerSpeaking(true);
        if (data.audioData) {
          playAiVoiceAudio(
            data.audioData,
            () => setIsPartnerSpeaking(true),
            () => setIsPartnerSpeaking(false)
          );
        } else {
          speakText(
            data.replyText,
            phase === 'phase1_target' ? partner.nativeLangCode : 'en',
            () => setIsPartnerSpeaking(true),
            () => setIsPartnerSpeaking(false)
          );
        }
      }
    } catch (err) {
      setIsPartnerTyping(false);
      console.error('Failed to get partner response:', err);
    }
  };

  const handleHelpMeSay = async () => {
    if (!helperQuery.trim()) return;
    setIsHelperLoading(true);
    try {
      const res = await fetch('/api/tandem/help-say', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phrase: helperQuery,
          targetLang: phase === 'phase1_target' ? partner.nativeLangCode : 'en',
        }),
      });
      const data = await res.json();
      setHelperResult(data);
    } catch {
      setHelperResult({
        translated: `How do you say "${helperQuery}" in ${targetLangInfo.name}?`,
        phonetic: helperQuery,
        tip: 'Ask your partner for natural regional phrasing!',
      });
    } finally {
      setIsHelperLoading(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Localized prompts for this topic and language
  const localizedData = getLocalizedPrompts(topic.id, partner.nativeLangCode);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Split Session Progress Header */}
      <section className="duo-card p-4 sm:p-5 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-800 border border-slate-200 text-lg">
              {phase === 'phase1_target' ? targetLangInfo.flag : '🇺🇸'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Current Speaking Phase
                </span>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    phase === 'phase1_target'
                      ? 'bg-emerald-100 text-[#58cc02]'
                      : 'bg-blue-100 text-[#1cb0f6]'
                  }`}
                >
                  {phase === 'phase1_target'
                    ? `${targetLangInfo.name} Practice (You)`
                    : 'English Practice (Partner)'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>{topic.title}</span>
                <span className="text-xs font-semibold text-slate-400">with {partner.name}</span>
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
              <span className="text-sm font-bold text-slate-500">Remaining:</span>
              <span className="text-xl font-black text-slate-900 tabular-nums">
                {formatTimer(secondsRemaining)}
              </span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                handleTimeExpire();
              }}
              className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Finish call and view results"
            >
              <PhoneOff className="w-4 h-4" />
              <span className="hidden sm:inline">Finish Call</span>
            </button>
          </div>
        </div>

        {/* 50/50 Split Visual Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
            <span
              className={phase === 'phase1_target' ? 'text-[#58cc02] font-black' : 'text-slate-400'}
            >
              {targetLangInfo.flag} Phase 1: {targetLangInfo.name} (Your Practice)
            </span>
            <span
              className={phase === 'phase2_native' ? 'text-[#1cb0f6] font-black' : 'text-slate-400'}
            >
              🇺🇸 Phase 2: English ({partner.name.split(' ')[0]}'s Practice)
            </span>
          </div>

          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
            {/* Half 1 */}
            <div
              className={`h-full rounded-l-full transition-all duration-300 ${
                phase === 'phase1_target' ? 'bg-[#58cc02]' : 'bg-emerald-200 opacity-60'
              }`}
              style={{
                width: `${Math.min(50, ((totalDuration - secondsRemaining) / totalDuration) * 100)}%`,
              }}
            ></div>
            {/* Half 2 */}
            <div
              className={`h-full rounded-r-full transition-all duration-300 ${
                phase === 'phase2_native' ? 'bg-[#1cb0f6]' : 'bg-transparent'
              }`}
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    50,
                    (((totalDuration - secondsRemaining) - halfDuration) / halfDuration) * 50
                  )
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Halfway Chime Notification Toast */}
      {showHalfwayNotification && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              🔔
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Language Switch Time! (Phase 2 Active)
              </h3>
              <p className="text-xs text-blue-100">
                Great job practicing {targetLangInfo.name}! Now switch to English to help {partner.name.split(' ')[0]} practice.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHalfwayNotification(false)}
            className="text-xs bg-white text-blue-700 font-extrabold px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
          >
            Got it!
          </button>
        </div>
      )}

      {/* Main Conversation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Video/Avatar Tiles & Audio Meters */}
        <div className="lg:col-span-5 space-y-4">
          {/* Partner Avatar Tile */}
          <div className="duo-card p-5 bg-white relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-extrabold text-slate-700">{partner.name}</span>
                <span className="text-[11px] text-slate-400 font-medium">({partner.location})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>AI Voice: {partner.voiceName || 'Kore'}</span>
                </span>
                {isPartnerSpeaking && (
                  <div className="flex items-center gap-1 text-[11px] font-black text-[#58cc02] bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Speaking...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex justify-center py-2">
              <div
                className={`relative rounded-3xl p-1 transition-all ${
                  isPartnerSpeaking ? 'ring-4 ring-[#58cc02] ring-offset-2 scale-102' : ''
                }`}
              >
                <img
                  src={partner.avatarUrl}
                  alt={partner.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
                {isPartnerSpeaking && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#58cc02] text-white text-[11px] font-black px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <span className="w-1 h-3 bg-white rounded-full animate-pulse"></span>
                    <span className="w-1 h-4 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="w-1 h-3.5 bg-white rounded-full animate-bounce"></span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-xs text-slate-500 font-medium">
                {phase === 'phase1_target'
                  ? `Teaching mode: Listening to your ${targetLangInfo.name} with warm support`
                  : `Student mode: Eagerly practicing English with you!`}
              </p>
            </div>
          </div>

          {/* User Video / Mic Status Tile */}
          <div className="duo-card p-4 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base ${
                  isMicListening ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                }`}
              >
                {isMicListening ? <Mic className="w-6 h-6" /> : 'YOU'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">Your Microphone</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isMicListening
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isMicListening ? 'Listening Live' : 'Push to Speak'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Words spoken this session: <span className="font-bold text-slate-800">{wordsSpokenCount}</span>
                </p>
              </div>
            </div>

            <button
              onClick={toggleMic}
              className={`p-3 rounded-2xl transition-all font-bold cursor-pointer shadow-xs ${
                isMicListening
                  ? 'bg-rose-500 text-white hover:bg-rose-600 ring-2 ring-rose-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={isMicListening ? 'Stop listening' : 'Start microphone'}
            >
              {isMicListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-slate-400" />}
            </button>
          </div>

          {/* Guided Topic & Vocab Cue Card */}
          <div className="duo-card p-4 bg-amber-50/60 border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Live Conversation Cue Card ({targetLangInfo.name})</span>
              </div>
              <button
                onClick={() => setIsPromptsExpanded(!isPromptsExpanded)}
                className="text-amber-700 hover:text-amber-900 p-1 rounded-lg cursor-pointer"
              >
                {isPromptsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isPromptsExpanded && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-amber-900 block mb-1">
                    Try asking or sharing:
                  </span>
                  <div className="space-y-1.5">
                    {localizedData.prompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sounds.playClick();
                          setInputText(prompt);
                        }}
                        className="text-left w-full p-2 rounded-xl bg-white border border-amber-200 text-slate-700 hover:border-amber-400 font-medium transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="italic font-semibold">"{prompt}"</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-amber-900 block mb-1">
                    Helpful Vocabulary Bank:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {localizedData.vocab.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          sounds.playClick();
                          speakText(v.term, partner.nativeLangCode);
                        }}
                        className="bg-white px-2 py-1 rounded-lg border border-amber-200 text-slate-700 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer font-medium text-[11px]"
                        title={`Click to hear pronunciation (${v.translation})`}
                      >
                        <Volume2 className="w-3 h-3 text-amber-600" />
                        <span className="font-bold">{v.term}</span>
                        <span className="text-slate-400">· {v.translation}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Real-Time Conversation Stream & Input Dock */}
        <div className="lg:col-span-7 duo-card p-5 bg-white flex flex-col h-[620px] shadow-xs">
          {/* Transcript Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#58cc02]" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Live Tandem Dialogue ({targetLangInfo.flag} ⇄ 🇺🇸)
              </h3>
            </div>

            {/* Help Me Say Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowHelperModal(!showHelperModal);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Help Me Say in {targetLangInfo.name}</span>
            </button>
          </div>

          {/* Quick Helper Drawer */}
          {showHelperModal && (
            <div className="my-3 p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-900">
                  Instant Assistant for {targetLangInfo.name}
                </span>
                <button
                  onClick={() => setShowHelperModal(false)}
                  className="text-xs text-purple-500 hover:text-purple-700 font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g. How do I say "I would like to order a fresh coffee" in ${targetLangInfo.name}?`}
                  value={helperQuery}
                  onChange={(e) => setHelperQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHelpMeSay()}
                  className="w-full text-xs bg-white border border-purple-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleHelpMeSay}
                  disabled={isHelperLoading}
                  className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-black shrink-0 hover:bg-purple-700 cursor-pointer"
                >
                  {isHelperLoading ? '...' : 'Ask Duo'}
                </button>
              </div>

              {helperResult && (
                <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-900 text-sm">
                      {helperResult.translated}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setInputText(helperResult.translated);
                        setShowHelperModal(false);
                      }}
                      className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Use this
                    </button>
                  </div>
                  <div className="text-slate-500 italic text-[11px]">
                    Pronunciation: {helperResult.phonetic}
                  </div>
                  <div className="text-slate-600 font-medium text-[11px]">
                    Tip: {helperResult.tip}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transcript Scroll Area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
            {messages.map((msg) => {
              if (msg.speaker === 'system') {
                return (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold text-center animate-fade-in"
                  >
                    {msg.text}
                  </div>
                );
              }

              const isUser = msg.speaker === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold text-slate-400">
                    <span>{msg.speakerName}</span>
                    <span>·</span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-xs ${
                      isUser
                        ? 'bg-[#58cc02] text-white font-semibold rounded-br-none'
                        : 'bg-slate-100 text-slate-900 font-medium rounded-bl-none border border-slate-200'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>

                    {!isUser && msg.translation && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600 font-normal italic flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{msg.translation}</span>
                      </div>
                    )}
                  </div>

                  {msg.correction && (
                    <div className="mt-1.5 max-w-[85%] p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Gentle Tandem Tip: </span>
                        <span>{msg.correction}</span>
                      </div>
                    </div>
                  )}

                  {!isUser && (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        if (msg.audioData) {
                          playAiVoiceAudio(
                            msg.audioData,
                            () => setIsPartnerSpeaking(true),
                            () => setIsPartnerSpeaking(false)
                          );
                        } else {
                          // Fetch Gemini TTS on demand
                          fetch('/api/tandem/tts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              text: msg.text,
                              voiceName: partner.voiceName || 'Kore',
                              partnerLocation: partner.location,
                            }),
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data.audioData) {
                                playAiVoiceAudio(
                                  data.audioData,
                                  () => setIsPartnerSpeaking(true),
                                  () => setIsPartnerSpeaking(false)
                                );
                              } else {
                                speakText(msg.text, msg.language);
                              }
                            })
                            .catch(() => speakText(msg.text, msg.language));
                        }
                      }}
                      className="mt-1 text-[11px] font-bold text-slate-400 hover:text-purple-600 flex items-center gap-1.5 px-1 transition-colors cursor-pointer"
                      title="Hear AI voice replay"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                      <span>Hear AI Voice</span>
                    </button>
                  )}
                </div>
              );
            })}

            {isPartnerTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-50 rounded-xl w-fit">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                <span className="font-bold">{partner.name} is speaking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Phrase Chips for Target Language */}
          <div className="pt-2 pb-2 flex gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {(phase === 'phase1_target'
              ? targetLangInfo.samplePhrases
              : [
                  'Hello!',
                  'That sounds great!',
                  'In English, we say...',
                  'Could you repeat that?',
                  'What do you mean by that?',
                ]
            ).map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  setInputText(chip);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-2 flex items-center gap-2 border-t border-slate-100"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-2xl transition-all font-bold cursor-pointer shrink-0 ${
                isMicListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Voice recording"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={
                phase === 'phase1_target'
                  ? `Type in ${targetLangInfo.name} or speak...`
                  : 'Type in English or speak...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:bg-white focus:border-[#58cc02] transition-all font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="duo-btn-green p-3 rounded-2xl text-white font-black shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
