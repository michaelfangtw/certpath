// Question bank — 15 diagnostic Qs covering all 7 Parts, plus practice samples.
// All content is original, modeled on 2018+ TOEIC format. zh-TW explanations.

const DIAGNOSTIC = [
  // ── Part 1 (Photo description) ──────────────────────────
  { id: 'D1', part: 1, skill: 'listening', diff: 'green',
    audio: 'Look at the photo marked number one in your test book.',
    transcript: '(A) She is filing documents into a cabinet. (B) She is typing on a laptop at her desk. (C) She is presenting slides to colleagues. (D) She is making a phone call.',
    photo: { kind: 'desk-laptop' },
    options: { A: 'She is filing documents.', B: 'She is typing on a laptop.', C: 'She is presenting slides.', D: 'She is making a phone call.' },
    correct: 'B',
    keywords: ['typing', 'laptop'],
    explanation: '照片顯示一位女性坐在辦公桌前打字，故 (B) 為正解。(A)(C)(D) 中描述的動作均未出現於照片中。' },

  // ── Part 2 (Question-Response) — indirect answer trap ───
  { id: 'D2', part: 2, skill: 'listening', diff: 'gold',
    audio: 'Has the marketing budget for next quarter been approved yet?',
    options: { A: "Yes, it's on the third floor.", B: 'The finance director is still out on medical leave.', C: "I'll buy that for you later." },
    correct: 'B',
    keywords: ['approved', 'budget'],
    explanation: '金色證書常考的「間接回答」陷阱：不直接回答 Yes/No，而以「財務長仍在病假中」暗示尚未核准。' },

  { id: 'D3', part: 2, skill: 'listening', diff: 'blue',
    audio: 'When will the new branch in Taipei be opening?',
    options: { A: 'It opened last spring.', B: 'Sometime in late October, I believe.', C: 'On Maple Street.' },
    correct: 'B',
    keywords: ['branch', 'opening'],
    explanation: '問「何時開幕」(When)，(B) 給出時間區間「十月下旬左右」最合適。(A) 過去式不符；(C) 為地點回答。' },

  // ── Part 3 (Conversation) ───────────────────────────────
  { id: 'D4', part: 3, skill: 'listening', diff: 'gold',
    audio: '(M) Hi Linda, did you confirm the venue for the launch event? (W) Actually, the original ballroom is overbooked. I’m looking at the rooftop garden as a backup. (M) That sounds great, but check if they have a sound system for the keynote.',
    question: 'What does the man ask the woman to verify?',
    options: { A: 'The cost of renting the rooftop garden.', B: 'Whether audio equipment is available.', C: 'The number of expected attendees.', D: 'The time of the keynote speech.' },
    correct: 'B',
    keywords: ['venue', 'sound system'],
    explanation: '男士最後一句要求確認 "sound system for the keynote"，即音響設備，故選 (B)。' },

  // ── Part 4 (Short talk) ────────────────────────────────
  { id: 'D5', part: 4, skill: 'listening', diff: 'blue',
    audio: 'Attention shoppers — the customer service desk near the main entrance will be temporarily closed from 3 to 4 PM today for staff training. For urgent assistance during this time, please proceed to the kiosk on the second floor near the elevators.',
    question: 'Where should shoppers go for help during the closure?',
    options: { A: 'The main entrance.', B: 'The second-floor kiosk.', C: 'The customer service desk.', D: 'The training room.' },
    correct: 'B',
    keywords: ['kiosk', 'closure'],
    explanation: '廣播明確指出「請至二樓電梯旁的服務站」，故選 (B)。' },

  // ── Part 5 (Sentence completion — grammar/vocab) ───────
  { id: 'D6', part: 5, skill: 'reading', diff: 'gold',
    content: 'The CEO\'s _______ commitment to corporate social responsibility has significantly bolstered the firm\'s public image.',
    options: { A: 'unwavering', B: 'uncertain', C: 'unfastened', D: 'unlimited' },
    correct: 'A',
    keywords: ['unwavering', 'commitment', 'bolstered'],
    explanation: '"unwavering commitment"（堅定不移的承諾）為固定商務搭配。其他選項語意不符。' },

  { id: 'D7', part: 5, skill: 'reading', diff: 'blue',
    content: 'All visitors must _______ at the front desk before entering the laboratory area.',
    options: { A: 'register', B: 'registered', C: 'registration', D: 'registering' },
    correct: 'A',
    keywords: ['register'],
    explanation: '助動詞 must 後須接原形動詞，故選 (A) register。' },

  { id: 'D8', part: 5, skill: 'reading', diff: 'green',
    content: 'The shipment will arrive _______ Thursday morning at the latest.',
    options: { A: 'in', B: 'on', C: 'at', D: 'by' },
    correct: 'B',
    keywords: ['preposition'],
    explanation: '特定一天用 "on"，搭配 "Thursday morning"。' },

  // ── Part 6 (Text completion) ───────────────────────────
  { id: 'D9', part: 6, skill: 'reading', diff: 'blue',
    passage: 'Dear team, As discussed in last week\'s meeting, we will be migrating to the new project management platform starting June 1. _______ Training sessions are scheduled for May 20–25. Please RSVP by May 15.',
    blank: 'Sentence to insert in the blank:',
    options: {
      A: 'The previous platform will remain accessible until July 15 for reference.',
      B: 'Our office will be closed for renovations next month.',
      C: 'We are pleased to announce a new hire in the design department.',
      D: 'Please submit your expense reports by Friday.',
    },
    correct: 'A',
    keywords: ['migration', 'platform'],
    explanation: '前後文討論平台遷移，(A) 補充舊平台仍可使用，邏輯連貫。其他選項與主題無關。' },

  // ── Part 7 (Reading comprehension — single passage) ────
  { id: 'D10', part: 7, skill: 'reading', diff: 'blue',
    passage: 'NOTICE — Building Maintenance\n\nThe water supply on floors 8–12 will be shut off this Saturday from 9 AM to 2 PM for routine pipe inspection. Tenants are advised to store water in advance. Restrooms on floor 7 will remain available throughout the maintenance period. We apologize for any inconvenience.',
    question: 'What should tenants on floor 10 do during the maintenance?',
    options: { A: 'Leave the building entirely.', B: 'Use the restrooms on floor 7.', C: 'Store hot water for later use.', D: 'Contact the building manager.' },
    correct: 'B',
    keywords: ['maintenance', 'tenants'],
    explanation: '通知第二段指出 7 樓廁所維持開放，故 10 樓住戶應前往 7 樓使用。' },

  { id: 'D11', part: 7, skill: 'reading', diff: 'gold',
    passage: 'From: orders@northwindsupplies.com\nTo: kchen@bridgewell.com\nSubject: Order #44721 — Partial Shipment\n\nDear Ms. Chen,\n\nWe regret to inform you that your order will be shipped in two parts. The standing desks (qty: 6) will arrive Tuesday as scheduled, but the ergonomic chairs (qty: 8) are on backorder and will ship by April 30. As compensation, we have applied a 10% discount to the chair line item.',
    question: 'Why is the order being split?',
    options: { A: 'The shipping address was incomplete.', B: 'One product is currently unavailable.', C: 'The buyer requested separate deliveries.', D: 'The warehouse is undergoing renovation.' },
    correct: 'B',
    keywords: ['backorder', 'shipment'],
    explanation: 'Email 提到 "ergonomic chairs are on backorder"（缺貨待補），這正是分批出貨的原因。' },

  // ── More Part 5 grammar to round out ───────────────────
  { id: 'D12', part: 5, skill: 'reading', diff: 'gold',
    content: 'Despite _______ several setbacks early in the project, the engineering team delivered the prototype on time.',
    options: { A: 'encounter', B: 'encountered', C: 'encountering', D: 'to encounter' },
    correct: 'C',
    keywords: ['despite', 'gerund'],
    explanation: '介系詞 "Despite" 後須接動名詞 (V-ing)，故選 (C) encountering。' },

  // ── Part 2 ─────────────────────────────────────────────
  { id: 'D13', part: 2, skill: 'listening', diff: 'gold',
    audio: 'Why don\'t we postpone the client call until Wednesday?',
    options: { A: 'I prefer the conference room.', B: 'They\'re flying back from Singapore on Tuesday night.', C: 'It\'s about the merger.' },
    correct: 'B',
    keywords: ['postpone', 'meeting'],
    explanation: '"Why don\'t we…" 是建議句，(B) 提供合理依據（客戶星期二晚才回國），間接同意延期。' },

  // ── Part 3 — three-speaker conversation ────────────────
  { id: 'D14', part: 3, skill: 'listening', diff: 'gold',
    audio: '(M1) Has anyone heard back about the Tokyo office permit? (W) Not yet — but I emailed Hiroshi this morning. (M2) I checked just before lunch; he said the inspector visits on the 20th, and approval should come within 48 hours. (M1) Great, that gives us time to finalize the lease.',
    question: 'When is approval most likely to be received?',
    options: { A: 'On the 18th', B: 'On the 20th', C: 'On the 22nd', D: 'On the 25th' },
    correct: 'C',
    keywords: ['approval', 'inspector'],
    explanation: '檢查員 20 號到訪，48 小時內核准 → 22 號左右。需整合三人對話資訊。' },

  // ── Part 7 — chat-style ────────────────────────────────
  { id: 'D15', part: 7, skill: 'reading', diff: 'gold',
    passage: '[10:32 AM] Marco: Hey, the projector in Room B is acting up again.\n[10:33 AM] Lisa: Ugh — third time this month. Did you try the spare cable?\n[10:34 AM] Marco: Yep, no luck. I think we need to escalate this.\n[10:36 AM] Lisa: I\'ll put in a ticket with IT and request a replacement unit.\n[10:36 AM] Marco: Thanks. Any chance we can use Room C in the meantime?\n[10:38 AM] Lisa: Booked until 4 PM. Try the lounge — it has a wall-mounted screen.',
    question: 'At 10:33 AM, what does Lisa most likely mean when she writes, "third time this month"?',
    options: { A: 'She has used Room B three times.', B: 'The projector has malfunctioned repeatedly.', C: 'IT tickets take a long time to resolve.', D: 'A replacement was already ordered.' },
    correct: 'B',
    keywords: ['projector', 'malfunction'],
    explanation: '語意推斷題（多益新題型）。Lisa 在投影機壞掉的脈絡中說「這個月第三次了」，意指投影機反覆故障。' },
];

