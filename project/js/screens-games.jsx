// Mini-Games — 3 daily-playable games:
//   1. Word Match  (memory pair flipping)
//   2. Sound Pop   (listen → click correct floating bubble)
//   3. Word Order  (drag-free click-to-arrange sentence builder)

const { useState: useStateGM, useEffect: useEffectGM, useRef: useRefGM, useMemo: useMemoGM } = React;

// ── Game data ───────────────────────────────────────────
const WORD_PAIRS = [
  { en: 'budget',     zh: '預算' },
  { en: 'invoice',    zh: '發票' },
  { en: 'deadline',   zh: '期限' },
  { en: 'agenda',     zh: '議程' },
  { en: 'forecast',   zh: '預測' },
  { en: 'colleague',  zh: '同事' },
  { en: 'submit',     zh: '提交' },
  { en: 'approve',    zh: '核准' },
];
const WORD_LEVELS = [
  { name: 'Lv 1 · 上班族基本款', pairs: [
    { en: 'budget',    zh: '預算' },   { en: 'invoice',   zh: '發票' },
    { en: 'deadline',  zh: '期限' },   { en: 'agenda',    zh: '議程' },
    { en: 'forecast',  zh: '預測' },   { en: 'colleague', zh: '同事' },
  ]},
  { name: 'Lv 2 · 進階商務字', pairs: [
    { en: 'reimburse',  zh: '報銷' },  { en: 'allocate',   zh: '分配' },
    { en: 'supervise',  zh: '監督' },  { en: 'ambitious',  zh: '有野心的' },
    { en: 'commute',    zh: '通勤' },  { en: 'terminate',  zh: '終止' },
  ]},
  { name: 'Lv 3 · 多益高分字彙', pairs: [
    { en: 'leverage',     zh: '善用' },     { en: 'contingency', zh: '應變方案' },
    { en: 'discrepancy',  zh: '差異' },     { en: 'expedite',    zh: '加速' },
    { en: 'mitigate',     zh: '減緩' },     { en: 'stakeholder', zh: '利害關係人' },
  ]},
  { name: 'Lv 4 · 金證殺手級', pairs: [
    { en: 'jeopardize',   zh: '危及' },     { en: 'streamline',  zh: '簡化流程' },
    { en: 'redundancy',   zh: '冗員/重複' }, { en: 'overhaul',    zh: '徹底翻修' },
    { en: 'compliance',   zh: '合規' },     { en: 'proxy',       zh: '代理' },
  ]},
];
const SOUND_POP = [
  { word: 'reservation',  options: ['reservation', 'restaurant', 'reception', 'recommendation'] },
  { word: 'colleague',    options: ['college', 'colleague', 'cottage', 'collage'] },
  { word: 'invoice',      options: ['involve', 'invoice', 'invent', 'invade'] },
  { word: 'deadline',     options: ['deadline', 'headline', 'beeline', 'guideline'] },
  { word: 'attached',     options: ['attached', 'attacked', 'attended', 'attempted'] },
  { word: 'available',    options: ['adorable', 'available', 'agreeable', 'achievable'] },
];
const SCRAMBLE = [
  { src: 'Please send me the report by tomorrow morning.',
    zh: '明早前請把報告寄給我。',
    alts: [
      { text: 'Kindly forward the report to me by tomorrow morning.', diff: ['Kindly', 'forward', 'to'] },
      { text: 'Could you submit the report before tomorrow morning?', diff: ['Could', 'you', 'submit', 'before', '?'] },
    ] },
  { src: 'The meeting has been rescheduled to next Monday.',
    zh: '會議已改到下週一。',
    alts: [
      { text: 'Our meeting has been moved to next Monday.', diff: ['Our', 'moved'] },
      { text: 'The meeting will be postponed until next Monday.', diff: ['will', 'be', 'postponed', 'until'] },
    ] },
  { src: 'Could you confirm the delivery date with the client?',
    zh: '能跟客戶確認交期嗎？',
    alts: [
      { text: 'Would you mind verifying the delivery date with the client?', diff: ['Would', 'mind', 'verifying'] },
      { text: 'Please double-check the delivery date with the client.', diff: ['Please', 'double-check'] },
    ] },
  { src: 'I would like to make a reservation for two people.',
    zh: '我想訂兩個人的位子。',
    alts: [
      { text: 'I\'d like to book a table for two, please.', diff: ['I\'d', 'book', 'a', 'table', 'two,', 'please'] },
      { text: 'Could I reserve a spot for two guests?', diff: ['Could', 'reserve', 'spot', 'guests'] },
    ] },
  { src: 'Our quarterly revenue increased by twelve percent.',
    zh: '本季營收成長 12%。',
    alts: [
      { text: 'Our quarterly revenue grew by twelve percent.', diff: ['grew'] },
      { text: 'Quarterly sales went up by twelve percent.', diff: ['sales', 'went', 'up'] },
    ] },
];

