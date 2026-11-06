# Duolingo Tandem: Real-Time Conversational Language Exchange

A flagship conversational feature embedded into the Duolingo experience that matches reciprocal language learners (e.g. English native learning Spanish paired with Spanish native learning English) for 5-minute timed split voice conversations with guided prompts, live feedback, and daily conversation streak rewards.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and user experience decisions were aligned during Phase 1 clarification:

- **Interactive Tandem Experience**: The app provides instant interactive voice and text conversation with simulated authentic native partners (e.g., Sofía from Madrid, Mateo from Mexico City, Lucas from Bogota) along with a simulated live matchmaking queue, ensuring immediate interactive testing without requiring a second human on the other side.
- **Timed Split Sessions (The Tandem Formula)**: Sessions are structured into balanced halves (e.g., Phase 1 in Spanish for learner A; Phase 2 in English for learner B), equipped with guided icebreaker topics, instant inline translations, vocabulary assists, and audio synthesis.
- **Daily Retention & Streak Loop**: Integrated Duolingo retention loops featuring the Daily Speaking Streak flame, Duo XP boosters (e.g., +30 XP for completing a 5-minute tandem chat), daily quest progress, and post-session conversational fluency feedback.

***

### 1. Overview & Core Concept

- **What It Does**: Duolingo Tandem connects language learners into real-time reciprocal conversation rooms. If you are an English speaker learning Spanish, Tandem pairs you with a Spanish speaker learning English. A 5-minute session is split down the middle: 2.5 minutes speaking Spanish (where your partner gently helps you), followed by a chime and switch to 2.5 minutes speaking English (where you help your partner).
- **Target Audience / Persona**: Language learners who know vocabulary and grammar rules from daily lessons but freeze when attempting real-life conversations, seeking a safe, friendly, low-anxiety peer environment.
- **Key Value**: Bridges the gap between static multiple-choice drills and spoken fluency, turning isolated practice into meaningful social connection and cementing a non-negotiable daily habit.

***

### 2. User Experience & Visual Design

#### Key User Flows
1. **Lobby & Match Discovery**:
   - The user sees their current language pair (e.g., Native: English 🇺🇸 ➔ Learning: Spanish 🇲🇽, B1 Intermediate).
   - "Find a Tandem Partner" launchpad showing estimated queue time, current conversation streak, and today's featured topic (e.g. *"Ordering coffee & regional street food"*).
   - Instant match option with curated exchange partners (with native accents, bios, interests, and availability).
2. **Pre-Call Icebreaker Card**:
   - Matched profile reveal: Partner avatar, city, native language, and learning goal.
   - Quick audio check, agreed topic preview, and mutual safety guidelines.
3. **Live Tandem Conversation Stage**:
   - **Split Timer & Turn Indicator**: Visual progress bar indicating Phase 1 (Target Language: Spanish) with a friendly chime countdown, transitioning automatically to Phase 2 (Target Language: English).
   - **Guided Topic Cue Cards**: Contextual questions, suggested vocabulary bank, and sentence starters on-screen to prevent awkward silences.
   - **Voice & Speech Interface**: Real-time microphone input with speech recognition, audio waveform visualization, and realistic audio playback for your partner.
   - **Live Scaffolding Tools**:
     - *Tap-to-Translate*: Instant inline English/Spanish translation for any partner phrase.
     - *Help Me Say This*: Instant phrase suggestions when stuck.
     - *Kind Correction*: One-tap peer correction button that highlights grammar or phrasing with warmth.
4. **Session Wrap-Up & Retention Celebration**:
   - Duo owl animation cheering completion.
   - Speaking stats: Minutes spoken, vocabulary words used, mutual "Friendly Speaker" kudos.
   - Streak flame increment (+1 Daily Speaking Streak) and XP collection (+35 XP).
   - Option to add partner to "Tandem Friends" list for scheduled daily chats.