// Pre-built sample for Quiz screen (Part 2 sample like in UI kit)
const SAMPLE_QUIZ = {
  partLabel: 'Part 2 — 應答問題',
  items: [
    DIAGNOSTIC[1], DIAGNOSTIC[2], DIAGNOSTIC[12],
    { id: 'P2x', part: 2, audio: 'Where can I find the conference materials?',
      options: { A: 'They\'re in the binder on the left shelf.', B: 'It starts at 9 AM sharp.', C: 'About forty attendees.' },
      correct: 'A', explanation: '問「在哪」(Where) 答地點。' },
    { id: 'P2y', part: 2, audio: 'Would you like to review the proposal now or after lunch?',
      options: { A: 'It went really well.', B: 'After lunch sounds better.', C: 'I had the salad.' },
      correct: 'B', explanation: '選擇問句，(B) 二擇一其中之一。' },
  ],
};

// Score conversion (simplified TOEIC scaled-score approximation)
// Inputs: # correct out of N (listening/reading separately)
function scaleListening(correct, total) {
  const pct = correct / total;
  // 0..495 with curve resembling TOEIC table
  return Math.round(5 + pct * 490);
}
function scaleReading(correct, total) {
  const pct = correct / total;
  return Math.round(5 + pct * 490);
}

// Demo data tiers
const DEMO_TIERS = {
  beginner: {
    name: 'Eric', firstName: 'Eric', avatar: 'E',
    points: 240, streak: 3, accuracy: 48, predicted: 420,
    listening: 230, reading: 190,
    radar: [0.40, 0.55, 0.32, 0.45, 0.30],
    tier: 'green', completed: 12,
  },
  intermediate: {
    name: 'Mei-Lin', firstName: 'Mei-Lin', avatar: 'M',
    points: 680, streak: 12, accuracy: 65, predicted: 680,
    listening: 360, reading: 320,
    radar: [0.62, 0.68, 0.55, 0.62, 0.50],
    tier: 'blue', completed: 38,
  },
  advanced: {
    name: 'Angela', firstName: 'Angela', avatar: 'A',
    points: 1240, streak: 23, accuracy: 84, predicted: 845,
    listening: 425, reading: 420,
    radar: [0.82, 0.90, 0.74, 0.85, 0.72],
    tier: 'gold', completed: 76,
  },
};

