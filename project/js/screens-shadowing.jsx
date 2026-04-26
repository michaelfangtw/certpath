// Shadowing Practice — listen-and-repeat sentence training for fluency
const { useState: useStateSH, useEffect: useEffectSH, useRef: useRefSH, useCallback: useCallbackSH } = React;

const SHADOWING_SETS = [
  {
    id: 'business-phrases',
    icon: '💼', tag: 'BUSINESS',
    title: 'Business Meeting',
    desc: '商務會議常用句型，練習流暢度與語調',
    level: 'gold',
    sentences: [
      { text: "Could you walk us through the key revenue numbers?", tip: "stress 'walk', 'key', 'revenue'" },
      { text: "The main blocker is the delayed product launch.", tip: "pause after 'blocker'" },
      { text: "Our customer churn dropped to 3.2%, our best quarter on record.", tip: "rising tone on numbers" },
      { text: "What support do you need from leadership to accelerate the timeline?", tip: "stress 'support' and 'accelerate'" },
      { text: "I'd like to highlight that our enterprise renewals drove most of the growth.", tip: "natural linking: 'I'd like to'" },
      { text: "Are there any risks to the Q4 forecast we should be aware of?", tip: "question intonation: rise then fall" },
    ],
  },
  {
    id: 'travel-phrases',
    icon: '✈️', tag: 'TRAVEL',
    title: 'Airport & Hotel',
    desc: '旅行情境：機場、飯店、日常應對',
    level: 'blue',
    sentences: [
      { text: "I have a reservation under Wang. Three nights, checking out on Friday.", tip: "pause after 'Wang'" },
      { text: "Could you upgrade me to a room with a view?", tip: "polite rising intonation on request" },
      { text: "I'm here for a business conference, staying for five days.", tip: "link 'here for' smoothly" },
      { text: "Do you have anything to declare — cash, agricultural products, or commercial goods?", tip: "list intonation: rise, rise, fall" },
      { text: "My connecting flight to Seattle departs at 6:45 PM from Terminal 2.", tip: "stress departure time and terminal" },
    ],
  },
  {
    id: 'interview-phrases',
    icon: '🤝', tag: 'CAREER',
    title: 'Job Interview',
    desc: '面試英文：自我介紹、強項、薪資協商',
    level: 'gold',
    sentences: [
      { text: "I'm a marketing specialist with five years of experience in B2B SaaS.", tip: "confident, steady pace" },
      { text: "I led a campaign that increased qualified leads by 40% in one quarter.", tip: "stress the metric '40%'" },
      { text: "My biggest strength is translating data insights into clear action plans.", tip: "stress 'translating' and 'clear'" },
      { text: "I thrive in cross-functional environments where collaboration drives results.", tip: "smooth linking throughout" },
      { text: "Based on my research, a range of 85 to 95 thousand aligns with market data.", tip: "confident, no upward question intonation" },
    ],
  },
  {
    id: 'daily-phrases',
    icon: '☕', tag: 'DAILY',
    title: 'Daily Conversations',
    desc: '生活英文：餐廳、電話、社交閒聊',
    level: 'green',
    sentences: [
      { text: "I'd like to make a reservation for two at 7 PM this Saturday.", tip: "polite request, clear time stress" },
      { text: "One of us is vegetarian — do you have plant-based options?", tip: "pause at the dash" },
      { text: "Could I get the check, please? We're in a bit of a rush.", tip: "stress 'rush' with falling tone" },
      { text: "Sorry to keep you waiting. The line was longer than I expected.", tip: "apologetic tone, falling intonation" },
      { text: "That's a great point — I hadn't thought about it from that angle.", tip: "stress 'great' and 'angle'" },
    ],
  },
];

// Normalize text for comparison: lowercase, strip punctuation
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function tokenize(str) {
  return normalize(str).split(/\s+/).filter(Boolean);
}

// Word-by-word diff between target and typed
function diffWords(target, typed) {
  const tWords = tokenize(target);
  const uWords = tokenize(typed);
  return tWords.map((word, i) => ({
    word,
    status: uWords[i] === undefined ? 'pending' : uWords[i] === word ? 'correct' : 'wrong',
    typed: uWords[i],
  }));
}

