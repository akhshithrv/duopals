import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Multi-Language Tandem Partners Catalog with Prebuilt AI Voices
const TANDEM_PARTNERS = [
  // Spanish
  {
    id: 'sofia',
    name: 'Sofía Ramos',
    age: 24,
    location: 'Madrid, Spain',
    nativeLanguage: 'Spanish 🇪🇸',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'es',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_sofia_1793929193326.jpg',
    bio: 'Architecture student in Madrid. Love indie music, visiting tapas bars, and practicing conversational English for my exchange semester!',
    interests: ['Architecture', 'Tapas & Cooking', 'Indie Rock', 'Travel'],
    speakingSpeed: 'Medium',
    accentNote: 'Peninsular Spanish (Spain)',
    streak: 42,
    onlineStatus: 'Active Now',
    voiceName: 'Kore',
  },
  {
    id: 'mateo',
    name: 'Mateo Silva',
    age: 27,
    location: 'Mexico City, Mexico',
    nativeLanguage: 'Spanish 🇲🇽',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'es',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Advanced (B2)',
    avatarUrl: '/src/assets/images/partner_mateo_1793929193878.jpg',
    bio: 'Product designer and specialty coffee enthusiast in Condesa. Looking to practice fluid English for design podcasts and tech collabs.',
    interests: ['Coffee brewing', 'UI Design', 'Cycling', 'Street Tacos'],
    speakingSpeed: 'Relaxed',
    accentNote: 'Mexican Spanish (Central)',
    streak: 78,
    onlineStatus: 'Active Now',
    voiceName: 'Puck',
  },
  {
    id: 'elena',
    name: 'Elena Álvarez',
    age: 26,
    location: 'Buenos Aires, Argentina',
    nativeLanguage: 'Spanish 🇦🇷',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'es',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_elena_1793929193834.jpg',
    bio: 'Freelance cultural journalist and tango lover. Want to get comfortable speaking natural English idioms without overthinking!',
    interests: ['Literature', 'Cinema', 'Tango', 'Hiking in Patagonia'],
    speakingSpeed: 'Lively',
    accentNote: 'Rioplatense Spanish (Argentina)',
    streak: 31,
    onlineStatus: 'Active Now',
    voiceName: 'Kore',
  },

  // French
  {
    id: 'camille',
    name: 'Camille Laurent',
    age: 25,
    location: 'Paris, France',
    nativeLanguage: 'French 🇫🇷',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'fr',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_camille_1793929609896.jpg',
    bio: 'Art gallery assistant in Le Marais. Passionate about French cinema, pastry baking, and becoming effortless in everyday spoken English!',
    interests: ['Modern Art', 'Boulangeries', 'Cinematography', 'Vintage Fashion'],
    speakingSpeed: 'Smooth',
    accentNote: 'Parisian French',
    streak: 64,
    onlineStatus: 'Active Now',
    voiceName: 'Zephyr',
  },
  {
    id: 'lucas-fr',
    name: 'Lucas Moreau',
    age: 28,
    location: 'Lyon, France',
    nativeLanguage: 'French 🇫🇷',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'fr',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Upper-Intermediate (B2)',
    avatarUrl: '/src/assets/images/partner_camille_1793929609896.jpg',
    bio: 'Gastronomy tour guide and wine merchant. Eager to help English speakers discover French cuisine while refining my English tech terms.',
    interests: ['Wine Tasting', 'Gastronomy', 'Kayaking', 'European History'],
    speakingSpeed: 'Relaxed',
    accentNote: 'Standard French',
    streak: 53,
    onlineStatus: 'Active Now',
    voiceName: 'Charon',
  },

  // Japanese
  {
    id: 'kenji',
    name: 'Kenji Sato',
    age: 26,
    location: 'Tokyo, Japan',
    nativeLanguage: 'Japanese 🇯🇵',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'ja',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_kenji_1793929609889.jpg',
    bio: 'Front-end software developer in Shibuya. Love ramen hopping, anime background art, and practicing conversational English for global projects.',
    interests: ['Coding', 'Ramen Culture', 'Anime & Manga', 'Synthesizers'],
    speakingSpeed: 'Patient & Clear',
    accentNote: 'Standard Tokyo Japanese (Kanto)',
    streak: 92,
    onlineStatus: 'Active Now',
    voiceName: 'Fenrir',
  },
  {
    id: 'yuka',
    name: 'Yuka Tanaka',
    age: 24,
    location: 'Kyoto, Japan',
    nativeLanguage: 'Japanese 🇯🇵',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'ja',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_kenji_1793929609889.jpg',
    bio: 'Ceramics artisan and matcha cafe barista. Excited to teach practical polite Japanese and talk about travel and green tea in English!',
    interests: ['Tea Ceremony', 'Pottery', 'Gardening', 'Photography'],
    speakingSpeed: 'Gentle',
    accentNote: 'Kansai / Kyoto Japanese',
    streak: 37,
    onlineStatus: 'Active Now',
    voiceName: 'Kore',
  },

  // German
  {
    id: 'lukas-de',
    name: 'Lukas Weber',
    age: 27,
    location: 'Berlin, Germany',
    nativeLanguage: 'German 🇩🇪',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'de',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Advanced (B2)',
    avatarUrl: '/src/assets/images/partner_lukas_1793929610530.jpg',
    bio: 'Clean-tech engineer and urban boulderer in Kreuzberg. Love exchanging practical German idioms and chatting about music and outdoor hiking.',
    interests: ['Clean Energy', 'Bouldering', 'Electronic Music', 'Outdoor Hiking'],
    speakingSpeed: 'Direct & Clear',
    accentNote: 'Standard German (Hochdeutsch)',
    streak: 85,
    onlineStatus: 'Active Now',
    voiceName: 'Charon',
  },

  // Korean
  {
    id: 'minho',
    name: 'Minho Park',
    age: 25,
    location: 'Seoul, South Korea',
    nativeLanguage: 'Korean 🇰🇷',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'ko',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_minho_1793929609936.jpg',
    bio: 'Music producer and K-street food explorer in Hongdae. Ready to practice speaking English naturally without textbook stiffness!',
    interests: ['Music Production', 'Street Fashion', 'K-dramas', 'Spicy Tteokbokki'],
    speakingSpeed: 'Lively',
    accentNote: 'Seoul Standard Korean',
    streak: 49,
    onlineStatus: 'Active Now',
    voiceName: 'Puck',
  },

  // Italian
  {
    id: 'giulia',
    name: 'Giulia Rossi',
    age: 26,
    location: 'Rome, Italy',
    nativeLanguage: 'Italian 🇮🇹',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'it',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_camille_1793929609896.jpg',
    bio: 'Archaeology researcher and espresso devotee. Love spontaneous conversations about Italian gestures, ancient history, and favorite gelaterias!',
    interests: ['Archaeology', 'Gelato', 'Vespa Rides', 'Classical Music'],
    speakingSpeed: 'Expressive',
    accentNote: 'Central Italian (Rome)',
    streak: 58,
    onlineStatus: 'Active Now',
    voiceName: 'Zephyr',
  },

  // Portuguese
  {
    id: 'gabriel',
    name: 'Gabriel Santos',
    age: 26,
    location: 'Rio de Janeiro, Brazil',
    nativeLanguage: 'Portuguese 🇧🇷',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'pt',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_mateo_1793929193878.jpg',
    bio: 'Surfer and biologist near Ipanema. Excited to share Brazilian warmth and colloquial expressions while practicing conversational English.',
    interests: ['Surfing', 'Bossa Nova', 'Ecology', 'Açai Bowls'],
    speakingSpeed: 'Warm & Upbeat',
    accentNote: 'Carioca Portuguese (Brazil)',
    streak: 71,
    onlineStatus: 'Active Now',
    voiceName: 'Fenrir',
  },

  // Mandarin
  {
    id: 'mei',
    name: 'Mei Lin',
    age: 25,
    location: 'Shanghai, China',
    nativeLanguage: 'Mandarin 🇨🇳',
    learningLanguage: 'English 🇺🇸',
    nativeLangCode: 'zh',
    learningLangCode: 'en',
    proficiencyInUserLang: 'Intermediate (B1)',
    avatarUrl: '/src/assets/images/partner_elena_1793929193834.jpg',
    bio: 'Urban planner and tea connoisseur in Jing\'an. Passionate about helping English speakers master conversational tones and modern Chinese culture.',
    interests: ['Urban Architecture', 'Tea Ceremony', 'Calligraphy', 'Podcasting'],
    speakingSpeed: 'Measured & Gentle',
    accentNote: 'Standard Mandarin (Putonghua)',
    streak: 63,
    onlineStatus: 'Active Now',
    voiceName: 'Kore',
  },
];

