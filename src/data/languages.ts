import { SupportedLanguage, Partner, Topic, SuggestedVocab } from '../types';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    greeting: '¡Hola!',
    speechCode: 'es-ES',
    samplePhrases: ['¡Hola!', '¿Cómo estás?', '¿Puedes repetir?', '¡Me gusta mucho!'],
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    greeting: 'Bonjour !',
    speechCode: 'fr-FR',
    samplePhrases: ['Bonjour !', 'Comment vas-tu ?', 'Peux-tu répéter ?', "J'aime beaucoup !"],
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    greeting: 'こんにちは！',
    speechCode: 'ja-JP',
    samplePhrases: ['こんにちは！', '元気ですか？', 'もう一度言って？', 'とても好きです！'],
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    greeting: 'Hallo!',
    speechCode: 'de-DE',
    samplePhrases: ['Hallo!', 'Wie geht es dir?', 'Kannst du das wiederholen?', 'Das gefällt mir sehr!'],
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    greeting: '안녕하세요!',
    speechCode: 'ko-KR',
    samplePhrases: ['안녕하세요!', '잘 지내세요?', '다시 말씀해 주시겠어요?', '정말 좋아요!'],
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    greeting: 'Ciao!',
    speechCode: 'it-IT',
    samplePhrases: ['Ciao!', 'Come stai?', 'Puoi ripetere?', 'Mi piace molto!'],
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    greeting: 'Olá!',
    speechCode: 'pt-BR',
    samplePhrases: ['Olá!', 'Tudo bem?', 'Pode repetir?', 'Gosto muito!'],
  },
  {
    code: 'zh',
    name: 'Mandarin',
    nativeName: '中文',
    flag: '🇨🇳',
    greeting: '你好！',
    speechCode: 'zh-CN',
    samplePhrases: ['你好！', '你最近怎么样？', '能再说一遍吗？', '我非常喜欢！'],
  },
];

export const ALL_PARTNERS: Partner[] = [
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
  },
];