// ── Hub ─────────────────────────────────────────────────
function GameHub({ goNav, demo, dark, openGame }) {
  const games = [
    { id: 'word-match', icon: '🧠', emoji: '🃏', title: '單字配對', sub: 'Word Match',
      desc: '翻牌找出英中對應的單字組', time: '~2 分', pts: 80,
      best: 4, color: '#FF6B3D' },
    { id: 'sound-pop',  icon: '🔊', emoji: '🫧', title: '聽力打地鼠', sub: 'Sound Pop',
      desc: '聽英文，戳破對應的單字泡泡', time: '~1 分', pts: 100,
      best: 8, color: '#3DB8FF' },
    { id: 'word-order', icon: '🧩', emoji: '✨', title: '句子拼圖', sub: 'Word Order',
      desc: '把打散的單字排成正確順序', time: '~3 分', pts: 120,
      best: 3, color: '#9C5BC9' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)', position: 'relative', zIndex: 1 }}>
      <Navbar current="practice" onNav={goNav} demo={demo} dark={dark} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', position: 'relative' }}>
        {/* Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 48,
                      padding: 32, background: 'linear-gradient(135deg, #FFE0D4, #FFEED9)',
                      borderRadius: 28, border: '3px solid #FFCDB8',
                      boxShadow: '0 6px 0 rgba(255,107,61,0.2)' }}>
          <LeoMascot size={140} mood="cheer" wave />
          <div style={{ flex: 1 }}>
            <Eyebrow style={{ marginBottom: 8 }}>每日小遊戲 · Daily Mini Games</Eyebrow>
            <h1 style={{ fontSize: 36, marginBottom: 8 }}>每天 5 分鐘，邊玩邊學 🎮</h1>
            <p style={{ fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.7, maxWidth: 560 }}>
              短短幾分鐘的小遊戲，連續打卡可以獲得加倍點數。今日已完成 <strong style={{ color: 'var(--terra)' }}>1 / 3</strong> 場。
            </p>
            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
              <Stat label="今日點數" value="+180 PTS" />
              <Stat label="連勝" value="🔥 5 天" />
              <Stat label="最佳排名" value="#12" />
            </div>
          </div>
        </div>

        {/* Game cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {games.map(g => (
            <button key={g.id} onClick={() => openGame(g.id)} style={{
              background: '#fff', border: `3px solid ${g.color}33`, borderRadius: 24,
              padding: 28, cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-sans)', position: 'relative', overflow: 'hidden',
              boxShadow: `0 6px 0 ${g.color}33`,
              transition: 'all 200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)';
                                 e.currentTarget.style.boxShadow = `0 10px 0 ${g.color}44`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = `0 6px 0 ${g.color}33`; }}>
              <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 100, opacity: 0.1 }}>
                {g.emoji}
              </div>
              <div style={{ fontSize: 56, marginBottom: 16 }}>{g.icon}</div>
              <Eyebrow color={g.color} style={{ fontSize: 9, marginBottom: 6 }}>{g.sub}</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 22, marginBottom: 8, color: 'var(--ink)' }}>
                {g.title}
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                {g.desc}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            paddingTop: 16, borderTop: `1px dashed ${g.color}40` }}>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                  ⏱ {g.time} · 🏆 已通關 <strong style={{ color: 'var(--ink)' }}>{g.best}</strong> 次
                </div>
                <div style={{ background: g.color, color: '#fff', padding: '6px 14px', borderRadius: 9999,
                              fontSize: 11, fontWeight: 900 }}>
                  +{g.pts} PTS
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
function Stat({ label, value }) {
  return (
    <div>
      <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>{label}</Eyebrow>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18, marginTop: 4 }}>{value}</div>
    </div>
  );
}

// ── Game shell (header+exit) ────────────────────────────
function GameShell({ title, subtitle, color, onExit, children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <div style={{ background: '#fff', borderBottom: `3px solid ${color}33`, padding: '16px 24px',
                    display: 'flex', alignItems: 'center', gap: 16,
                    position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onExit} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-muted)', fontWeight: 700,
        }}>
          <Icon name="arrowLeft" size={18}/> 退出
        </button>
        <div style={{ height: 24, width: 1, background: 'var(--border)' }}/>
        <div>
          <Eyebrow color={color} style={{ fontSize: 9 }}>{subtitle}</Eyebrow>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18 }}>{title}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── 1. Word Match (left ↔ right matching, time-based scoring, infinite levels) ──
function WordMatchGame({ onExit, firePoints, fireConfetti, setDemo }) {
  const [level, setLevel] = useStateGM(0);
  const [time, setTime] = useStateGM(0);          // seconds elapsed
  const [matched, setMatched] = useStateGM([]);   // pair indices matched this level
  const [pickedLeft, setPickedLeft] = useStateGM(null);
  const [pickedRight, setPickedRight] = useStateGM(null);
  const [shake, setShake] = useStateGM(false);
  const [done, setDone] = useStateGM(false);      // current level done
  const [totalPoints, setTotalPoints] = useStateGM(0);
  const [history, setHistory] = useStateGM([]);   // [{level, time, pts}]
  const tRef = useRefGM(null);

  const levelData = WORD_LEVELS[level % WORD_LEVELS.length];
  const PAIRS = levelData.pairs;

  // Pronunciation helper — Web Speech API
  const speak = (word) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.85;
      u.pitch = 1.05;
      // Prefer a US/UK English voice if available
      const voices = synth.getVoices();
      const pref = voices.find(v => /en-US/i.test(v.lang) && /female|samantha|google|zira/i.test(v.name))
                || voices.find(v => /en-US/i.test(v.lang))
                || voices.find(v => /^en/i.test(v.lang));
      if (pref) u.voice = pref;
      synth.speak(u);
    } catch (e) { /* speech not available */ }
  };

  // randomized RIGHT-side order — frozen per level
  const rightOrder = useMemoGM(() => {
    return PAIRS.map((_, i) => i).sort(() => Math.random() - 0.5);
  }, [level]);

  // Timer
  useEffectGM(() => {
    if (done) { clearInterval(tRef.current); return; }
    tRef.current = setInterval(() => setTime(t => t + 0.1), 100);
    return () => clearInterval(tRef.current);
  }, [done, level]);

  // Match check
  useEffectGM(() => {
    if (pickedLeft === null || pickedRight === null) return;
    if (pickedLeft === pickedRight) {
      // correct
      setMatched(m => [...m, pickedLeft]);
      setPickedLeft(null);
      setPickedRight(null);
    } else {
      // wrong — shake briefly
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPickedLeft(null);
        setPickedRight(null);
      }, 500);
    }
  }, [pickedLeft, pickedRight]);

  // Level complete check
  useEffectGM(() => {
    if (matched.length === PAIRS.length && !done) {
      const t = time;
      let pts;
      if (t <= 10) pts = 1000;
      else if (t <= 30) pts = 500;
      else if (t <= 50) pts = 200;
      else if (t <= 60) pts = 100;
      else pts = 50;
      setDone(true);
      setTotalPoints(p => p + pts);
      setHistory(h => [...h, { level: level + 1, name: levelData.name, time: t, pts }]);
      setTimeout(() => {
        firePoints?.(pts, `Lv ${level + 1} 過關 · ${t.toFixed(1)}s`);
        if (pts >= 500) fireConfetti?.();
        setDemo?.(d => ({ ...d, points: d.points + pts }));
      }, 400);
    }
  }, [matched]);

  const nextLevel = () => {
    setLevel(l => l + 1);
    setTime(0);
    setMatched([]);
    setPickedLeft(null);
    setPickedRight(null);
    setDone(false);
  };
  const stop = () => {
    onExit();
  };

  // Scoring guide tiers
  const scoreTiers = [
    { max: 10, pts: 1000, label: '神速', color: '#FF1744' },
    { max: 30, pts: 500,  label: '飛快', color: '#FF6B3D' },
    { max: 50, pts: 200,  label: '普通', color: '#FFC107' },
    { max: 60, pts: 100,  label: '及格', color: '#9C5BC9' },
  ];
  const currentTier = scoreTiers.find(t => time <= t.max) || { pts: 50, label: '加油', color: '#666' };

  // Build LEFT (English in order) and RIGHT (Chinese shuffled)
  return (
    <GameShell title="單字配對" subtitle={`Word Match · ${levelData.name}`} color="#FF6B3D" onExit={onExit}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginBottom: 20, padding: '14px 20px', background: '#fff', borderRadius: 16,
                      border: '2px solid #FFCDB8', boxShadow: '0 4px 0 rgba(255,107,61,0.12)' }}>
          <Stat label="關卡" value={`Lv ${level + 1}`} />
          <Stat label="已配對" value={`${matched.length} / ${PAIRS.length}`} />
          <div>
            <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>計時</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 22,
                          color: currentTier.color, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
              {time.toFixed(1)}s
            </div>
          </div>
          <div>
            <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>目前獎勵</Eyebrow>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: currentTier.color, color: '#fff',
                          padding: '4px 12px', borderRadius: 9999, fontSize: 14, fontWeight: 900,
                          marginTop: 2 }}>
              {currentTier.label} +{currentTier.pts}
            </div>
          </div>
          <Stat label="累計" value={`${totalPoints} PTS`} />
        </div>

        {/* Score tier bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {scoreTiers.map((t, i) => {
            const active = time <= t.max && (i === 0 || time > scoreTiers[i - 1].max);
            return (
              <div key={i} style={{
                flex: 1, padding: '8px 10px', borderRadius: 10,
                background: active ? t.color : '#fff',
                border: `2px solid ${t.color}${active ? 'ff' : '40'}`,
                color: active ? '#fff' : t.color,
                fontSize: 11, fontWeight: 900, textAlign: 'center',
                transition: 'all 200ms ease',
                boxShadow: active ? `0 3px 0 ${t.color}80` : 'none',
              }}>
                ≤{t.max}s · +{t.pts}
              </div>
            );
          })}
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                      animation: shake ? 'cuteWobble 400ms ease-in-out' : 'none' }}>
          {/* LEFT — English in order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Eyebrow color="#FF6B3D" style={{ marginBottom: 4, textAlign: 'center' }}>
              English · 🔊 點按聆聽
            </Eyebrow>
            {PAIRS.map((p, i) => {
              const isMatched = matched.includes(i);
              const isPicked = pickedLeft === i;
              return (
                <button key={i} disabled={isMatched || done}
                  onClick={() => {
                    if (isMatched) return;
                    speak(p.en);
                    setPickedLeft(i);
                  }}
                  style={{
                    padding: '16px 20px', borderRadius: 14,
                    background: isMatched ? '#E8F5E9' : isPicked ? '#FF6B3D' : '#fff',
                    color: isMatched ? '#2E7D32' : isPicked ? '#fff' : 'var(--ink)',
                    border: `3px solid ${isMatched ? '#2E7D32' : isPicked ? '#C44818' : '#FFCDB8'}`,
                    fontSize: 17, fontWeight: 900, fontFamily: 'var(--font-sans)',
                    cursor: isMatched ? 'default' : 'pointer', textAlign: 'left',
                    boxShadow: isMatched ? 'none' : isPicked ? '0 3px 0 #8B2F0F' : '0 4px 0 rgba(255,107,61,0.2)',
                    transition: 'all 150ms ease',
                    opacity: isMatched ? 0.7 : 1,
                    textDecoration: isMatched ? 'line-through' : 'none',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                  <span style={{
                    width: 28, height: 28, flexShrink: 0,
                    borderRadius: 9999,
                    background: isMatched ? 'transparent' : isPicked ? 'rgba(255,255,255,0.25)' : '#FFEED9',
                    color: isMatched ? '#2E7D32' : isPicked ? '#fff' : '#FF6B3D',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13,
                  }}>{isMatched ? '✓' : '🔊'}</span>
                  <span style={{ flex: 1 }}>{p.en}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT — Chinese shuffled */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Eyebrow color="#9C5BC9" style={{ marginBottom: 4, textAlign: 'center' }}>中文 · 隨機</Eyebrow>
            {rightOrder.map((pairIdx, slot) => {
              const isMatched = matched.includes(pairIdx);
              const isPicked = pickedRight === pairIdx;
              return (
                <button key={slot} disabled={isMatched || done}
                  onClick={() => !isMatched && setPickedRight(pairIdx)}
                  style={{
                    padding: '16px 20px', borderRadius: 14,
                    background: isMatched ? '#E8F5E9' : isPicked ? '#9C5BC9' : '#fff',
                    color: isMatched ? '#2E7D32' : isPicked ? '#fff' : 'var(--ink)',
                    border: `3px solid ${isMatched ? '#2E7D32' : isPicked ? '#6B3D8F' : '#DDB8F0'}`,
                    fontSize: 17, fontWeight: 900, fontFamily: 'var(--font-serif)',
                    cursor: isMatched ? 'default' : 'pointer', textAlign: 'left',
                    boxShadow: isMatched ? 'none' : isPicked ? '0 3px 0 #4A2A65' : '0 4px 0 rgba(156,91,201,0.2)',
                    transition: 'all 150ms ease',
                    opacity: isMatched ? 0.7 : 1,
                    textDecoration: isMatched ? 'line-through' : 'none',
                  }}>
                  {PAIRS[pairIdx].zh} {isMatched && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Done banner */}
        {done && (
          <div style={{ marginTop: 24, padding: 28, background: '#fff', borderRadius: 24,
                        border: '3px solid #FFCDB8', textAlign: 'center',
                        boxShadow: '0 6px 0 rgba(255,107,61,0.18)',
                        animation: 'slideUp 400ms ease-out both' }}>
            <LeoMascot size={110} mood="cheer" wave />
            <h2 style={{ marginTop: 6 }}>{currentTier.label}！🎉</h2>
            <div style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 6 }}>
              Lv {level + 1} 完成 · 用時 <strong style={{ color: currentTier.color }}>{time.toFixed(1)}s</strong>
            </div>
            <div style={{ display: 'inline-block', marginTop: 14, padding: '12px 28px',
                          background: currentTier.color, color: '#fff', borderRadius: 9999,
                          fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 24,
                          boxShadow: `0 4px 0 ${currentTier.color}aa` }}>
              +{history[history.length - 1]?.pts || 0} PTS
            </div>

            {/* Mini history */}
            {history.length > 1 && (
              <div style={{ marginTop: 20, padding: 14, background: '#FFF8F0', borderRadius: 12,
                            border: '1px solid #FFCDB8' }}>
                <Eyebrow style={{ marginBottom: 10 }}>本場戰績</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                                           fontSize: 12, padding: '4px 10px',
                                           background: '#fff', borderRadius: 8 }}>
                      <span style={{ fontWeight: 700 }}>Lv {h.level} · {h.name.split('·')[1]?.trim()}</span>
                      <span style={{ color: 'var(--ink-muted)' }}>{h.time.toFixed(1)}s</span>
                      <span style={{ fontWeight: 900, color: '#FF6B3D' }}>+{h.pts}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                                 fontSize: 13, padding: '6px 10px', marginTop: 4,
                                 background: '#FF6B3D', color: '#fff', borderRadius: 8,
                                 fontWeight: 900 }}>
                    <span>累計</span>
                    <span>{totalPoints} PTS</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22 }}>
              <Button variant="outline" onClick={stop}>結束 · 帶走點數</Button>
              <Button variant="primary" onClick={nextLevel} icon="arrowRight">
                下一關（{WORD_LEVELS[(level + 1) % WORD_LEVELS.length].name.split('·')[0].trim()}）
              </Button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

// ── 2. Sound Pop ───────────────────────────────────────
function SoundPopGame({ onExit, firePoints, fireConfetti, setDemo }) {
  const ROUNDS = SOUND_POP;
  const [round, setRound] = useStateGM(0);
  const [score, setScore] = useStateGM(0);
  const [feedback, setFeedback] = useStateGM(null); // 'right'|'wrong'|null
  const [done, setDone] = useStateGM(false);
  const [bubbles, setBubbles] = useStateGM([]);
  const [played, setPlayed] = useStateGM(false);
  const r = ROUNDS[round];

  useEffectGM(() => {
    // randomize bubble layout each round
    const slots = [
      { x: 15, y: 40, d: 0 }, { x: 70, y: 35, d: 0.4 },
      { x: 35, y: 65, d: 0.8 }, { x: 80, y: 70, d: 1.2 },
    ];
    const opts = [...r.options].sort(() => Math.random() - 0.5);
    setBubbles(opts.map((o, i) => ({ word: o, ...slots[i] })));
    setFeedback(null);
    setPlayed(false);
  }, [round]);

  const speak = () => {
    setPlayed(true);
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(r.word);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  // auto-speak on round entry
  useEffectGM(() => { const t = setTimeout(speak, 400); return () => clearTimeout(t); }, [round]);

  const pop = (word) => {
    if (feedback) return;
    if (word === r.word) {
      setFeedback('right');
      setScore(s => s + 1);
      setTimeout(() => {
        if (round + 1 >= ROUNDS.length) {
          setDone(true);
          const pts = (score + 1) * 20;
          firePoints?.(pts, '聽力打地鼠通關');
          if (score + 1 >= 5) fireConfetti?.();
          setDemo?.(d => ({ ...d, points: d.points + pts }));
        } else setRound(round + 1);
      }, 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  return (
    <GameShell title="聽力打地鼠" subtitle="Sound Pop · 戳破正確的單字泡泡" color="#3DB8FF" onExit={onExit}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24,
                      padding: '14px 20px', background: '#fff', borderRadius: 16,
                      border: '2px solid #B8E0FF', boxShadow: '0 4px 0 rgba(61,184,255,0.15)' }}>
          <Stat label="進度" value={`${round + 1} / ${ROUNDS.length}`} />
          <Stat label="得分" value={`${score} 顆`} />
          <button onClick={speak} style={{
            background: '#3DB8FF', color: '#fff', border: 'none', borderRadius: 12,
            padding: '8px 18px', fontWeight: 900, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 3px 0 #1A8FCC',
          }}>
            <Icon name="volume" size={18}/> 重聽
          </button>
        </div>

        <div style={{
          position: 'relative', height: 460, background: 'linear-gradient(180deg, #E0F4FF, #B8E0FF)',
          borderRadius: 24, border: '3px solid #B8E0FF', overflow: 'hidden',
          boxShadow: feedback === 'wrong' ? '0 0 0 6px rgba(198,40,40,0.3)' :
                     feedback === 'right' ? '0 0 0 6px rgba(46,125,50,0.3)' :
                     '0 4px 0 rgba(61,184,255,0.15)',
          transition: 'box-shadow 200ms ease',
        }}>
          {/* Speaker prompt */}
          <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.92)', padding: '12px 24px', borderRadius: 9999,
                        fontSize: 13, fontWeight: 700, color: '#1A6FA0',
                        display: 'flex', alignItems: 'center', gap: 10,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Icon name="volume" size={18}/> 點擊聽到的單字
          </div>

          {/* Bubbles */}
          {bubbles.map((b, i) => (
            <button key={`${round}-${i}`} onClick={() => pop(b.word)}
              style={{
                position: 'absolute', left: `${b.x}%`, top: `${b.y}%`,
                background: '#fff', border: '4px solid #3DB8FF',
                borderRadius: 9999, padding: '20px 28px',
                fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: 18,
                color: '#1A6FA0', cursor: feedback ? 'default' : 'pointer',
                boxShadow: '0 5px 0 #3DB8FF',
                animation: `cuteBob ${3 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${b.d}s`,
                whiteSpace: 'nowrap',
              }}>
              {b.word}
            </button>
          ))}

          {/* Feedback */}
          {feedback === 'right' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 80, animation: 'cuteHeart 800ms ease-out' }}>✅</div>
          )}
          {feedback === 'wrong' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 80, animation: 'cuteWobble 400ms ease-in-out' }}>❌</div>
          )}
        </div>

        {done && (
          <div style={{ marginTop: 24, padding: 32, background: '#fff', borderRadius: 24,
                        border: '3px solid #B8E0FF', textAlign: 'center',
                        boxShadow: '0 6px 0 rgba(61,184,255,0.2)' }}>
            <LeoMascot size={120} mood="cheer" wave />
            <h2>耳朵超棒！🎧</h2>
            <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginTop: 6 }}>
              {score} / {ROUNDS.length} 全聽對！
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
              <Button variant="outline" onClick={onExit}>回到遊戲列表</Button>
              <Button variant="primary" onClick={() => window.location.reload()} icon="arrowRight">再玩一次</Button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

