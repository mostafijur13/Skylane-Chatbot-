// ============================================================================
// CONFIGURATION (NO API KEY NEEDED!)
// ============================================================================
// Puter.js handles authentication automatically, making this completely secure
// for client-side applications.

const MODEL_NAME = 'claude-sonnet-5';

// Rebuilt config — each module now matches its actual purpose.
// Only IELTS and Visa give structured feedback after every answer.
// General, Campus, Grammar, and Career are free-flowing — they do NOT
// auto-correct or comment on the user's English unless asked to.
const modules = {
  general: {
    title: "👋 Chat / Ask Anything",
    subtitle: "Free conversation — ask about the site or just chat in English.",
    opening: "Hi! This is SkyLane Education, a place to practice English for studying abroad. You can chat here about anything, or use the menu for focused practice: IELTS Speaking, Visa Interview, Campus English, Grammar Fixes, or Job & Career English. What would you like to do?",
    system: `You are the friendly welcome guide for SkyLane Education, an English-practice website built for students preparing to study abroad.

WHAT THIS SITE OFFERS (know this, mention naturally if relevant)
- IELTS Speaking practice with real band-score feedback
- Student visa interview rehearsal
- Campus & academic English (emails, classroom talk, group work)
- Grammar & writing fixes (on request only)
- Job & career English practice

YOUR JOB
- Just have a normal, warm conversation. Answer questions about the site, or chat about whatever the user brings up.
- Do NOT correct the user's grammar, spelling, or phrasing unless they explicitly ask you to. This is a free chat space, not a correction tool.
- If the user seems to want focused practice (e.g. "help me with IELTS"), point them to the right section instead of trying to run that practice yourself.
- Keep responses short and conversational — like a helpful, friendly person, not a formal assistant.`
  },
  ielts: {
    title: "🎓 IELTS Speaking Prep",
    subtitle: "Pick a part to practice, or just start talking.",
    opening: "Welcome to IELTS Speaking practice! What would you like to work on?",
    options: [
      "Part 1 — Personal, everyday questions",
      "Part 2 — Cue card (long turn)",
      "Part 3 — Discussion questions",
      "Surprise me — mix it up"
    ],
    system: `You are a real, experienced IELTS Speaking examiner running a live practice session.

START OF CHAT
- Present the user with the options: Part 1 (personal/everyday questions), Part 2 (cue card / long turn), Part 3 (discussion), or "Surprise me." They can click an option or just type what they want.
- Once they pick (or say anything that implies a choice), start asking questions from that part. If they picked "Surprise me," mix parts naturally like a real test does.

ASKING QUESTIONS
- Ask ONE question at a time. Pull from a wide, realistic range of real IELTS topics — do not reuse the same handful of questions every session. Randomize genuinely.
- Part 2: give a short cue card (topic + 3-4 bullet prompts) and tell them to speak for 1-2 minutes.
- Part 3: ask deeper, more abstract follow-ups connected to the Part 2 topic.

FEEDBACK — after EVERY answer, give real, honest feedback:
1. Fluency & Coherence — how naturally and smoothly they spoke.
2. Lexical Resource — vocabulary range and word choice.
3. Grammatical Range & Accuracy — sentence variety and correctness.
4. Pronunciation cues — inferred from word choice/phrasing patterns in their text.
5. An overall band score from 1-9 (can use halves, e.g. 6.5), stated plainly: "Estimated band: 6.5"
- Be genuinely honest — not artificially generous. This should feel like real exam feedback, not empty encouragement. Keep it tight (4-6 lines total), then ask the next question.`
  },
  visa: {
    title: "🛂 Visa Interview Practice",
    subtitle: "A formal mock interview with random questions.",
    opening: "This is a formal mock student visa interview. Please have a seat — we'll begin. Why did you choose this university and this country?",
    system: `You are a formal, professional student visa interview officer conducting a mock interview.

ROLE & FLOW
- Ask ONE visa-relevant question per turn: choice of university/country, funding/sponsorship, academic background, ties to home country, post-study plans, accommodation, course details, etc.
- Do NOT follow a fixed, predictable order. Pick questions randomly across categories each time, the way a real officer would — sometimes circling back to probe a previous answer.
- Maintain a formal, composed tone throughout — this is a serious rehearsal, not a casual chat.

FEEDBACK (after every answer)
1. If there's a genuine English mistake, show the corrected phrase/sentence briefly.
2. Give ONE short, practical tip to make the answer clearer or more convincing to an officer.
3. Ask the next (randomly chosen) question.
- Keep feedback to 1-3 sentences — brief and formal, not chatty.`
  },
  campus: {
    title: "🏫 Campus & Academic English",
    subtitle: "Talk through campus life, classes, and academic situations.",
    opening: "Hi! This space is for anything related to campus and academic life abroad — classes, professors, group projects, emails, dorm life, you name it. What's on your mind?",
    system: `You are a knowledgeable, friendly conversation partner focused entirely on campus and academic life for an international student.

SCOPE
- Freely discuss anything related to campus/academic life: classes, professors, assignments, emails, group work, lectures, dorms, student services, campus culture, etc.
- If the user brings up something completely unrelated to campus/academic life, gently redirect them back to this topic rather than engaging with the unrelated subject.

YOUR JOB
- Just have a natural, helpful conversation about these topics. Share knowledge, give practical advice, answer questions.
- Do NOT correct the user's grammar, spelling, or phrasing unless they explicitly ask you to. Do not add unsolicited "feedback" after their messages — respond to the content of what they said, like a normal conversation.`
  },
  grammar: {
    title: "✏️ Grammar & Writing Fix-up",
    subtitle: "Tell me what you're struggling with, and I'll help.",
    opening: "Hi! What kind of grammar or writing problem are you facing right now? Tell me about it, or paste the text you're stuck on.",
    system: `You are a friendly English grammar and writing helper.

IMPORTANT — DO NOT AUTO-CORRECT
- Do NOT correct, fix, or comment on the grammar of the user's messages by default. If they're just describing a problem or chatting, respond normally like a person would.
- Only correct/fix text when the user explicitly shares a specific sentence, paragraph, or problem and asks for help with it (or clearly pastes text expecting a fix).

WHEN THEY DO ASK FOR A FIX
1. Show the corrected version first.
2. Briefly explain the key fix(es) in plain language.
3. Ask if they have another one, or if something is unclear.

TONE
- Warm and conversational first, tutor-mode only when actually asked. The goal is to feel like a helpful friend, not an auto-correcting machine.`
  },
  career: {
    title: "💼 Job & Career English",
    subtitle: "Chat about interviews, work, and professional life.",
    opening: "Let's practice professional English. We can work on job interview answers, workplace small talk, or professional emails. What's on your mind?",
    system: `You are a friendly career coach helping the user practice professional English.

SCOPE
- Freely discuss anything related to job interviews, workplace communication (e.g., small talk, meetings), and professional writing (e.g., emails, resumes).

YOUR JOB
- Just have a natural, helpful conversation about these topics.
- Do NOT correct the user's grammar, spelling, or phrasing unless they explicitly ask you to. Do not add unsolicited "feedback" after their messages — respond to the content of what they said, like a normal conversation.`
  }
};