// Topics catalog
const CONVERSATION_TOPICS = [
  {
    id: 'cafe-culture',
    title: 'Café Culture & Weekend Rituals',
    category: 'Daily Life',
    icon: 'coffee',
    description: 'Talk about your favorite morning drink, neighborhood cafes, and how you spend Saturday mornings.',
  },
  {
    id: 'travel-stories',
    title: 'Travel Disasters & Hidden Gems',
    category: 'Travel',
    icon: 'map-pin',
    description: 'Share a memorable journey, getting lost in a new city, or an unexpected place you fell in love with.',
  },
  {
    id: 'food-and-cooking',
    title: 'Street Food & Comfort Dishes',
    category: 'Culture',
    icon: 'utensils',
    description: 'Exchange local culinary secrets, family recipes, and dishes you could eat every single day.',
  },
];

// Helper: Generate AI Voice Speech using gemini-3.8-flash-lite-tts
async function generateAiVoice(
  text: string,
  voiceName: string = 'Kore',
  styleContext: string = 'Friendly native conversational speaker'
): Promise<string | null> {
  if (!ai || !text) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: styleContext,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    return base64Audio;
  } catch (err) {
    console.warn('Gemini TTS generation error (will fallback to browser speech):', err);
    return null;
  }
}

// API: Get Partners
app.get('/api/tandem/partners', (req, res) => {
  const lang = req.query.lang as string;
  if (lang) {
    const filtered = TANDEM_PARTNERS.filter((p) => p.nativeLangCode === lang);
    return res.json({ partners: filtered.length ? filtered : TANDEM_PARTNERS });
  }
  res.json({ partners: TANDEM_PARTNERS });
});