// ── 3. Word Order ──────────────────────────────────────
function WordOrderGame({ onExit, firePoints, fireConfetti, setDemo }) {
  const ROUNDS = SCRAMBLE.slice(0, 4);
  const [round, setRound] = useStateGM(0);
  const [score, setScore] = useStateGM(0);
  const [done, setDone] = useStateGM(false);
  const r = ROUNDS[round];

  // Tokens: array of {w, used}
  const [tokens, setTokens] = useStateGM([]);
  const [picked, setPicked] = useStateGM([]); // indices into tokens
  const [submitted, setSubmitted] = useStateGM(null); // null|'right'|'wrong'

  useEffectGM(() => {
    const words = r.src.replace(/\.$/, '').split(' ');
    const shuffled = words
      .map((w, i) => ({ w, key: Math.random() }))
      .sort((a, b) => a.key - b.key)
      .map(({ w }) => w);
    setTokens(shuffled.map(w => ({ w })));
    setPicked([]);
    setSubmitted(null);
  }, [round]);

  const pick = (i) => {
    if (submitted) return;
    if (picked.includes(i)) return;
    setPicked([...picked, i]);
  };
  const undo = (idx) => {
    if (submitted) return;
    setPicked(picked.filter((_, j) => j !== idx));
  };
  const submit = () => {
    const phrase = picked.map(i => tokens[i].w).join(' ');
    const target = r.src.replace(/\.$/, '');
    const ok = phrase === target;
    setSubmitted(ok ? 'right' : 'wrong');
    if (ok) setScore(s => s + 1);
    setTimeout(() => {
      if (round + 1 >= ROUNDS.length) {
        setDone(true);
        const pts = (score + (ok ? 1 : 0)) * 30;
        firePoints?.(pts, '句子拼圖通關');
        if (score + (ok ? 1 : 0) >= 3) fireConfetti?.();
        setDemo?.(d => ({ ...d, points: d.points + pts }));
      } else setRound(round + 1);
    }, 1600);
  };
  const reveal = () => {
    const target = r.src.replace(/\.$/, '').split(' ');
    const order = target.map(w => tokens.findIndex((t, i) => t.w === w && !picked.includes(i)));
    // simpler: just mark wrong and show
    setSubmitted('wrong');
    setTimeout(() => {
      if (round + 1 >= ROUNDS.length) setDone(true);
      else setRound(round + 1);
    }, 2000);
  };

  return (
    <GameShell title="句子拼圖" subtitle="Word Order · 排出正確的英文句子" color="#9C5BC9" onExit={onExit}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24,
                      padding: '14px 20px', background: '#fff', borderRadius: 16,
                      border: '2px solid #DDB8F0', boxShadow: '0 4px 0 rgba(156,91,201,0.15)' }}>
          <Stat label="進度" value={`${round + 1} / ${ROUNDS.length}`} />
          <Stat label="正確" value={`${score} 句`} />
          <Stat label="本題提示" value={r.zh} />
        </div>

        {/* Picked area */}
        <div style={{
          minHeight: 100, padding: 18,
          background: '#fff',
          border: `3px ${submitted ? 'solid' : 'dashed'} ${
            submitted === 'right' ? '#2E7D32' : submitted === 'wrong' ? '#C62828' : '#DDB8F0'}`,
          borderRadius: 18, marginBottom: 16,
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
          boxShadow: submitted === 'right' ? '0 0 0 4px rgba(46,125,50,0.2)' :
                     submitted === 'wrong' ? '0 0 0 4px rgba(198,40,40,0.2)' :
                     '0 3px 0 rgba(156,91,201,0.12)',
          animation: submitted === 'wrong' ? 'cuteWobble 400ms ease-in-out' : 'none',
        }}>
          {picked.length === 0 && (
            <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic', fontSize: 13 }}>
              點下方單字依序排成英文句子…
            </span>
          )}
          {picked.map((tIdx, i) => (
            <button key={i} onClick={() => undo(i)} style={{
              background: '#9C5BC9', color: '#fff', border: 'none',
              padding: '10px 16px', borderRadius: 10, fontWeight: 900, fontSize: 16,
              boxShadow: '0 3px 0 #6B3D8F', cursor: submitted ? 'default' : 'pointer',
              fontFamily: 'var(--font-sans)',
            }}>{tokens[tIdx]?.w}</button>
          ))}
        </div>

        {/* Token bank */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          {tokens.map((t, i) => {
            const used = picked.includes(i);
            return (
              <button key={i} onClick={() => pick(i)} disabled={used || !!submitted} style={{
                background: used ? 'var(--paper-muted)' : '#fff',
                color: used ? 'var(--ink-faint)' : 'var(--ink)',
                border: `2px solid ${used ? 'var(--border)' : '#DDB8F0'}`,
                padding: '12px 18px', borderRadius: 12, fontWeight: 700, fontSize: 16,
                boxShadow: used ? 'none' : '0 3px 0 rgba(156,91,201,0.25)',
                cursor: (used || submitted) ? 'default' : 'pointer',
                fontFamily: 'var(--font-sans)',
                opacity: used ? 0.4 : 1,
              }}>{t.w}</button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="ghost" onClick={() => setPicked([])} disabled={!!submitted || picked.length === 0}>
            清空
          </Button>
          <Button variant="primary" onClick={submit}
                  disabled={!!submitted || picked.length !== tokens.length}
                  icon="check">
            送出答案
          </Button>
        </div>

        {submitted && (
          <div style={{ marginTop: 20, padding: 16, borderRadius: 14, textAlign: 'center',
                        background: submitted === 'right' ? '#E8F5E9' : '#FFEBEE',
                        border: `2px solid ${submitted === 'right' ? '#2E7D32' : '#C62828'}` }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>{submitted === 'right' ? '🎉' : '😅'}</div>
            <div style={{ fontWeight: 900, fontSize: 14 }}>
              {submitted === 'right' ? '完全正確！' : `正確答案：${r.src}`}
            </div>
          </div>
        )}

        {done && (
          <div style={{ marginTop: 24, padding: 32, background: '#fff', borderRadius: 24,
                        border: '3px solid #DDB8F0', textAlign: 'center',
                        boxShadow: '0 6px 0 rgba(156,91,201,0.2)' }}>
            <LeoMascot size={120} mood="cheer" wave />
            <h2>句子達人！✨</h2>
            <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginTop: 6 }}>
              答對 {score} / {ROUNDS.length} 句
            </p>

            {/* Alternative phrasings review */}
            <div style={{ marginTop: 28, textAlign: 'left' }}>
              <Eyebrow color="#9C5BC9" style={{ marginBottom: 12, textAlign: 'center' }}>
                ✨ 同義替換句 · Alternative Phrasings
              </Eyebrow>
              <p style={{ fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center', marginBottom: 20 }}>
                同樣意思可以這樣換句話說，<strong style={{ background: '#FFF3A0', padding: '1px 4px', borderRadius: 3 }}>底色標記</strong>的字是和原句不同的地方
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ROUNDS.map((round, ri) => (
                  <div key={ri} style={{
                    background: '#FAF5FF', border: '2px solid #DDB8F0',
                    borderRadius: 16, padding: 18,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ background: '#9C5BC9', color: '#fff', width: 24, height: 24,
                                     borderRadius: 9999, display: 'flex', alignItems: 'center',
                                     justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>
                        {ri + 1}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{round.zh}</span>
                    </div>
                    {/* Original */}
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: '#9C5BC9',
                                     letterSpacing: '0.1em', marginRight: 8 }}>原句</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                        {round.src}
                      </span>
                    </div>
                    {/* Alts */}
                    {round.alts && round.alts.map((alt, ai) => {
                      const diffSet = new Set(alt.diff || []);
                      const words = alt.text.split(' ');
                      return (
                        <div key={ai} style={{ marginTop: 6, paddingLeft: 8,
                                                borderLeft: '3px solid #DDB8F0' }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: '#9C5BC9',
                                         letterSpacing: '0.1em', marginRight: 8 }}>
                            替換 {ai + 1}
                          </span>
                          <span style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink)' }}>
                            {words.map((w, wi) => {
                              const cleaned = w.replace(/[.,?!]$/, '');
                              const isAlt = diffSet.has(w) || diffSet.has(cleaned);
                              return (
                                <span key={wi} style={{
                                  background: isAlt ? '#FFF3A0' : 'transparent',
                                  padding: isAlt ? '2px 5px' : 0,
                                  borderRadius: 4, marginRight: 4,
                                  fontWeight: isAlt ? 900 : 500,
                                  color: isAlt ? '#7C2D12' : 'var(--ink)',
                                  border: isAlt ? '1px solid #FFD700' : 'none',
                                }}>{w}</span>
                              );
                            })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
              <Button variant="outline" onClick={onExit}>回到遊戲列表</Button>
              <Button variant="primary" onClick={() => window.location.reload()} icon="arrowRight">再玩一次</Button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}

Object.assign(window, { GameHub, WordMatchGame, SoundPopGame, WordOrderGame });