export function getLocalizedPrompts(topicId: string, langCode: string): {
  prompts: string[];
  vocab: SuggestedVocab[];
} {
  const dictionary: Record<
    string,
    Record<string, { prompts: string[]; vocab: SuggestedVocab[] }>
  > = {
    'cafe-culture': {
      es: {
        prompts: [
          '¿Cómo tomas el café por la mañana?',
          '¿Qué sueles hacer los sábados para relajarte?',
          '¿Tienes una cafetería favorita en tu ciudad?',
        ],
        vocab: [
          { term: 'café con leche', translation: 'coffee with milk' },
          { term: 'desayuno típico', translation: 'typical breakfast' },
          { term: 'los fines de semana', translation: 'on the weekends' },
          { term: 'ambiente acogedor', translation: 'cozy atmosphere' },
        ],
      },
      fr: {
        prompts: [
          'Comment prenez-vous votre café le matin ?',
          'Que faites-vous habituellement le week-end pour vous détendre ?',
          'Avez-vous un café préféré dans votre quartier ?',
        ],
        vocab: [
          { term: 'café crème', translation: 'coffee with warm milk' },
          { term: 'croissant frais', translation: 'fresh croissant' },
          { term: 'en terrasse', translation: 'on the patio / sidewalk' },
          { term: 'pause détente', translation: 'relaxing break' },
        ],
      },
      ja: {
        prompts: [
          '朝はいつも何を飲みますか？',
          '週末はどうやってリラックスしますか？',
          'お気に入りのカフェや喫茶店はありますか？',
        ],
        vocab: [
          { term: 'モーニングセット', translation: 'morning cafe breakfast set' },
          { term: '落ち着く場所', translation: 'relaxing spot' },
          { term: '週末の予定', translation: 'weekend plans' },
          { term: '珈琲を淹れる', translation: 'brew coffee' },
        ],
      },
      de: {
        prompts: [
          'Wie trinken Sie Ihren Kaffee am liebsten morgens?',
          'Was machen Sie samstags gern zur Entspannung?',
          'Haben Sie ein Lieblingscafé in Ihrer Stadt?',
        ],
        vocab: [
          { term: 'Kaffee und Kuchen', translation: 'coffee and cake' },
          { term: 'gemütlich', translation: 'cozy and comfortable' },
          { term: 'Frühstücksbrötchen', translation: 'breakfast bread roll' },
          { term: 'Ausschlafen', translation: 'sleeping in' },
        ],
      },
      ko: {
        prompts: [
          '아침에 주로 어떤 음료를 드세요?',
          '주말에는 보통 어떻게 휴식을 취하시나요?',
          '동네에 자주 가는 단골 카페가 있으신가요?',
        ],
        vocab: [
          { term: '아이스 아메리카노 (아아)', translation: 'iced americano' },
          { term: '동네 카페', translation: 'neighborhood cafe' },
          { term: '힐링 타임', translation: 'healing / relaxing time' },
          { term: '여유로운 아침', translation: 'leisurely morning' },
        ],
      },
      it: {
        prompts: [
          'Come prendi il caffè la mattina?',
          'Cosa fai di solito il sabato per rilassarti?',
          'Hai un bar o una caffetteria preferita nella tua città?',
        ],
        vocab: [
          { term: 'un espresso al banco', translation: 'an espresso at the counter' },
          { term: 'cornetto caldo', translation: 'warm croissant' },
          { term: 'chiacchierare', translation: 'to chat pleasantly' },
          { term: 'bella atmosfera', translation: 'lovely atmosphere' },
        ],
      },
      pt: {
        prompts: [
          'Como você gosta do seu cafezinho de manhã?',
          'O que você costuma fazer no fim de semana para relaxar?',
          'Você tem uma cafeteria ou padaria favorita no seu bairro?',
        ],
        vocab: [
          { term: 'pão de queijo', translation: 'cheese bread' },
          { term: 'café com leite', translation: 'coffee with milk' },
          { term: 'bater papo', translation: 'to chat / catch up' },
          { term: 'lugar aconchegante', translation: 'cozy place' },
        ],
      },
      zh: {
        prompts: [
          '你早晨喜欢喝咖啡还是喝茶？',
          '你周末一般怎么放松自己？',
          '你在你的城市里有常去的特色咖啡馆吗？',
        ],
        vocab: [
          { term: '拿铁咖啡', translation: 'latte' },
          { term: '早午餐', translation: 'brunch' },
          { term: '悠闲的周末', translation: 'leisurely weekend' },
          { term: '常客', translation: 'regular customer' },
        ],
      },
    },
    'travel-stories': {
      es: {
        prompts: [
          '¿Cuál es el lugar más bonito que has visitado?',
          '¿Alguna vez te has perdido en un viaje?',
          '¿Prefieres viajar a la playa o a la montaña?',
        ],
        vocab: [
          { term: 'perderse', translation: 'to get lost' },
          { term: 'paisaje increíble', translation: 'incredible scenery' },
          { term: 'recomendar', translation: 'to recommend' },
          { term: 'mochilero', translation: 'backpacker' },
        ],
      },
      fr: {
        prompts: [
          'Quel est le plus bel endroit que vous ayez visité ?',
          'Vous êtes-vous déjà perdu en voyage ?',
          'Préférez-vous voyager à la mer ou à la montagne ?',
        ],
        vocab: [
          { term: 'dépaysement', translation: 'change of scenery' },
          { term: 'voyage inoubliable', translation: 'unforgettable journey' },
          { term: 'se perdre', translation: 'to get lost' },
          { term: 'paysage grandiose', translation: 'magnificent landscape' },
        ],
      },
      ja: {
        prompts: [
          '今まで訪れた中で一番綺麗な場所はどこですか？',
          '旅行中に迷子になった経験はありますか？',
          '海と山、どちらへの旅行が好きですか？',
        ],
        vocab: [
          { term: '一人旅', translation: 'solo travel' },
          { term: '絶景', translation: 'breathtaking scenery' },
          { term: '温泉街', translation: 'hot spring town' },
          { term: '道に迷う', translation: 'to get lost' },
        ],
      },
      de: {
        prompts: [
          'Was ist der schönste Ort, den Sie je besucht haben?',
          'Haben Sie sich auf einer Reise schon mal verlaufen?',
          'Reisen Sie lieber ans Meer oder in die Berge?',
        ],
        vocab: [
          { term: 'Fernweh', translation: 'wanderlust / desire to travel' },
          { term: 'sich verlaufen', translation: 'to get lost' },
          { term: 'atemberaubend', translation: 'breathtaking' },
          { term: 'Geheimtipp', translation: 'insider tip / hidden gem' },
        ],
      },
      ko: {
        prompts: [
          '지금까지 가본 곳 중 가장 기억에 남는 여행지는 어디인가요?',
          '여행 중에 길을 잃어버린 적이 있나요?',
          '바다 여행과 산 여행 중 어느 쪽을 더 좋아하시나요?',
        ],
        vocab: [
          { term: '힐링 여행', translation: 'healing / relaxing trip' },
          { term: '길을 잃다', translation: 'to get lost' },
          { term: '인생 사진', translation: 'best photo of my life' },
          { term: '숨은 명소', translation: 'hidden gem' },
        ],
      },
      it: {
        prompts: [
          'Qual è il posto più bello che hai mai visitato?',
          'Ti sei mai perso durante un viaggio?',
          'Preferisci viaggiare verso il mare o la montagna?',
        ],
        vocab: [
          { term: 'scorcio incantevole', translation: 'enchanting view' },
          { term: 'perdersi nei vicoli', translation: 'getting lost in alleys' },
          { term: 'posti segreti', translation: 'secret spots' },
          { term: 'viaggio su strada', translation: 'road trip' },
        ],
      },
      pt: {
        prompts: [
          'Qual é o lugar mais bonito que você já visitou?',
          'Você já se perdeu durante uma viagem?',
          'Você prefere viajar para a praia ou para o campo/montanha?',
        ],
        vocab: [
          { term: 'viagem inesquecível', translation: 'unforgettable trip' },
          { term: 'se perder', translation: 'to get lost' },
          { term: 'paisagem paradisíaca', translation: 'paradisiacal scenery' },
          { term: 'mochilão', translation: 'backpacking' },
        ],
      },
      zh: {
        prompts: [
          '你去过的最美丽的旅行目的地是哪里？',
          '你在旅行中有过迷路的有趣经历吗？',
          '你更喜欢去海边度假还是去山区徒步？',
        ],
        vocab: [
          { term: '迷人的风景', translation: 'charming landscape' },
          { term: '自由行', translation: 'independent travel' },
          { term: '隐秘宝地', translation: 'hidden gem' },
          { term: '难忘的回忆', translation: 'unforgettable memory' },
        ],
      },
    },
    'food-and-cooking': {
      es: {
        prompts: [
          '¿Cuál es tu comida favorita de tu país?',
          '¿Te gusta cocinar en casa o pedir comida?',
          '¿Has probado alguna comida típica española o mexicana?',
        ],
        vocab: [
          { term: 'ingredientes frescos', translation: 'fresh ingredients' },
          { term: 'receta familiar', translation: 'family recipe' },
          { term: 'muy sabroso', translation: 'very tasty / flavorful' },
          { term: 'picante', translation: 'spicy' },
        ],
      },
      fr: {
        prompts: [
          'Quel est votre plat traditionnel préféré ?',
          'Aimez-vous cuisiner chez vous ou aller au restaurant ?',
          'Avez-vous déjà goûté une spécialité française ?',
        ],
        vocab: [
          { term: 'fait maison', translation: 'homemade' },
          { term: 'recette de grand-mère', translation: "grandmother's recipe" },
          { term: 'très savoureux', translation: 'very flavorful' },
          { term: 'repas convivial', translation: 'convivial meal' },
        ],
      },
      ja: {
        prompts: [
          'あなたの国の料理で一番好きなものは何ですか？',
          '自炊するのは好きですか？それとも外食派ですか？',
          '日本料理で一番好きなものは何ですか？',
        ],
        vocab: [
          { term: '郷土料理', translation: 'regional traditional dish' },
          { term: '手料理', translation: 'home cooking' },
          { term: '出汁 (だし)', translation: 'dashi / savory broth' },
          { term: '美味しい', translation: 'delicious' },
        ],
      },
      de: {
        prompts: [
          'Was ist Ihr traditionelles Lieblingsgericht aus Ihrer Heimat?',
          'Kochen Sie gern zu Hause oder gehen Sie lieber essen?',
          'Haben Sie schon mal deutsche Spezialitäten probiert?',
        ],
        vocab: [
          { term: 'Hausmannskost', translation: 'home-cooked comfort food' },
          { term: 'frisch zubereitet', translation: 'freshly prepared' },
          { term: 'Familienrezept', translation: 'family recipe' },
          { term: 'köstlich', translation: 'delicious' },
        ],
      },
      ko: {
        prompts: [
          '고향 음식 중 가장 좋아하는 소울푸드는 무엇인가요?',
          '집에서 직접 요리하는 걸 좋아하시나요, 아니면 외식을 즐기시나요?',
          '한국 음식 중에서 가장 좋아하는 음식이 있으신가요?',
        ],
        vocab: [
          { term: '집밥', translation: 'home-cooked meal' },
          { term: '매콤달콤한 맛', translation: 'spicy and sweet flavor' },
          { term: '길거리 음식', translation: 'street food' },
          { term: '손맛', translation: "cook's seasoned hand / touch" },
        ],
      },
      it: {
        prompts: [
          'Qual è il tuo piatto tradizionale preferito?',
          'Ti piace cucinare a casa o preferisci andare al ristorante?',
          'Hai mai provato a fare la pasta fresca o la pizza fatta in casa?',
        ],
        vocab: [
          { term: 'fatto in casa', translation: 'homemade' },
          { term: 'ricetta segreta', translation: 'secret recipe' },
          { term: 'ingredienti genuini', translation: 'authentic ingredients' },
          { term: 'buonissimo', translation: 'super delicious' },
        ],
      },
      pt: {
        prompts: [
          'Qual é o prato mais típico e gostoso do seu país?',
          'Você gosta de cozinhar em casa ou prefere comer fora?',
          'Você já provou alguma comida típica brasileira (feijoada, coxinha)?',
        ],
        vocab: [
          { term: 'comida caseira', translation: 'home-cooked comfort food' },
          { term: 'muito saboroso', translation: 'very flavorful' },
          { term: 'tempero especial', translation: 'special seasoning' },
          { term: 'prato preferido', translation: 'favorite dish' },
        ],
      },
      zh: {
        prompts: [
          '你最喜欢的家乡传统美食是什么？',
          '你平时喜欢自己下厨还是在外面吃？',
          '你吃过最地道的中餐是什么？',
        ],
        vocab: [
          { term: '家常菜', translation: 'home-style cooking' },
          { term: '色香味俱全', translation: 'delicious in color, aroma, and taste' },
          { term: '街头小吃', translation: 'street snacks' },
          { term: '鲜美', translation: 'fresh and savory' },
        ],
      },
    },
  };

  const topicDict = dictionary[topicId] || dictionary['cafe-culture'];
  if (topicDict[langCode]) {
    return topicDict[langCode];
  }
  // Default to Spanish if language not found
  return topicDict['es'] || {
    prompts: ['¿Qué piensas de este tema?', 'Cuéntame tu experiencia.'],
    vocab: [{ term: 'interesante', translation: 'interesting' }],
  };
}