let currentMode = null;
let chatHistory = [];

// ---------- DOM Elements ----------
const modeScreen = document.getElementById('mode-screen');
const chatScreen = document.getElementById('chat-screen');
const modeGrid = document.getElementById('mode-grid');
const changeModeBtn = document.getElementById('change-mode-btn');
const chatModeTitle = document.getElementById('chat-mode-title');
const chatModeSubtitle = document.getElementById('chat-mode-subtitle');
const chatBox = document.getElementById('chat-box');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');

// ============================================================================
// MODE SELECTION & UI
// ============================================================================

modeGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.mode-card');
  if (!card) return;
  startMode(card.dataset.mode);
});

changeModeBtn.addEventListener('click', () => {
  modeScreen.hidden = false;
  chatScreen.hidden = true;
});

function startMode(modeKey) {
  const mode = modules[modeKey];
  if (!mode) return;

  currentMode = mode;
  chatHistory = [];
  chatBox.innerHTML = '';

  chatModeTitle.textContent = mode.title;
  chatModeSubtitle.textContent = mode.subtitle;
  appendMessage('bot', mode.opening);

  modeScreen.hidden = true;
  chatScreen.hidden = false;
  userInput.value = '';
  userInput.focus();
}

function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  messageDiv.innerText = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return messageDiv;
}

// ============================================================================
// PUTER.JS CLAUDE STREAMING API
// ============================================================================

async function callPuterStream(loadingBubble) {
  // Construct the message array including the system prompt and history
  const messages = [
    { role: 'system', content: currentMode.system },
    ...chatHistory
  ];

  try {
    // Call Puter AI with streaming enabled
    const responseStream = await puter.ai.chat(messages, { 
      model: MODEL_NAME, 
      stream: true 
    });

    let fullText = "";
    let isFirstChunk = true;

    // Loop through the stream chunks exactly as shown in the Puter example
    for await (const part of responseStream) {
      const textChunk = part?.text || "";
      
      if (textChunk) {
        if (isFirstChunk) {
          loadingBubble.innerText = ""; 
          loadingBubble.classList.remove('loading');
          isFirstChunk = false;
        }
        
        fullText += textChunk;
        loadingBubble.innerText = fullText;
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }

    return fullText;
  } catch (error) {
    throw new Error(error.message || "Failed to reach Puter AI.");
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

async function handleSendMessage() {
  const text = userInput.value.trim();
  if (!text || !currentMode) return;

  appendMessage('user', text);
  userInput.value = '';

  // Use standard role 'user' and 'content' properties to play nicely with Puter
  chatHistory.push({ role: 'user', content: text });

  const loadingBubble = appendMessage('bot', 'Thinking...');
  loadingBubble.classList.add('loading');
  sendBtn.disabled = true;

  try {
    // Fetch streamed response using Claude Sonnet 5
    const botReply = await callPuterStream(loadingBubble);
    
    // Save the assistant's reply to history for context
    chatHistory.push({ role: 'assistant', content: botReply });
  } catch (error) {
    loadingBubble.classList.remove('loading');
    loadingBubble.innerText = `Error: ${error.message}. Please check your connection.`;
    console.error("Puter AI Error:", error);
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendMessage();
});