// API: Get Topics
app.get('/api/tandem/topics', (_req, res) => {
  res.json({ topics: CONVERSATION_TOPICS });
});

// API: Tandem Chat Response (with Gemini AI Voice synthesis)
app.post('/api/tandem/chat', async (req, res) => {
  try {
    const {
      partnerId,
      currentLanguage = 'es',
      sessionPhase = 'phase1_target',
      topicTitle = 'Daily Life',
      userMessage = '',
      messageHistory = [],
    } = req.body;

    const partner = TANDEM_PARTNERS.find((p) => p.id === partnerId) || TANDEM_PARTNERS[0];
    const isTargetLanguageTurn = sessionPhase === 'phase1_target';

    let replyText = '';
    let translation = '';
    let correction: string | null = null;
    let reaction = '¡Genial!';
    let followUpPrompt = '';

    if (ai) {
      const promptContext = `
You are roleplaying as ${partner.name}, a ${partner.age}-year-old from ${partner.location}.
Bio: ${partner.bio}.
Native Language: ${partner.nativeLanguage} (${partner.accentNote}).
Learning Language: ${partner.learningLanguage}.

Context: You are on a real-time Duolingo Tandem spoken exchange call.
Topic: "${topicTitle}".
Current Phase: ${
        isTargetLanguageTurn
          ? `Phase 1 - TARGET LANGUAGE PRACTICE (${partner.nativeLanguage}). The user is learning and practicing your native language (${currentLanguage}). You must respond in natural, friendly, warm ${partner.nativeLanguage}. Keep response conversational and bite-sized (1-3 sentences max). If the user made a grammar or vocab slip, give a gentle tip in 'correction'.`
          : `Phase 2 - ENGLISH PRACTICE. Now it is YOUR turn to practice English! You speak in slightly eager English with occasional charming minor native-speaker quirks. Ask the user a friendly question about the topic in English.`
      }

Conversation History:
${messageHistory.map((m: { speaker: string; text: string }) => `${m.speaker}: ${m.text}`).join('\n')}

The user said: "${userMessage}"

Respond in JSON matching:
{
  "replyText": "your spoken message in ${isTargetLanguageTurn ? partner.nativeLanguage : 'English'}",
  "translation": "English translation if reply is in another language, or the target language translation if reply is in English",
  "correction": "Optional gentle tip if user made an error in the active language, or null",
  "reaction": "short encouraging reaction (e.g. 'Love that!', '¡Genial!', 'なるほど！', 'Super!')",
  "followUpPrompt": "a quick prompt/question to keep the speaking flow going"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyText: { type: Type.STRING },
              translation: { type: Type.STRING },
              correction: { type: Type.STRING, nullable: true },
              reaction: { type: Type.STRING },
              followUpPrompt: { type: Type.STRING },
            },
            required: ['replyText', 'translation', 'reaction', 'followUpPrompt'],
          },
        },
      });

      if (response.text) {
        try {
          const parsed = JSON.parse(response.text);
          replyText = parsed.replyText;
          translation = parsed.translation;
          correction = parsed.correction;
          reaction = parsed.reaction;
          followUpPrompt = parsed.followUpPrompt;
        } catch {
          // fall through
        }
      }
    }

    // Localized fallbacks if AI text generation didn't populate
    if (!replyText) {
      const fallbacks: Record<string, { reply: string; trans: string; react: string; prompt: string }> = {
        es: {
          reply: `¡Qué bien lo dices! Me encanta este tema sobre "${topicTitle}". Aquí en ${partner.location.split(',')[0]} es muy común. ¿Qué opinas tú?`,
          trans: `You said that so well! I love this topic about "${topicTitle}". Here in ${partner.location.split(',')[0]} it's very common. What do you think?`,
          react: '¡Muy bien!',
          prompt: '¿Cómo es tu rutina típica?',
        },
        fr: {
          reply: `C'est très intéressant ! À ${partner.location.split(',')[0]}, nous adorons parler de "${topicTitle}". Votre prononciation est excellente !`,
          trans: `That's very interesting! In ${partner.location.split(',')[0]}, we love talking about "${topicTitle}". Your pronunciation is excellent!`,
          react: 'Très bien !',
          prompt: 'Et vous, qu’en pensez-vous ?',
        },
        ja: {
          reply: `とても上手ですね！${partner.location.split(',')[0]}でも「${topicTitle}」はとても人気です。発音もすごく自然ですよ！`,
          trans: `You speak very well! In ${partner.location.split(',')[0]}, "${topicTitle}" is very popular. Your pronunciation is very natural too!`,
          react: '素晴らしい！',
          prompt: '普段はどうしていますか？',
        },
        de: {
          reply: `Das hast du super gesagt! In ${partner.location.split(',')[0]} ist das Thema "${topicTitle}" auch sehr beliebt. Deine Aussprache ist echt klasse!`,
          trans: `You said that wonderfully! In ${partner.location.split(',')[0]}, "${topicTitle}" is also very popular. Your pronunciation is really great!`,
          react: 'Ausgezeichnet!',
          prompt: 'Wie machst du das normalerweise?',
        },
        ko: {
          reply: `정말 자연스럽게 말씀하시네요! ${partner.location.split(',')[0]}에서도 "${topicTitle}"에 대해 이야기하는 걸 다들 좋아해요. 발음이 정말 좋아요!`,
          trans: `You speak so naturally! In ${partner.location.split(',')[0]}, everyone loves talking about "${topicTitle}". Your pronunciation is really great!`,
          react: '대단해요!',
          prompt: '평소에는 어떠세요?',
        },
        it: {
          reply: `Che bello! Qui a ${partner.location.split(',')[0]} adoriamo parlare di "${topicTitle}". La tua pronuncia è davvero ottima!`,
          trans: `How lovely! Here in ${partner.location.split(',')[0]} we adore talking about "${topicTitle}". Your pronunciation is really great!`,
          react: 'Bravissimo!',
          prompt: 'Tu cosa preferisci?',
        },
        pt: {
          reply: `Que legal ouvir isso! Aqui em ${partner.location.split(',')[0]} todo mundo adora falar sobre "${topicTitle}". Seu sotaque está ótimo!`,
          trans: `How cool to hear that! Here in ${partner.location.split(',')[0]} everyone loves talking about "${topicTitle}". Your accent is great!`,
          react: 'Muito bom!',
          prompt: 'Como você costuma fazer?',
        },
        zh: {
          reply: `你说得真棒！在${partner.location.split(',')[0]}，大家也很喜欢聊"${topicTitle}"。你的发音听起来很舒服！`,
          trans: `You said that wonderfully! In ${partner.location.split(',')[0]}, people also love chatting about "${topicTitle}". Your pronunciation sounds very comfortable!`,
          react: '太棒了！',
          prompt: '你平时习惯怎么做呢？',
        },
      };

      if (!isTargetLanguageTurn) {
        replyText = `I really enjoy this conversation! In ${partner.location.split(',')[0]}, we have a similar tradition. Could you teach me: what is the most natural way to say "it feels like home" in English?`;
        translation = `¡Disfruto mucho esta conversación! En ${partner.location.split(',')[0]} tenemos una tradición similar. ¿Podrías enseñarme cuál es la forma más natural de decir "se siente como en casa" en inglés?`;
        reaction = 'So interesting!';
        followUpPrompt = 'Is it common where you live?';
      } else {
        const fallbackMatch = fallbacks[currentLanguage] || fallbacks.es;
        replyText = fallbackMatch.reply;
        translation = fallbackMatch.trans;
        reaction = fallbackMatch.react;
        followUpPrompt = fallbackMatch.prompt;
      }
    }

    // Generate real AI voice speech for the reply
    const audioData = await generateAiVoice(
      replyText,
      partner.voiceName || 'Kore',
      `Natural friendly conversational tone from ${partner.location}`
    );

    return res.json({
      replyText,
      translation,
      correction,
      reaction,
      followUpPrompt,
      audioData, // Base64 audio/wav generated by Gemini 3.8 Flash Lite TTS
    });
  } catch (err: unknown) {
    console.error('Tandem chat error:', err);
    return res.status(500).json({ error: 'Chat failed' });
  }
});

