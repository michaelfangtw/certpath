// AI Conversation Practice — scenario-based speaking & response training
const { useState: useStateAI, useEffect: useEffectAI, useRef: useRefAI } = React;

const AI_SCENARIOS = [
  {
    id: 'meeting', icon: '💼', tag: 'BUSINESS',
    title: '商務會議簡報',
    desc: '向團隊匯報季度成果，回應主管提問',
    level: 'gold', turns: 6,
    opening: 'Good morning everyone. Thanks for joining today\'s Q3 review. Could you walk us through the key revenue numbers and any blockers your team is facing?',
    sampleResponses: [
      'Sure. Q3 revenue grew 12% year-over-year, mainly driven by enterprise renewals. Our main blocker is the delayed product launch, which pushed two large deals into Q4.',
      'We hit 92% of our target. The shortfall came from APAC, where the new GTM team is still ramping up.',
      'I\'d like to highlight that customer churn dropped to 3.2%, our best quarter on record.',
    ],
    aiFollowups: [
      'Interesting. What\'s your confidence level on closing those Q4 deals, on a scale of 1 to 10?',
      'Got it. What support do you need from leadership to accelerate APAC ramp-up?',
      'That\'s impressive. Which retention initiatives moved the needle most?',
      'Thanks for the update. Last question — are there any risks to the Q4 forecast we should know about?',
    ],
  },
  {
    id: 'hotel', icon: '🏨', tag: 'TRAVEL',
    title: '飯店入住',
    desc: '與櫃台人員應對 — Check-in、需求、抱怨',
    level: 'blue', turns: 5,
    opening: 'Welcome to The Grand Plaza. May I have your name and reservation details, please?',
    sampleResponses: [
      'Hi, I have a reservation under Wang. Three nights, checking out on Friday.',
      'Yes, the booking is under my company, Apex Industries.',
      'Could you upgrade me to a room with a view? I\'m happy to pay the difference.',
    ],
    aiFollowups: [
      'Of course, Mr. Wang. I see your reservation. Would you prefer a room with a city view or a garden view?',
      'I have a corner suite available on the 18th floor for an additional $40 per night. Would that work?',
      'No problem. Breakfast is included from 6:30 to 10:30 AM in the Atrium. Anything else I can help with?',
      'Here\'s your key card. Is this your first time staying with us?',
    ],
  },
  {
    id: 'interview', icon: '🤝', tag: 'CAREER',
    title: '工作面試',
    desc: '英文面試 — 自我介紹、強項、薪資協商',
    level: 'gold', turns: 7,
    opening: 'Thanks for coming in today. Let\'s start with a brief introduction — could you tell me about yourself and what brings you to this role?',
    sampleResponses: [
      'I\'m a marketing specialist with five years of experience in B2B SaaS. I\'m drawn to your role because of your focus on data-driven growth.',
      'I have a background in finance, and recently I\'ve been transitioning into product management.',
    ],
    aiFollowups: [
      'Great background. Walk me through a project you led that had measurable business impact.',
      'What would you say is your biggest professional weakness, and how are you working on it?',
      'How do you prioritize when you have ten things on your plate and only time for three?',
      'What\'s your salary expectation for this role?',
      'Why are you leaving your current company?',
      'Do you have any questions for us?',
    ],
  },
  {
    id: 'restaurant', icon: '🍽️', tag: 'DAILY',
    title: '餐廳訂位點餐',
    desc: '電話訂位、菜單詢問、特殊需求',
    level: 'green', turns: 5,
    opening: 'Bistro Lumière, this is Marcus. How may I help you today?',
    sampleResponses: [
      'Hi, I\'d like to make a reservation for two at 7 PM this Saturday.',
      'Could I get a table by the window if possible?',
      'One of us is vegetarian. Do you have plant-based options?',
    ],
    aiFollowups: [
      'Of course. May I have your name and a contact number?',
      'Window seats fill up fast — I\'ll do my best. Any dietary restrictions I should note?',
      'We have an excellent mushroom risotto and a roasted vegetable plate. Would you like me to set them aside?',
      'Perfect. We look forward to seeing you Saturday at 7. Have a great day!',
    ],
  },
  {
    id: 'airport', icon: '✈️', tag: 'TRAVEL',
    title: '機場海關 + 轉機',
    desc: '入境問答、行李、轉機詢問',
    level: 'blue', turns: 4,
    opening: 'Welcome to San Francisco. May I see your passport and customs declaration form, please?',
    sampleResponses: [
      'Sure, here you go. I\'m here for a business conference.',
      'I\'m staying for five days at the Hilton downtown.',
      'I have a connecting flight to Seattle at 6:45 PM.',
    ],
    aiFollowups: [
      'What\'s the purpose of your visit, business or pleasure?',
      'How long will you be staying in the United States?',
      'Do you have anything to declare — over $10,000 in cash, agricultural products, or commercial goods?',
      'Welcome. Please proceed to baggage claim. Connecting flights are at Terminal 2.',
    ],
  },
  {
    id: 'pitch', icon: '🚀', tag: 'BUSINESS',
    title: '電梯簡報 (Elevator Pitch)',
    desc: '60 秒推銷你自己 / 你的產品',
    level: 'gold', turns: 4,
    opening: 'Hey, I heard you\'re working on something interesting. We\'ve got about 60 seconds before my next meeting — what\'s the pitch?',
    sampleResponses: [
      'We\'re building an AI-powered TOEIC platform that personalizes practice based on real-time weakness detection. Students improve 30% faster than with traditional prep.',
      'I run product at FinTechCo. We just launched embedded payments for SMBs and grew 4x in six months.',
    ],
    aiFollowups: [
      'Interesting. What\'s your traction so far?',
      'Who\'s your biggest competitor, and how are you different?',
      'What\'s the ask? Funding, intros, hiring?',
      'Send me a deck — I might know someone who\'d be interested.',
    ],
  },
];