function ShadowingHub({ goNav, demo, dark, onPickSet }) {
  return (
    <div style={{ minHeight: '100vh', background: dark ? '#1a1612' : 'var(--paper-base)' }}>
      <Navbar current="practice" onNav={goNav} demo={demo} dark={dark} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32,
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <Eyebrow>Shadowing · 跟讀練習</Eyebrow>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              跟讀訓練
              <span style={{ background: '#2E7D32', color: '#fff', fontSize: 11, fontWeight: 900,
                              padding: '4px 10px', borderRadius: 6, letterSpacing: '0.1em' }}>
                NEW
              </span>
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: 16, marginTop: 6 }}>
              逐句跟讀，訓練語感、節奏與發音精準度。輸入你所聽到的句子，即時比對正確率。
            </p>
          </div>
        </div>

        {/* What is shadowing */}
        <div style={{
          padding: '20px 28px', marginBottom: 40, borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(46,125,50,0.06), var(--paper-card))',
          border: '1px solid rgba(46,125,50,0.2)', borderLeft: '6px solid #2E7D32',
          display: 'flex', alignItems: 'flex-start', gap: 20,
        }}>
          <div style={{ fontSize: 36 }}>🎧</div>
          <div>
            <Eyebrow style={{ marginBottom: 6 }}>什麼是跟讀 (Shadowing)?</Eyebrow>
            <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.7 }}>
              <strong>跟讀法</strong>由語言學家 Alexander Arguelles 推廣 — 看著句子，逐字複誦，
              強迫大腦同時處理<strong>節奏、語調、連音</strong>，是提升口說流暢度最快的方式之一。
              每次練習完成可獲得 <strong style={{ color: '#2E7D32' }}>+50–150 PTS</strong>。
            </div>
          </div>
        </div>

        {/* How it works */}
        <SectionHeader title="練習步驟" eyebrow="How It Works" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 48 }}>
          {[
            { n: 1, t: '閱讀句子', d: '看目標句子，注意語調提示' },
            { n: 2, t: '默念複誦', d: '在心裡或大聲跟讀一次' },
            { n: 3, t: '輸入句子', d: '憑記憶輸入你所複誦的內容' },
            { n: 4, t: '即時比對', d: '系統逐字對比，給出精準度分數' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9999, background: '#2E7D32',
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

        {/* Sets */}
        <SectionHeader title="練習主題" eyebrow={`Shadowing Sets · ${SHADOWING_SETS.length} topics`} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {SHADOWING_SETS.map(set => {
            const tier = TIER[set.level];
            return (
              <PaperCard key={set.id} accent="left-terra" hover onClick={() => onPickSet(set)}
                         style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: 24 }}>
                <div style={{ fontSize: 40, flexShrink: 0 }}>{set.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Eyebrow style={{ fontSize: 9 }}>{set.tag}</Eyebrow>
                    <span style={{ background: tier.tint, color: tier.text, fontSize: 9, fontWeight: 900,
                                   padding: '2px 8px', borderRadius: 4, letterSpacing: '0.08em' }}>
                      {tier.label.replace('證書', '')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{set.title}</h3>
                  <p style={{ color: 'var(--ink-muted)', fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
                    {set.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                      🔤 {set.sentences.length} 句 · ~3 分鐘
                    </div>
                    <div style={{ color: 'var(--terra)', fontWeight: 700, fontSize: 13,
                                  display: 'flex', alignItems: 'center', gap: 6 }}>
                      開始 <Icon name="arrowRight" size={14} />
                    </div>
                  </div>
                </div>
              </PaperCard>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function ShadowingRunner({ goNav, demo, set, firePoints, fireConfetti, setDemo, dark }) {
  const [idx, setIdx] = useStateSH(0);
  const [phase, setPhase] = useStateSH('read');   // 'read' | 'type' | 'result' | 'done'
  const [typed, setTyped] = useStateSH('');
  const [scores, setScores] = useStateSH([]);
  const [revealed, setRevealed] = useStateSH(false);
  const [countdown, setCountdown] = useStateSH(3);
  const inputRef = useRefSH();
  const timerRef = useRefSH();
  const [elapsed, setElapsed] = useStateSH(0);
  const elapsedRef = useRefSH();

  const sentence = set.sentences[idx];
  const target = sentence.text;
  const diff = diffWords(target, typed);
  const correctCount = diff.filter(w => w.status === 'correct').length;
  const accuracy = Math.round((correctCount / diff.length) * 100);

  // Auto-focus input when entering type phase
  useEffectSH(() => {
    if (phase === 'type') {
      setTyped('');
      setElapsed(0);
      elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => clearInterval(elapsedRef.current);
  }, [phase]);

  // Countdown before revealing
  useEffectSH(() => {
    if (phase !== 'read') return;
    setCountdown(3);
    setRevealed(false);
  }, [idx]);

  const startCountdown = () => {
    setRevealed(true);
    let c = 3;
    setCountdown(c);
    timerRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current);
        setPhase('type');
      }
    }, 1000);
  };

  const submitAnswer = useCallbackSH(() => {
    clearInterval(elapsedRef.current);
    const words = tokenize(target);
    const correctWords = diff.filter(w => w.status === 'correct').length;
    const acc = Math.round((correctWords / words.length) * 100);
    const speed = Math.max(0, 100 - elapsed * 2);
    const pts = Math.round(acc * 0.7 + speed * 0.3);
    setScores(s => [...s, { accuracy: acc, speed: elapsed, pts, text: typed }]);
    setPhase('result');
  }, [typed, target, diff, elapsed]);

  const nextSentence = () => {
    if (idx + 1 >= set.sentences.length) {
      const total = [...scores].reduce((a, b) => a + b.pts, 0);
      const avgAcc = Math.round(scores.reduce((a, b) => a + b.accuracy, 0) / scores.length);
      firePoints?.(total, '跟讀完成');
      if (avgAcc >= 80) fireConfetti?.();
      setTimeout(() => setDemo?.(d => ({ ...d, points: d.points + total, completed: d.completed + 1 })), 800);
      setPhase('done');
    } else {
      setIdx(i => i + 1);
      setPhase('read');
    }
  };

  const totalScored = scores.reduce((a, b) => a + b.pts, 0);
  const avgAcc = scores.length ? Math.round(scores.reduce((a, b) => a + b.accuracy, 0) / scores.length) : 0;

  // Done screen
  if (phase === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--paper-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PaperCard accent="top-terra" style={{ padding: 48, maxWidth: 560, width: '100%', textAlign: 'center',
                                               animation: 'slideUp 500ms var(--ease-out) both' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {avgAcc >= 85 ? '🎙️' : avgAcc >= 65 ? '👏' : '💪'}
          </div>
          <Eyebrow style={{ marginBottom: 8 }}>跟讀完成 · Shadowing Complete</Eyebrow>
          <h2 style={{ marginBottom: 4 }}>平均精準度 {avgAcc}%</h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 24 }}>
            {avgAcc >= 85 ? '✨ 語感極佳！你的跟讀精準度達到進階水準。' :
             avgAcc >= 65 ? '不錯！多注意連音與節奏，精準度可以更高。' :
             '繼續練習，跟讀需要反覆訓練才能內化。'}
          </p>

          {/* Per-sentence summary */}
          <div style={{ textAlign: 'left', marginBottom: 28 }}>
            {set.sentences.map((s, i) => {
              const sc = scores[i];
              if (!sc) return null;
              return (
                <div key={i} style={{ padding: '10px 14px', marginBottom: 8, borderRadius: 10,
                                      background: sc.accuracy >= 80 ? 'rgba(46,125,50,0.06)' : 'rgba(198,40,40,0.06)',
                                      border: `1px solid ${sc.accuracy >= 80 ? 'rgba(46,125,50,0.2)' : 'rgba(198,40,40,0.2)'}`,
                                      fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>句 {i + 1}</span>
                    <span style={{ color: sc.accuracy >= 80 ? '#2E7D32' : 'var(--state-error)', fontWeight: 900 }}>
                      {sc.accuracy}%
                    </span>
                  </div>
                  <div style={{ color: 'var(--ink-muted)', fontSize: 11, lineHeight: 1.4 }}>
                    {s.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="outline" onClick={() => { setIdx(0); setScores([]); setPhase('read'); }}>
              再練一次
            </Button>
            <Button variant="primary" onClick={() => goNav('shadowing')} icon="arrowRight">
              換主題
            </Button>
          </div>
        </PaperCard>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--paper-card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 72,
                      display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={() => goNav('shadowing')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--ink-muted)', fontWeight: 700, fontSize: 13,
          }}>
            <Icon name="arrowLeft" size={16} /> 退出
          </button>
          <div style={{ height: 24, width: 1, background: 'var(--border)' }} />
          <div style={{ fontSize: 24 }}>{set.icon}</div>
          <div>
            <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>{set.tag} · Shadowing</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 15 }}>
              {set.title}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 24, fontSize: 12 }}>
            <div>
              <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>Sentence</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14 }}>
                {idx + 1} / {set.sentences.length}
              </div>
            </div>
            {scores.length > 0 && (
              <div>
                <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>Avg Accuracy</Eyebrow>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: '#2E7D32' }}>
                  {avgAcc}%
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--paper-muted)' }}>
          <div style={{ height: '100%', width: `${((idx + (phase === 'done' ? 1 : 0)) / set.sentences.length) * 100}%`,
                        background: '#2E7D32', transition: 'width 400ms var(--ease-out)' }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, width: '100%' }}>

          {/* READ phase */}
          {phase === 'read' && (
            <div style={{ animation: 'slideUp 300ms var(--ease-out) both' }}>
              <Eyebrow style={{ textAlign: 'center', marginBottom: 16 }}>Step 1 · 閱讀並複誦</Eyebrow>
              <PaperCard accent="top-terra" style={{ padding: 40, textAlign: 'center', marginBottom: 24 }}>
                {!revealed ? (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 20 }}>🎧</div>
                    <p style={{ color: 'var(--ink-muted)', fontSize: 15, marginBottom: 28 }}>
                      準備好了嗎？點擊下方顯示句子，閱讀後大聲複誦。
                    </p>
                    <Button variant="primary" onClick={startCountdown}>
                      顯示句子 → 開始倒數
                    </Button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 22, fontFamily: 'var(--font-serif)', fontWeight: 700,
                                  lineHeight: 1.6, marginBottom: 20, color: 'var(--ink)' }}>
                      "{target}"
                    </div>
                    <div style={{ padding: '10px 18px', background: 'rgba(46,125,50,0.08)',
                                  border: '1px solid rgba(46,125,50,0.2)', borderRadius: 8,
                                  fontSize: 13, color: 'var(--ink-muted)', marginBottom: 24 }}>
                      💡 Tip: {sentence.tip}
                    </div>
                    <div style={{ fontSize: 48, fontFamily: 'var(--font-serif)', fontWeight: 900,
                                  color: countdown <= 1 ? 'var(--state-error)' : 'var(--terra)',
                                  marginBottom: 8 }}>
                      {countdown}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                      秒後進入輸入模式…
                    </div>
                  </>
                )}
              </PaperCard>
            </div>
          )}

          {/* TYPE phase */}
          {phase === 'type' && (
            <div style={{ animation: 'slideUp 300ms var(--ease-out) both' }}>
              <Eyebrow style={{ textAlign: 'center', marginBottom: 16 }}>Step 2 · 憑記憶輸入句子</Eyebrow>

              {/* Word diff preview */}
              <PaperCard style={{ padding: 28, marginBottom: 20, minHeight: 100 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', alignItems: 'center' }}>
                  {diff.map((w, i) => (
                    <span key={i} style={{
                      fontSize: 18, fontFamily: 'var(--font-serif)', fontWeight: 700,
                      padding: '2px 6px', borderRadius: 6,
                      background: w.status === 'correct' ? 'rgba(46,125,50,0.12)' :
                                  w.status === 'wrong'   ? 'rgba(198,40,40,0.1)' :
                                  'var(--paper-muted)',
                      color: w.status === 'correct' ? '#2E7D32' :
                             w.status === 'wrong'   ? 'var(--state-error)' :
                             'var(--ink-faint)',
                      borderBottom: w.status === 'wrong' ? '2px solid var(--state-error)' : 'none',
                      transition: 'all 150ms',
                    }}>
                      {w.word}
                    </span>
                  ))}
                </div>
                {typed && (
                  <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-muted)' }}>
                    精準度 {accuracy}% · {correctCount}/{diff.length} 字正確
                  </div>
                )}
              </PaperCard>

              {/* Input */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    ref={inputRef}
                    value={typed}
                    onChange={e => setTyped(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(); } }}
                    placeholder="輸入你複誦的句子… (Enter 送出)"
                    rows={2}
                    style={{
                      width: '100%', resize: 'none',
                      padding: '14px 16px', borderRadius: 12,
                      border: '1px solid var(--border)', background: 'var(--paper-card)',
                      fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6,
                      color: 'var(--ink)', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#2E7D32'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4, textAlign: 'right' }}>
                    {String(Math.floor(elapsed / 60)).padStart(2,'0')}:{String(elapsed % 60).padStart(2,'0')} · ⏎ to submit
                  </div>
                </div>
                <Button variant="primary" onClick={submitAnswer} disabled={!typed.trim()}
                        style={{ height: 52, padding: '0 20px', flexShrink: 0 }}>
                  送出
                </Button>
              </div>
            </div>
          )}

          {/* RESULT phase */}
          {phase === 'result' && (() => {
            const sc = scores[scores.length - 1];
            return (
              <div style={{ animation: 'slideUp 300ms var(--ease-out) both' }}>
                <Eyebrow style={{ textAlign: 'center', marginBottom: 16 }}>結果 · Result</Eyebrow>
                <PaperCard accent={sc.accuracy >= 80 ? 'top-terra' : 'left-terra'} style={{ padding: 32, marginBottom: 24 }}>
                  {/* Score */}
                  <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 28 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 48, fontFamily: 'var(--font-serif)', fontWeight: 900,
                                    color: sc.accuracy >= 80 ? '#2E7D32' : sc.accuracy >= 55 ? 'var(--terra)' : 'var(--state-error)' }}>
                        {sc.accuracy}%
                      </div>
                      <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>精準度</Eyebrow>
                    </div>
                    <div style={{ width: 1, background: 'var(--border)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 48, fontFamily: 'var(--font-serif)', fontWeight: 900, color: 'var(--terra)' }}>
                        +{sc.pts}
                      </div>
                      <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>PTS 獲得</Eyebrow>
                    </div>
                  </div>

                  {/* Word-by-word result */}
                  <div style={{ marginBottom: 20 }}>
                    <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9, marginBottom: 10 }}>逐字比對</Eyebrow>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px' }}>
                      {diffWords(target, sc.text).map((w, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-serif)',
                            padding: '4px 8px', borderRadius: 6,
                            background: w.status === 'correct' ? 'rgba(46,125,50,0.12)' : 'rgba(198,40,40,0.1)',
                            color: w.status === 'correct' ? '#2E7D32' : 'var(--state-error)',
                          }}>
                            {w.word}
                          </div>
                          {w.status === 'wrong' && w.typed && (
                            <div style={{ fontSize: 10, color: 'var(--state-error)', marginTop: 2, textDecoration: 'line-through' }}>
                              {w.typed}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Original sentence */}
                  <div style={{ padding: '12px 16px', background: 'var(--paper-muted)', borderRadius: 8,
                                fontSize: 14, color: 'var(--ink-muted)', fontStyle: 'italic', marginBottom: 16 }}>
                    ✅ 標準句："{target}"
                  </div>

                  {/* Tip */}
                  <div style={{ padding: '10px 16px', background: 'rgba(46,125,50,0.06)',
                                border: '1px solid rgba(46,125,50,0.2)', borderRadius: 8,
                                fontSize: 13, color: 'var(--ink-muted)' }}>
                    💡 語調提示：{sentence.tip}
                  </div>
                </PaperCard>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Button variant="outline" onClick={() => setPhase('read')}>重練這句</Button>
                  <Button variant="primary" onClick={nextSentence} icon="arrowRight">
                    {idx + 1 >= set.sentences.length ? '查看總結' : '下一句'}
                  </Button>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}

window.ShadowingHub = ShadowingHub;
window.ShadowingRunner = ShadowingRunner;
