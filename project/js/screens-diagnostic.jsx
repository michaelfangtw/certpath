// Diagnostic flow — intro, in-test, and result reveal with radar animation
const { useState: useStateD, useEffect: useEffectD, useMemo: useMemoD } = React;

function DiagnosticIntro({ goNav }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 720, width: '100%' }}>
        <PaperCard accent="top-terra" style={{ padding: 56, textAlign: 'center' }}>
          <Eyebrow style={{ marginBottom: 16 }}>Placement Test · 程度診斷</Eyebrow>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
          <h1 style={{ fontSize: 36, marginBottom: 16 }}>15 題快速診斷</h1>
          <p style={{ fontSize: 16, color: 'var(--ink-muted)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
            這是你的第一次練習 — 我們會根據你在聽力與閱讀的表現，預測你目前的程度，
            並為你規劃最佳學習路徑。
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { e: '🎧', l: '聽力 · Part 1-4', v: '7 題' },
              { e: '📖', l: '閱讀 · Part 5-7', v: '8 題' },
              { e: '⏱️', l: '預估時間', v: '約 18 分' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 20, background: 'var(--paper-muted)', borderRadius: 12,
                                     border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.e}</div>
                <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 6 }}>{s.l}</Eyebrow>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18 }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--terra-05)', border: '1px solid var(--terra-20)',
                        borderRadius: 12, padding: 16, marginBottom: 32, textAlign: 'left' }}>
            <Eyebrow style={{ marginBottom: 8 }}>💡 提示</Eyebrow>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.8 }}>
              <li>請在不受打擾的環境作答，並戴上耳機</li>
              <li>若不確定可猜，系統會根據作答速度與正確率推算程度</li>
              <li>診斷結束後將顯示能力雷達圖與證書預測</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="ghost" onClick={() => goNav('dashboard')}>稍後再做</Button>
            <Button variant="primary" onClick={() => goNav('diagnostic')} icon="arrowRight"
                    style={{ fontSize: 16, padding: '14px 32px' }}>
              開始診斷
            </Button>
          </div>
        </PaperCard>
      </div>
    </div>
  );
}