function AIConversationCenter({ goNav, demo, dark, onPickScenario }) {
  return (
    <div style={{ minHeight: '100vh', background: dark ? '#1a1612' : 'var(--paper-base)' }}>
      <Navbar current="practice" onNav={goNav} demo={demo} dark={dark} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32,
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <Eyebrow>AI Conversation · NEW</Eyebrow>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              AI 口說對話練習
              <span style={{ background: 'var(--terra)', color: '#fff', fontSize: 11, fontWeight: 900,
                              padding: '4px 10px', borderRadius: 6, letterSpacing: '0.1em' }}>
                BETA
              </span>
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: 16, marginTop: 6 }}>
              選擇一個情境，與 AI 教練即時對話。系統會即時評分你的回應流暢度、文法與上下文相關性。
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Eyebrow color="var(--ink-muted)">Today</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18 }}>
              已完成 <span style={{ color: 'var(--terra)' }}>2</span> / 3 場
            </div>
          </div>
        </div>

        {/* Live tip */}
        <div style={{
          padding: '20px 28px', marginBottom: 32, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--terra-05), var(--paper-card))',
          border: '1px solid var(--terra-20)', borderLeft: '6px solid var(--terra)',
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{ fontSize: 36 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <Eyebrow style={{ marginBottom: 6 }}>AI 教練建議</Eyebrow>
            <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
              你最近 Part 3 對話題正確率 65% — 我推薦先從 <strong>「商務會議簡報」</strong>練起，
              這個情境的詞彙與題目高度重疊。完成可獲得 <strong style={{ color: 'var(--terra)' }}>+200 PTS</strong>。
            </div>
          </div>
        </div>

        {/* Scenario cards */}
        <SectionHeader title="情境選擇" eyebrow="Scenario Library · 6 categories" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {AI_SCENARIOS.map(s => {
            const tier = TIER[s.level];
            return (
              <PaperCard key={s.id} accent="left-terra" hover onClick={() => onPickScenario(s)}
                         style={{ minHeight: 240, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 14, right: 16,
                              background: tier.tint, color: tier.text,
                              padding: '4px 10px', borderRadius: 6,
                              fontFamily: 'var(--font-sans)', fontSize: 9, fontWeight: 900,
                              letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {tier.label.replace('證書','')} 程度
                </div>
                <div style={{ fontSize: 48, marginBottom: 14 }}>{s.icon}</div>
                <Eyebrow style={{ fontSize: 9, marginBottom: 8 }}>{s.tag}</Eyebrow>
                <h3 style={{ marginBottom: 6, fontSize: 18 }}>{s.title}</h3>
                <p style={{ color: 'var(--ink-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                  {s.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              paddingTop: 14, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                    💬 {s.turns} 回合 · ~5 分鐘
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                                color: 'var(--terra)', fontWeight: 700, fontSize: 13 }}>
                    開始 <Icon name="arrowRight" size={14} />
                  </div>
                </div>
              </PaperCard>
            );
          })}
        </div>

        {/* How it works */}
        <div style={{ height: 48 }} />
        <SectionHeader title="運作方式" eyebrow="How It Works" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { n: 1, t: '選情境', d: '從 6 個生活/商務情境中挑一個' },
            { n: 2, t: '即時對話', d: 'AI 開場，你用文字或語音回應' },
            { n: 3, t: '即時打分', d: '流暢度、文法、上下文 三項 0-100' },
            { n: 4, t: '錯誤分析', d: 'AI 標記錯誤句子並提供改寫建議' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9999, background: 'var(--terra)',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>
                {s.n}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 15 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function AIConversationRunner({ goNav, demo, scenario, onComplete, firePoints, fireConfetti, setDemo, dark }) {
  const [turns, setTurns] = useStateAI([
    { role: 'ai', text: scenario.opening, time: 0 },
  ]);
  const [draft, setDraft] = useStateAI('');
  const [recording, setRecording] = useStateAI(false);
  const [thinking, setThinking] = useStateAI(false);
  const [scores, setScores] = useStateAI([]);    // {fluency, grammar, relevance, feedback}
  const [done, setDone] = useStateAI(false);
  const [time, setTime] = useStateAI(0);
  const [showSample, setShowSample] = useStateAI(-1);
  const scrollRef = useRefAI();
  const tRef = useRefAI();
  const srRef = useRefAI(null);

  useEffectAI(() => {
    tRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(tRef.current);
  }, []);

  const handleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('此瀏覽器不支援語音輸入，請改用 Chrome 或 Edge。');
      return;
    }
    if (recording) {
      srRef.current?.stop();
      srRef.current = null;
      setRecording(false);
      return;
    }
    const sr = new SR();
    sr.lang = 'en-US';
    sr.interimResults = true;
    sr.continuous = false;
    srRef.current = sr;
    sr.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript).join('');
      if (e.results[e.results.length - 1].isFinal) {
        setDraft(d => (d ? d + ' ' : '') + transcript.trim());
        srRef.current = null;
        setRecording(false);
      }
    };
    sr.onerror = () => { srRef.current = null; setRecording(false); };
    sr.onend = () => { srRef.current = null; setRecording(false); };
    sr.start();
    setRecording(true);
  };

  useEffectAI(() => {
    scrollRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' });
  }, [turns, thinking]);

  const userTurns = turns.filter(t => t.role === 'user').length;
  const remaining = scenario.turns - userTurns;

  // Fake but reasonable scoring + feedback based on length / keywords
  const scoreReply = (text) => {
    const len = text.trim().length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const fluency = Math.max(40, Math.min(98, 55 + Math.floor(words * 2.2) + (text.includes(',') ? 8 : 0)));
    const grammar = Math.max(45, Math.min(96, 60 + (/[A-Z]/.test(text[0]) ? 12 : 0) + (/\.$/.test(text.trim()) ? 8 : 0) + (words > 8 ? 10 : 0) - (text.includes('  ') ? 5 : 0)));
    const relevance = Math.max(50, Math.min(95, 55 + Math.min(35, len / 4)));
    const overall = Math.round((fluency + grammar + relevance) / 3);

    let feedback;
    if (overall >= 85) feedback = { tone: 'good', icon: '✨', text: '回應完整、語氣自然，有具體支持細節。' };
    else if (overall >= 70) feedback = { tone: 'ok', icon: '👍', text: `不錯！可考慮加入 1 個量化數據或時間，讓論點更有力。` };
    else feedback = { tone: 'low', icon: '💡', text: '回應略短。建議完整句、加上「because…」或「for example…」。' };

    return { fluency, grammar, relevance, overall, feedback };
  };

  const submit = () => {
    if (!draft.trim() || thinking || done) return;
    const userText = draft;
    const idx = userTurns;
    const score = scoreReply(userText);
    setTurns(t => [...t, { role: 'user', text: userText, score, time }]);
    setScores(s => [...s, score]);
    setDraft('');
    setThinking(true);

    setTimeout(() => {
      const nextTurns = userTurns + 1;
      if (nextTurns >= scenario.turns) {
        setThinking(false);
        setDone(true);
        const avg = Math.round(([...scores, score].reduce((a, b) => a + b.overall, 0)) / nextTurns);
        const pts = 100 + avg * 2;
        firePoints?.(pts, 'AI 對話獎勵');
        if (avg >= 80) fireConfetti?.();
        setTimeout(() => {
          setDemo?.(d => ({ ...d, points: d.points + pts, completed: d.completed + 1 }));
        }, 800);
      } else {
        const followup = scenario.aiFollowups[idx % scenario.aiFollowups.length];
        setTurns(t => [...t, { role: 'ai', text: followup, time }]);
        setThinking(false);
      }
    }, 1400 + Math.random() * 600);
  };

  const overallScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b.overall, 0) / scores.length)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--paper-card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 72,
                      display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={() => goNav('ai-conversation')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--ink-muted)', fontWeight: 700, fontSize: 13,
          }}>
            <Icon name="arrowLeft" size={16} /> 退出
          </button>
          <div style={{ height: 24, width: 1, background: 'var(--border)' }} />
          <div style={{ fontSize: 24 }}>{scenario.icon}</div>
          <div>
            <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>{scenario.tag}</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 15 }}>
              {scenario.title}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 12 }}>
            <div>
              <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>Turn</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14 }}>
                {Math.min(userTurns + 1, scenario.turns)} / {scenario.turns}
              </div>
            </div>
            <div>
              <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>Time</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}
              </div>
            </div>
            {scores.length > 0 && (
              <div>
                <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>Avg Score</Eyebrow>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: 'var(--terra)' }}>
                  {overallScore}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Progress */}
        <div style={{ height: 4, background: 'var(--paper-muted)' }}>
          <div style={{ height: '100%', width: `${(userTurns / scenario.turns) * 100}%`,
                        background: 'var(--terra)', transition: 'width 400ms var(--ease-out)' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', maxWidth: 1280,
                    width: '100%', margin: '0 auto', overflow: 'hidden' }}>
        {/* Conversation pane */}
        <div ref={scrollRef} style={{ overflowY: 'auto', padding: '32px 24px 200px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {turns.map((m, i) => (
              <div key={i} style={{
                marginBottom: 24,
                display: 'flex', gap: 12,
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                animation: 'slideUp 300ms var(--ease-out) both',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: m.role === 'user' ? 'var(--ink)' : 'var(--terra)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: m.role === 'ai' ? 'var(--shadow-terra)' : 'none',
                }}>
                  {m.role === 'user' ? <span style={{ fontWeight: 900 }}>{demo.avatar}</span> : <Icon name="bot" size={20} />}
                </div>
                <div style={{ maxWidth: '78%' }}>
                  <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9, marginBottom: 4,
                            textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    {m.role === 'user' ? `You · ${demo.firstName}` : 'AI Coach'}
                  </Eyebrow>
                  <div style={{
                    padding: '14px 18px', borderRadius: 14,
                    background: m.role === 'user' ? 'var(--terra)' : 'var(--paper-card)',
                    color: m.role === 'user' ? '#fff' : 'var(--ink)',
                    border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: 14, lineHeight: 1.7,
                    boxShadow: m.role === 'user' ? 'var(--shadow-terra)' : 'var(--shadow-sm)',
                  }}>
                    {m.text}
                  </div>
                  {m.score && (
                    <div style={{ marginTop: 10, padding: 12,
                                   background: m.score.feedback.tone === 'good' ? 'rgba(46,125,50,0.06)' :
                                               m.score.feedback.tone === 'low' ? 'rgba(198,40,40,0.06)' :
                                               'var(--paper-muted)',
                                   border: '1px solid var(--border)',
                                   borderRadius: 10, fontSize: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        {[
                          { l: 'Fluency', v: m.score.fluency },
                          { l: 'Grammar', v: m.score.grammar },
                          { l: 'Relevance', v: m.score.relevance },
                        ].map(s => (
                          <div key={s.l} style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10,
                                          marginBottom: 4, color: 'var(--ink-muted)' }}>
                              <span>{s.l}</span>
                              <span style={{ fontWeight: 900, color: 'var(--ink)' }}>{s.v}</span>
                            </div>
                            <div style={{ height: 4, background: 'var(--paper-muted)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${s.v}%`,
                                            background: s.v >= 80 ? 'var(--state-success)' :
                                                        s.v >= 65 ? 'var(--terra)' : 'var(--state-error)',
                                            transition: 'width 600ms var(--ease-out)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start',
                                    paddingTop: 8, borderTop: '1px solid var(--border)',
                                    color: 'var(--ink-muted)' }}>
                        <span>{m.score.feedback.icon}</span>
                        <span style={{ flex: 1, lineHeight: 1.5 }}>{m.score.feedback.text}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--terra)',
                              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="bot" size={20} />
                </div>
                <div style={{ padding: '14px 18px', background: 'var(--paper-card)',
                              border: '1px solid var(--border)', borderRadius: 14,
                              display: 'flex', gap: 6 }}>
                  {[0, 0.15, 0.3].map(d => (
                    <div key={d} style={{ width: 8, height: 8, borderRadius: 9999, background: 'var(--terra)',
                                          animation: `bounce 1s ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {done && (
              <PaperCard accent="top-terra" style={{ padding: 32, marginTop: 32, textAlign: 'center',
                                                       animation: 'slideUp 500ms var(--ease-out) both' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>
                  {overallScore >= 85 ? '🏆' : overallScore >= 70 ? '🎉' : '💪'}
                </div>
                <Eyebrow style={{ marginBottom: 8 }}>對話完成 · Conversation Complete</Eyebrow>
                <h2>整體得分 {overallScore}</h2>
                <p style={{ color: 'var(--ink-muted)', fontSize: 13, marginTop: 8 }}>
                  {overallScore >= 85 ? '✨ 表現極佳！這個情境你已掌握。' :
                   overallScore >= 70 ? '不錯！再加強回應細節即可達到金級水準。' :
                   '繼續加油，建議重練此情境並參考範例答案。'}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                  <Button variant="outline" onClick={() => goNav('ai-conversation')}>選別的情境</Button>
                  <Button variant="primary" onClick={() => goNav('dashboard')} icon="arrowRight">
                    返回總覽
                  </Button>
                </div>
              </PaperCard>
            )}
          </div>
        </div>

        {/* Coach hints sidebar */}
        <aside style={{ background: 'var(--paper-card)', borderLeft: '1px solid var(--border)',
                        padding: 24, overflowY: 'auto' }}>
          <Eyebrow style={{ marginBottom: 12 }}>AI Hints</Eyebrow>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>回應提示</h3>

          <div style={{ padding: 14, background: 'var(--paper-muted)', borderRadius: 10,
                        marginBottom: 16, fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.7 }}>
            💡 試著用 <strong style={{ color: 'var(--ink)' }}>主題句 + 1-2 個支持句</strong>。多益口說評分喜歡看到具體例子。
          </div>

          <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 8 }}>建議句型</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
            {[
              'Sure, let me walk you through…',
              'The key takeaway is…',
              'For example, …',
              'I\'d like to highlight that…',
            ].map((p, i) => (
              <button key={i} onClick={() => setDraft(d => d ? `${d} ${p}` : p)} style={{
                padding: '8px 12px', textAlign: 'left',
                background: 'var(--paper-card)', border: '1px solid var(--border)',
                borderRadius: 8, fontSize: 12, color: 'var(--ink)', fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
              }}>
                + {p}
              </button>
            ))}
          </div>

          <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 8 }}>範例答案</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {scenario.sampleResponses.map((r, i) => (
              <div key={i}>
                <button onClick={() => setShowSample(showSample === i ? -1 : i)} style={{
                  width: '100%', padding: '10px 12px', textAlign: 'left',
                  background: showSample === i ? 'var(--terra-05)' : 'var(--paper-muted)',
                  border: `1px solid ${showSample === i ? 'var(--terra)' : 'var(--border)'}`,
                  borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-sans)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontWeight: 700 }}>📝 範例 {i + 1}</span>
                  <Icon name={showSample === i ? 'minus' : 'plus'} size={12} />
                </button>
                {showSample === i && (
                  <div style={{ padding: 12, marginTop: 4, background: 'var(--paper-card)',
                                border: '1px solid var(--border)', borderRadius: 8,
                                fontSize: 12, lineHeight: 1.6, color: 'var(--ink-muted)',
                                fontStyle: 'italic' }}>
                    "{r}"
                    <button onClick={() => setDraft(r)} style={{
                      marginTop: 10, background: 'transparent', border: 'none',
                      color: 'var(--terra)', fontWeight: 700, fontSize: 11, cursor: 'pointer',
                      padding: 0,
                    }}>
                      ↑ 套用為我的答案
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Composer (sticky bottom) */}
      {!done && (
        <div style={{
          position: 'sticky', bottom: 0, background: 'var(--paper-card)',
          borderTop: '1px solid var(--border)', boxShadow: '0 -8px 24px -12px rgba(0,0,0,0.08)',
          padding: '16px 24px',
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <button onClick={handleMic} style={{
                width: 48, height: 48, borderRadius: 12, border: 'none',
                background: recording ? 'var(--state-error)' : 'var(--paper-muted)',
                color: recording ? '#fff' : 'var(--ink)',
                cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: recording ? 'pulseGold 1.2s infinite' : 'none',
              }}>
                <Icon name="mic" size={20} />
              </button>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
                  placeholder={recording ? '🎙️ 正在收音… (示範)' : '輸入你的回應，或按麥克風語音輸入…'}
                  rows={2}
                  style={{
                    width: '100%', resize: 'none',
                    padding: '12px 14px', borderRadius: 12,
                    border: '1px solid var(--border)', background: 'var(--paper-base)',
                    fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.6,
                    color: 'var(--ink)', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--terra)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 10, color: 'var(--ink-faint)' }}>
                  {draft.split(/\s+/).filter(Boolean).length} words · ⏎ to send
                </div>
              </div>
              <Button variant="primary" onClick={submit} disabled={!draft.trim() || thinking}
                      style={{ height: 48, padding: '0 20px' }}>
                <Icon name="send" size={16} /> 送出
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.AIConversationCenter = AIConversationCenter;
window.AIConversationRunner = AIConversationRunner;