const LEADERBOARD = [
  { rank: 1, name: 'Wei-Ting Lin', score: 12480, tier: 'gold',  avatar: 'W', delta: '+2' },
  { rank: 2, name: 'Sarah Wu',     score: 11920, tier: 'gold',  avatar: 'S', delta: '0' },
  { rank: 3, name: 'David Chen',   score: 10650, tier: 'gold',  avatar: 'D', delta: '+1' },
  { rank: 4, name: 'Hsiao-Mei Lo', score:  9840, tier: 'blue',  avatar: 'H', delta: '-1' },
  { rank: 5, name: 'Ken Yamamoto', score:  9210, tier: 'blue',  avatar: 'K', delta: '0' },
];

const COACH_GREETINGS = [
  '哈囉！我是你的 AI 多益教練 🤖。今天想練聽力還是閱讀？',
  '我注意到你昨天的 Part 2 正確率只有 60%，建議今天從間接回答練起。',
  '距離考試還有不少天，依目前節奏每天 22 題就能達標 — 衝吧！',
];

// Quiz items used by the QuizScreen (mix of listening + reading with `skill` + `explain`)
const QUIZ_PARTS = [
  { id: 'Q0a', skill: 'listening', part: 1,
    audio: 'Look at the photograph marked number one in your test book.',
    photo: { kind: 'meeting-room' },
    options: {
      A: 'Several people are seated around a table.',
      B: 'A man is writing on the whiteboard.',
      C: 'Chairs are stacked against the wall.',
      D: 'The lights in the room are turned off.',
    },
    correct: 'A',
    explain: '照片中多人圍坐圓桌，(A) 描述最貼切。(B) 無人正在書寫白板；(C)(D) 均與照片場景不符。' },
  { id: 'Q0b', skill: 'listening', part: 1,
    audio: 'Look at the photograph marked number two in your test book.',
    photo: { kind: 'reception' },
    options: {
      A: 'A woman is mopping the floor.',
      B: 'Some chairs are arranged in a circle.',
      C: 'A receptionist is standing behind a counter.',
      D: 'Luggage is piled near the entrance.',
    },
    correct: 'C',
    explain: '照片顯示接待台前有工作人員站立，(C) 正確。(A)(B)(D) 均與照片描述不符。' },
  { id: 'Q1', skill: 'listening', part: 2,
    audio: 'When does the marketing report need to be submitted?',
    question: 'Choose the most appropriate response.',
    options: { A: 'By Friday afternoon.', B: 'In the meeting room.', C: 'Five copies, please.' },
    correct: 'A',
    explain: 'When 開頭問時間，(A) 「By Friday afternoon」直接回應截止時間。(B)(C) 答地點與份數，皆不符。' },
  { id: 'Q2', skill: 'listening', part: 3,
    audio: 'Two colleagues discuss a project deadline being pushed back to accommodate a client review…',
    question: 'Why has the deadline been postponed?',
    options: { A: 'A team member is on leave.', B: 'The client requested additional review time.',
               C: 'The budget has not been approved.', D: 'New requirements were added.' },
    correct: 'B',
    explain: '對話中明確提及 "the client wants extra time to review"，故選 (B)。' },
  { id: 'Q3', skill: 'reading', part: 5,
    content: 'The new training program ______ all incoming employees during their first month.',
    blank: '空格應填入哪個字？',
    options: { A: 'require', B: 'requires', C: 'requiring', D: 'required' },
    correct: 'B',
    explain: '主詞 "training program" 為單數第三人稱、現在式，故動詞需加 s，選 (B) requires。' },
  { id: 'Q4', skill: 'reading', part: 6,
    passage: 'Dear valued customer,\n\nWe are pleased to inform you that your order ______ shipped this morning. Tracking information has been sent to your registered email.',
    blank: '空格選最佳答案',
    options: { A: 'is', B: 'has been', C: 'will be', D: 'was being' },
    correct: 'B',
    explain: '搭配 "this morning" 表示動作已完成且影響仍持續，現在完成被動 has been shipped 最為恰當。' },
  { id: 'Q5', skill: 'reading', part: 7,
    passage: 'NOTICE TO ALL TENANTS\n\nThe building elevator will undergo scheduled maintenance on Saturday, May 8, from 8:00 AM to 2:00 PM. During this period, please use the stairwell. We apologize for any inconvenience.',
    question: '依照公告，星期六上午 10 點電梯狀態為何？',
    options: { A: 'Operating normally.', B: 'Out of service for maintenance.',
               C: 'Reserved for moving.', D: 'Restricted to staff only.' },
    correct: 'B',
    explain: '公告寫 8AM–2PM 進行維修，10AM 落在此時間範圍內，故電梯停用。' },
  { id: 'Q6', skill: 'listening', part: 4,
    audio: 'Welcome aboard flight TPE-NRT 822. Our flying time today will be approximately 3 hours and 15 minutes…',
    question: 'What is the speaker most likely?',
    options: { A: 'A travel agent.', B: 'A flight attendant.', C: 'A taxi driver.', D: 'A hotel concierge.' },
    correct: 'B',
    explain: '"Welcome aboard"、"flying time" 都是空服員機上廣播常用語，故選 (B)。' },
];

const APP_VERSION = 'v1.0.8';

Object.assign(window, { DIAGNOSTIC, SAMPLE_QUIZ, QUIZ_PARTS, scaleListening, scaleReading, DEMO_TIERS, LEADERBOARD, COACH_GREETINGS, APP_VERSION });