function DiagnosticScreen({ goNav, setDiagResult }) {
  const items = DIAGNOSTIC;
  const [idx, setIdx] = useStateD(0);
  const [answers, setAnswers] = useStateD({}); // {qid: 'A'/'B'/...}
  const q = items[idx];
  const total = items.length;
  const selected = answers[q.id];

  const choose = key => setAnswers(a => ({ ...a, [q.id]: key }));
  const next = () => {
    if (idx < total - 1) setIdx(idx + 1);
    else {
      // compute result
      const lItems = items.filter(i => i.skill === 'listening');
      const rItems = items.filter(i => i.skill === 'reading');
      const lCorrect = lItems.filter(i => answers[i.id] === i.correct).length;
      const rCorrect = rItems.filter(i => answers[i.id] === i.correct).length;
      const wrong = items.filter(i => answers[i.id] && answers[i.id] !== i.correct);
      setDiagResult({
        lCorrect, lTotal: lItems.length, rCorrect, rTotal: rItems.length,
        listening: scaleListening(lCorrect, lItems.length),
        reading: scaleReading(rCorrect, rItems.length),
        answers, wrong,
      });
      goNav('diagnostic-result');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)', paddingBottom: 80 }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px', height: 80,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge>Placement Test · 程度診斷</Badge>
            <div style={{ height: 16, width: 1, background: 'var(--border)' }} />
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16 }}>
              Part {q.part} · {q.skill === 'listening' ? '聽力' : '閱讀'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Eyebrow color="var(--ink-muted)">{idx + 1} / {total}</Eyebrow>
          </div>
        </div>
        <div style={{ height: 4, background: 'var(--paper-muted)' }}>
          <div style={{ height: '100%', background: 'var(--terra)',
                        width: `${((idx + 1) / total) * 100}%`,
                        transition: 'width 400ms var(--ease-out)' }} />
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 24px' }}>
        {/* Q dot navigator */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
          {items.map((it, i) => {
            const answered = !!answers[it.id];
            const active = i === idx;
            return (
              <button key={it.id} onClick={() => setIdx(i)} style={{
                width: 28, height: 28, borderRadius: 8, border: '2px solid',
                borderColor: active ? 'var(--terra)' : answered ? 'var(--ink)' : 'var(--border)',
                background: active ? 'var(--terra)' : answered ? 'var(--ink)' : 'var(--paper-card)',
                color: active || answered ? '#fff' : 'var(--ink-muted)',
                cursor: 'pointer', fontWeight: 900, fontSize: 11,
                transform: active ? 'translateY(-3px)' : 'none',
              }}>{i + 1}</button>
            );
          })}
        </div>

        <PaperCard key={q.id} style={{ padding: 40, animation: 'slideUp 300ms var(--ease-out) both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <Badge variant={q.diff === 'gold' ? 'gold' : q.diff === 'blue' ? 'blue' : 'green'}>
              {q.diff === 'gold' ? '高難度' : q.diff === 'blue' ? '中級' : '基礎'}
            </Badge>
            <Eyebrow color="var(--ink-muted)">Section {q.part}</Eyebrow>
          </div>

          {/* Listening: photo / audio */}
          {q.part === 1 && <Part1Photo />}
          {q.skill === 'listening' && <AudioPlayer transcript={q.audio} />}
          {q.skill === 'listening' && q.question && (
            <p style={{ fontSize: 17, fontWeight: 700, marginTop: 28, color: 'var(--ink)' }}>
              {q.question}
            </p>
          )}

          {/* Reading: passage / blank */}
          {q.skill === 'reading' && q.passage && (
            <div style={{ background: 'var(--paper-muted)', padding: 24, borderRadius: 12,
                          borderLeft: '3px solid var(--terra)', marginBottom: 24,
                          fontFamily: 'Georgia, serif', fontSize: 14, lineHeight: 1.8,
                          color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
              {q.passage}
            </div>
          )}
          {q.skill === 'reading' && q.content && (
            <p style={{ fontSize: 17, color: 'var(--ink)', marginBottom: 24, lineHeight: 1.7 }}>
              {q.content}
            </p>
          )}
          {q.skill === 'reading' && q.question && (
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
              {q.blank || q.question}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
            {Object.entries(q.options).map(([key, text]) => {
              const isSel = selected === key;
              return (
                <button key={key} onClick={() => choose(key)} style={{
                  width: '100%', textAlign: 'left', padding: '14px 18px',
                  borderRadius: 12, border: `1px solid ${isSel ? 'var(--terra)' : 'var(--border)'}`,
                  background: isSel ? 'var(--terra-05)' : 'var(--paper-card)',
                  color: isSel ? 'var(--ink)' : 'var(--ink-muted)',
                  fontWeight: 500, fontSize: 14, cursor: 'pointer',
                  boxShadow: isSel ? '0 0 0 1px var(--terra)' : 'none',
                  transition: 'all 200ms var(--ease-out)',
                  fontFamily: 'var(--font-sans)',
                }}>
                  <span style={{ fontWeight: 900, marginRight: 12, color: isSel ? 'var(--terra)' : 'var(--ink)' }}>
                    ({key})
                  </span>
                  {text}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32,
                        paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <Button variant="ghost" onClick={() => idx > 0 && setIdx(idx - 1)} disabled={idx === 0} iconLeft="arrowLeft">
              上一題
            </Button>
            <Button variant="primary" onClick={next} disabled={!selected} icon="arrowRight">
              {idx === total - 1 ? '完成診斷' : '下一題'}
            </Button>
          </div>
        </PaperCard>
      </div>
    </div>
  );
}

function DiagnosticResult({ goNav, result, setDemo }) {
  const [stage, setStage] = useStateD(0); // 0: counting, 1: radar, 2: cert, 3: coach
  const total = (result?.listening || 0) + (result?.reading || 0);
  const tier = tierFromScore(total);
  const lScore = useCountUp(result?.listening || 0, 1400);
  const rScore = useCountUp(result?.reading || 0, 1400);
  const totalScore = lScore + rScore;

  useEffectD(() => {
    const t1 = setTimeout(() => setStage(1), 1500);
    const t2 = setTimeout(() => setStage(2), 2400);
    const t3 = setTimeout(() => setStage(3), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const radar = useMemoD(() => {
    if (!result) return [0.5, 0.5, 0.5, 0.5, 0.5];
    const lAcc = result.lCorrect / result.lTotal;
    const rAcc = result.rCorrect / result.rTotal;
    return [lAcc, rAcc, (lAcc + rAcc) / 2 - 0.05, lAcc * 0.95 + 0.05, rAcc * 0.9];
  }, [result]);

  const enterDashboard = () => {
    if (setDemo && result) {
      setDemo({
        ...DEMO_TIERS.intermediate,
        firstName: 'Angela', name: 'Angela', avatar: 'A',
        listening: result.listening, reading: result.reading,
        predicted: total, tier, accuracy: Math.round(((result.lCorrect + result.rCorrect) / 15) * 100),
        radar, points: 250, streak: 1, daysLeft: 60, completed: 1,
      });
    }
    goNav('dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Eyebrow style={{ marginBottom: 16 }}>Diagnostic Complete · 診斷完成</Eyebrow>
          <h1 className="display" style={{ fontSize: 56, marginBottom: 12 }}>
            🎉 你的初始程度
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 18, fontWeight: 500 }}>
            根據 15 題作答結果，這是 AI 教練的預測
          </p>
        </div>

        {/* Score reveal */}
        <PaperCard accent="top-terra" style={{
          padding: 48, marginBottom: 32, textAlign: 'center',
          background: 'linear-gradient(to bottom, var(--terra-05), var(--paper-card))',
        }}>
          <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 12 }}>Predicted TOEIC Score</Eyebrow>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 120,
                        color: 'var(--terra)', lineHeight: 1, letterSpacing: '-0.04em',
                        fontVariantNumeric: 'tabular-nums' }}>
            {totalScore}
            <span style={{ fontSize: 32, color: 'var(--ink-muted)' }}> / 990</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginTop: 32, maxWidth: 480, margin: '32px auto 0' }}>
            <div style={{ padding: 16, background: 'var(--paper-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <Eyebrow color="var(--ink-muted)">Listening · 聽力</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 36,
                            color: 'var(--ink)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                {lScore}<span style={{ fontSize: 14, color: 'var(--ink-muted)' }}>/495</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>
                {result?.lCorrect} / {result?.lTotal} 題正確
              </div>
            </div>
            <div style={{ padding: 16, background: 'var(--paper-card)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <Eyebrow color="var(--ink-muted)">Reading · 閱讀</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 36,
                            color: 'var(--ink)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                {rScore}<span style={{ fontSize: 14, color: 'var(--ink-muted)' }}>/495</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>
                {result?.rCorrect} / {result?.rTotal} 題正確
              </div>
            </div>
          </div>
        </PaperCard>

        {/* Radar + Cert side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <PaperCard accent="double" style={{
            padding: 32, opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 600ms var(--ease-out)',
          }}>
            <h3 style={{ marginBottom: 4 }}>能力雷達圖</h3>
            <Eyebrow color="var(--ink-muted)" style={{ letterSpacing: '0.2em', marginBottom: 16 }}>
              Capability Mapping
            </Eyebrow>
            <RadarChartAnimated scores={radar} animate={stage >= 1} />
          </PaperCard>

          <div style={{
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? 'scale(1)' : 'scale(0.85)',
            transition: 'all 600ms var(--ease-out)',
          }}>
            <PaperCard accent="top-terra" style={{ padding: 32, height: '100%', textAlign: 'center',
                                                     display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 12 }}>Your Current Tier</Eyebrow>
              <div style={{ fontSize: 72, marginBottom: 8 }}>{TIER[tier].emoji}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 28,
                            color: TIER[tier].text, marginBottom: 4 }}>
                {TIER[tier].label}
              </div>
              <Eyebrow color="var(--ink-muted)" style={{ marginTop: 8 }}>Score Range</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16, marginTop: 4 }}>
                {TIER[tier].range}
              </div>
              <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '20px 0' }} />
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                {tier === 'gold' ? '🚀 起點極佳！我們將為你規劃 990 衝頂計畫。' :
                 tier === 'blue' ? '💪 已具商務應用能力，距金證僅一步之遙。' :
                 tier === 'green' ? '🌱 基礎扎實，照表操課可以快速進階。' :
                 '🎯 起步也是進步。我們會從零幫你建立信心。'}
              </div>
            </PaperCard>
          </div>
        </div>

        {/* AI coach */}
        <PaperCard accent="left-terra" style={{
          padding: 32, opacity: stage >= 3 ? 1 : 0,
          transform: stage >= 3 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 600ms var(--ease-out)',
        }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--terra)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, boxShadow: 'var(--shadow-terra)' }}>
              <Icon name="bot" size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: 4 }}>AI 教練評語</h3>
              <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 16 }}>Coach Insight</Eyebrow>
              <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.8 }}>
                <p style={{ marginBottom: 12 }}>
                  ✅ <strong>強項：</strong>{result?.rCorrect > result?.lCorrect
                    ? '閱讀能力比聽力穩定，文法判斷尚可。'
                    : '聽力反應靈敏，對日常商務情境掌握度佳。'}
                </p>
                <p style={{ marginBottom: 12 }}>
                  ⚠️ <strong>弱點：</strong>{result?.wrong?.length > 6
                    ? `共答錯 ${result.wrong.length} 題，建議從「弱點偵查復仇」區補強 Part 2 與 Part 7 的推論題型。`
                    : `多益新題型中的「間接回答」與「跨文章推論」需要加練。`}
                </p>
                <p>
                  🎯 <strong>建議：</strong>每日 22 題、連續 14 天，可將分數提升至 <strong style={{ color: 'var(--terra)' }}>{Math.min(990, total + 80)}</strong> 分。
                </p>
              </div>
            </div>
          </div>
        </PaperCard>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <Button variant="primary" onClick={enterDashboard} icon="arrowRight"
                  style={{ fontSize: 16, padding: '14px 32px' }}>
            進入學習總覽
          </Button>
        </div>
      </main>
    </div>
  );
}

function RadarChartAnimated({ scores, animate }) {
  const labels = ['聽力', '文法', '推論', '細節', '速度'];
  const cx = 120, cy = 120, r = 90;
  const angle = i => (Math.PI * 2 * i) / 5 - Math.PI / 2;
  const pt = (val, i) => [cx + r * val * Math.cos(angle(i)), cy + r * val * Math.sin(angle(i))];
  const ring = val => Array.from({ length: 5 }, (_, i) => pt(val, i).join(',')).join(' ');
  const target = scores.map((s, i) => pt(s, i).join(',')).join(' ');
  const start = scores.map((_, i) => pt(0.05, i).join(',')).join(' ');

  return (
    <svg viewBox="0 0 240 240" style={{ width: '100%', height: 'auto' }}>
      {[0.25, 0.5, 0.75, 1].map((v, i) => (
        <polygon key={i} points={ring(v)} fill="none" stroke="var(--border)" strokeWidth="1" />
      ))}
      {labels.map((_, i) => {
        const [x, y] = pt(1, i);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />;
      })}
      <polygon points={animate ? target : start} fill="rgba(175,76,47,0.18)" stroke="var(--terra)" strokeWidth="2"
               style={{ transition: 'all 1200ms var(--ease-out)' }} />
      {scores.map((s, i) => {
        const [x, y] = pt(animate ? s : 0.05, i);
        return <circle key={i} cx={x} cy={y} r="4" fill="var(--terra)"
                       style={{ transition: 'all 1200ms var(--ease-out)' }} />;
      })}
      {labels.map((l, i) => {
        const [x, y] = pt(1.2, i);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                     style={{ fontSize: 11, fontWeight: 900, fill: 'var(--ink)',
                              fontFamily: 'var(--font-serif)' }}>{l}</text>;
      })}
    </svg>
  );
}

window.DiagnosticIntro = DiagnosticIntro;
window.DiagnosticScreen = DiagnosticScreen;
window.DiagnosticResult = DiagnosticResult;
window.RadarChartAnimated = RadarChartAnimated;