// API: On-demand Text-to-Speech endpoint (for greetings, listen again, vocab cards)
app.post('/api/tandem/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore', partnerLocation = 'Europe' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audioData = await generateAiVoice(
      text,
      voiceName,
      `Conversational native speaker from ${partnerLocation}`
    );

    return res.json({ audioData });
  } catch (err: unknown) {
    console.error('TTS endpoint error:', err);
    return res.status(500).json({ error: 'TTS failed' });
  }
});

// API: Help Say / Translation Helper across all languages
app.post('/api/tandem/help-say', async (req, res) => {
  try {
    const { phrase, targetLang = 'es' } = req.body;
    if (!phrase) {
      return res.status(400).json({ error: 'Phrase is required' });
    }

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Translate this phrase into natural conversational ${targetLang}: "${phrase}".
Provide the natural translation in ${targetLang}, a phonetic pronunciation guide for English speakers, and a short 1-sentence tip on natural usage.
Respond in JSON:
{
  "translated": "natural translation in target language",
  "phonetic": "phonetic guide",
  "tip": "short tip"
}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translated: { type: Type.STRING },
              phonetic: { type: Type.STRING },
              tip: { type: Type.STRING },
            },
            required: ['translated', 'phonetic', 'tip'],
          },
        },
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    }

    return res.json({
      translated: phrase,
      phonetic: phrase,
      tip: 'Practice saying it smoothly with your tandem partner!',
    });
  } catch (err: unknown) {
    console.error('Help say error:', err);
    return res.status(500).json({ error: 'Translation helper failed' });
  }
});

// Vite Middleware for Dev vs Static Dist for Production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      port: PORT,
      host: '0.0.0.0',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Duolingo Tandem server listening on port ${PORT}`);
});