#### Visual Identity & Theme
- **Aesthetic Direction**: Iconic Duolingo design language—friendly, vibrant, tactile, and game-inspired. Chunky 3D buttons with bottom borders, rounded card geometry (`rounded-2xl` to `rounded-3xl`), clean flat colors, and playful character touches.
- **Color Palette**:
  - Dominant Canvas: Warm clean light surface (`#FFFFFF` / `#F7F7F7`) with optional dark mode (`#131F24`).
  - Duolingo Feather Green: `#58CC02` (Base), `#58A700` (Bevel / Shadow) for primary CTAs and success states.
  - Streak Orange / Flame: `#FF9600` (Flame accents and retention counters).
  - Tandem Sky Blue: `#1CB0F6` (Partner highlights and turn indicators).
  - Cardinal Red: `#FF4B4B` (Timer alerts and microphone recording indicators).
  - Slate Neutrals: `#4B4B4B` (Body text), `#E5E5E5` (Hairline dividers and neutral borders).
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` with bold, friendly weight (`font-extrabold`).
  - Body Text: `Plus Jakarta Sans` (15px–16px, readable, balanced line height).
  - Numbers & Counters: Tabular figures (`tabular-nums font-bold`) for the countdown timer and XP tallies.
- **Interactive Feedback & Motion**:
  - Tactile button press animations (`translate-y-1` on active).
  - Dynamic audio waveform bars that react to voice activity.
  - Smooth phase transition banner sliding across when switching languages at the halfway mark.
  - Confetti burst and streak flame burst upon call completion.

***

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Reciprocal Split Timer (The 50/50 Rule)**
  - *Chosen Approach*: Enforce a strict halfway language swap (e.g. 2.5 min in Spanish, 2.5 min in English) with on-screen visual prompts and suggested questions for each side.
  - *Why*: In unbalanced language exchanges, the stronger speaker often dominates in their language. A structured split guarantees both users get equal practice and equal teaching time.
  - *Alternatives Considered*: Free-form open conversation without a timer (discarded: causes conversational anxiety and language imbalance).
- **Decision 2: Dual Simulation & Live Matchmaking Support**
  - *Chosen Approach*: Provide a realistic live pairing queue that matches with intelligent native AI partner personas with distinct accents, voices, and personalities, alongside instant simulated partner switching.
  - *Why*: Allows immediate, rich, self-contained testing in the browser sandbox without depending on finding a real concurrent user in another tab.
  - *Alternatives Considered*: Requiring two real browser tabs with complex WebRTC signaling (too fragile for initial prototype evaluation; hard for single reviewers to test).
- **Decision 3: Gemini-Powered Conversational Intelligence & In-Flight Assistance**
  - *Chosen Approach*: Server-side Gemini API endpoints for generating dynamic contextual partner responses, real-time translations, grammar coaching tips, and conversational prompts.
  - *Why*: Creates authentic, fluid conversations that respond directly to what the learner says, rather than static scripted dialogues.

***

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Duolingo Tandem Applet                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌───────────────────────────────┐           ┌───────────────────────────────┐
│         Client View           │           │     Server-Side Services      │
│  - Duolingo Shell & Top Nav   │           │  - Express / Node.js Engine   │
│  - Matchmaking Lobby & Cards  │  HTTP API │  - Gemini 3.8 Flash Proxy     │
│  - Live Split-Session Room    │ ────────> │    * Partner Speech Generation│
│  - Guided Prompt Dock         │ <──────── │    * Live Context Translation │
│  - Audio Waveform & Speech    │  SSE/JSON │    * Grammar & Phrasing Coach │
│  - Post-Session XP & Streak   │           │  - Partner Profiles & Catalog │
└───────────────────────────────┘           └───────────────────────────────┘
                 │                                           │
                 ▼                                           ▼
┌───────────────────────────────┐           ┌───────────────────────────────┐
│     Client State Engine       │           │     Speech & Audio Layer      │
│  - User Profile (ES/EN pair)  │           │  - Web Speech Recognition     │
│  - Phase Timer (50/50 Split)  │           │  - SpeechSynthesis TTS Voices │
│  - Message History & Assists  │           │  - Audio Waveform Visualizer  │
│  - Streak, XP & Daily Quests  │           │  - Chime & Sound Effect Synth │
└───────────────────────────────┘           └───────────────────────────────┘
```

#### Data Model & State
- **User Profile**:
  - `nativeLanguage`: `LanguageCode` (e.g. `'en'`, `'es'`, `'fr'`, `'de'`).
  - `targetLanguage`: `LanguageCode`.
  - `proficiencyLevel`: `'A1'` | `'A2'` | `'B1'` | `'B2'`.
  - `speakingStreak`: `number` (current daily conversation streak).
  - `totalSpeakingMinutes`: `number`.
  - `tandemXp`: `number`.
- **Tandem Partner**:
  - `id`: Unique identifier.
  - `name`: Partner name (e.g. "Sofía Ramos").
  - `location`: Partner city/country ("Madrid, Spain").
  - `nativeLanguage`: `'es'`.
  - `learningLanguage`: `'en'`.
  - `avatar`: Visual asset or illustration badge.
  - `bio`: Short conversational bio and interests (e.g., travel, food, music).
  - `voicePersona`: Voice tone and speech characteristics.
- **Tandem Session State**:
  - `sessionId`: Session UUID.
  - `partner`: Selected partner profile.
  - `topic`: Current conversation topic (e.g., "Favorite Travel Disasters", "Ordering at a Tapas Bar").
  - `phase`: `'phase1_target'` (first half) | `'halfway_transition'` | `'phase2_native'` (second half) | `'completed'`.
  - `elapsedSeconds`: Number of seconds elapsed.
  - `phaseDurationSeconds`: 150 seconds per half (5 minutes total, with adjustable demo speed: normal vs test 60s).
  - `transcript`: Array of speaker turns (`speaker: 'user' | 'partner'`, `text`, `timestamp`, `translation`, `corrections`).
  - `isMicActive`: Microphone listening state.
  - `isSpeaking`: Audio output active state.

#### Interactive Component & State Mapping
- **Lobby View (`TandemLobby`)**:
  - Displays language exchange pair badge, active daily streak flame, daily quest card (*"Practice 5 min of Tandem speaking"*).
  - Language selector allowing users to switch between Spanish/English, French/English, Japanese/English, etc.
  - "Quick Match" button triggering matching queue animation with instant or custom partner selection.
- **Conversation Stage (`TandemRoom`)**:
  - Split header with reciprocal flags (🇪🇸 Spanish Half ➔ 🇺🇸 English Half) and countdown circle.
  - Partner avatar bubble with speaking wave animation.
  - Live conversational feed with instant inline translation toggle and pronunciation button.
  - Interactive Action Dock:
    - Push-to-talk / Voice toggle with Web Speech recognition.
    - Quick phrase starters (*"¿Cómo se dice...?"*, *"¿Puedes repetir?"*).
    - "Switch Language Early" option if both users agree.
- **Summary & Reward Modal (`TandemSummary`)**:
  - Animated celebration showing XP earned (+35 XP), streak flame level up, words practiced count, and encouraging feedback from Duo.
  - Option to send a "High Five" kudos to the partner or save them for future tandem sessions.
