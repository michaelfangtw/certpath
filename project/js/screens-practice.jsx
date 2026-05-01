// Practice center, quiz runner, and results screen
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

function PracticeCenter({ goNav, demo, dark }) {
  const sections = [
    { p: 'Part 1', title: '照片描述', count: 6, time: '~3 min', skill: 'listening', icon: 'image', desc: '看圖選出最符合的描述' },
    { p: 'Part 2', title: '應答問題', count: 25, time: '~12 min', skill: 'listening', icon: 'message', desc: '針對問句選最佳回答' },
    { p: 'Part 3', title: '簡短對話', count: 39, time: '~18 min', skill: 'listening', icon: 'users', desc: '雙人/三人對話理解' },
    { p: 'Part 4', title: '簡短獨白', count: 30, time: '~14 min', skill: 'listening', icon: 'mic', desc: '單人廣播、講話內容' },
    { p: 'Part 5', title: '單句填空', count: 30, time: '~10 min', skill: 'reading', icon: 'edit', desc: '文法 + 詞彙判斷' },
    { p: 'Part 6', title: '段落填空', count: 16, time: '~10 min', skill: 'reading', icon: 'fileText', desc: '文章上下文填空' },
    { p: 'Part 7', title: '單篇/多篇', count: 54, time: '~50 min', skill: 'reading', icon: 'book', desc: '單篇、雙篇、三篇文章閱讀' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <Navbar current="practice" onNav={goNav} demo={demo} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32 }}>
          <Eyebrow>Practice Center</Eyebrow>
          <h1>練習中心</h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 16, fontWeight: 500, marginTop: 6 }}>
            選擇你想加強的題型 — 系統會自動依你的弱點推薦題目
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32, marginBottom: 32 }}>
          {/* Listening */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 10, background: 'var(--terra)', color: '#fff', borderRadius: 12 }}>
                <Icon name="headphones" size={20} />
              </div>
              <div>
                <Eyebrow>Listening</Eyebrow>
                <h2 style={{ fontSize: 20 }}>聽力測驗</h2>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <Eyebrow color="var(--ink-muted)">Score</Eyebrow>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18 }}>
                  {demo.listening}<span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>/495</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sections.filter(s => s.skill === 'listening').map(s => (
                <PracticeRow key={s.p} sec={s} onClick={() => goNav('quiz')} />
              ))}
            </div>
          </div>

          {/* Reading */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 10, background: 'var(--ink)', color: '#fff', borderRadius: 12 }}>
                <Icon name="book" size={20} />
              </div>
              <div>
                <Eyebrow>Reading</Eyebrow>
                <h2 style={{ fontSize: 20 }}>閱讀測驗</h2>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <Eyebrow color="var(--ink-muted)">Score</Eyebrow>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18 }}>
                  {demo.reading}<span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>/495</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sections.filter(s => s.skill === 'reading').map(s => (
                <PracticeRow key={s.p} sec={s} onClick={() => goNav('quiz')} />
              ))}
            </div>
          </div>
        </div>

        {/* Oral Conversation Practice — featured */}
        <SectionHeader title="口說練習" eyebrow="Oral Conversation · AI Roleplay" right={
          <Badge variant="terra">NEW</Badge>
        } />
        <PaperCard accent="left-terra" hover onClick={() => goNav('ai-conversation')}
          style={{ marginBottom: 32, padding: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -20, fontSize: 180,
                        opacity: 0.06, transform: 'rotate(-8deg)', pointerEvents: 'none' }}>🗣️</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'center',
                         position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ padding: 12, background: 'var(--terra)', color: '#fff',
                              borderRadius: 14, boxShadow: '0 4px 0 rgba(196,72,24,0.3)' }}>
                  <Icon name="mic" size={22} />
                </div>
                <div>
                  <Eyebrow color="var(--terra)">AI Conversation Coach</Eyebrow>
                  <h2 style={{ fontSize: 22, marginTop: 2 }}>真實情境口說演練</h2>
                </div>
              </div>
              <p style={{ color: 'var(--ink-muted)', fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>
                跟 AI 用英文對話 — 商務會議、客戶簡報、面試、機場 check-in 等 6 大情境。
                每一輪都會給你發音、文法、表達流暢度評分與建議。
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                {[
                  { tag: '💼 商務會議' },
                  { tag: '🎤 簡報演練' },
                  { tag: '✈️ 旅遊情境' },
                  { tag: '☕ 日常閒聊' },
                  { tag: '🤝 面試練習' },
                  { tag: '📞 電話應對' },
                ].map(t => (
                  <span key={t.tag} style={{
                    padding: '6px 12px', background: 'var(--paper-muted)',
                    borderRadius: 9999, fontSize: 12, fontWeight: 700,
                    border: '1px solid var(--border)',
                  }}>{t.tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 20,
                            paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div>
                  <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>每場時間</Eyebrow>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16 }}>
                    5 – 8 min
                  </div>
                </div>
                <div>
                  <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>對話輪數</Eyebrow>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16 }}>
                    6 – 10 輪
                  </div>
                </div>
                <div>
                  <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>完成獎勵</Eyebrow>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16, color: 'var(--terra)' }}>
                    +150 PTS
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Button variant="primary" icon="arrowRight"
                          onClick={(e) => { e.stopPropagation(); goNav('ai-conversation'); }}>
                    開始對話
                  </Button>
                </div>
              </div>
            </div>

            {/* Mock chat preview */}
            <div style={{ background: 'var(--paper-muted)', borderRadius: 16, padding: 16,
                          border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                             paddingBottom: 10, borderBottom: '1px dashed var(--border)' }}>
                <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: 9999,
                               animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)' }}>
                  AI · Sarah is online
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ alignSelf: 'flex-start', maxWidth: '85%',
                               background: '#fff', padding: '10px 14px', borderRadius: 14,
                               borderBottomLeftRadius: 4, fontSize: 12.5, lineHeight: 1.5,
                               border: '1px solid var(--border)' }}>
                  Hi! Thanks for joining today's meeting. Could you walk me through your Q3 forecast?
                </div>
                <div style={{ alignSelf: 'flex-end', maxWidth: '85%',
                               background: 'var(--terra)', color: '#fff',
                               padding: '10px 14px', borderRadius: 14,
                               borderBottomRightRadius: 4, fontSize: 12.5, lineHeight: 1.5 }}>
                  Sure. We're projecting a 12% revenue lift driven by the new SaaS tier...
                </div>
                <div style={{ alignSelf: 'flex-end', display: 'flex', gap: 6, fontSize: 10, fontWeight: 800 }}>
                  <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '2px 8px', borderRadius: 9999 }}>
                    流暢度 92
                  </span>
                  <span style={{ background: '#FFF8E1', color: '#F57C00', padding: '2px 8px', borderRadius: 9999 }}>
                    文法 88
                  </span>
                </div>
                <div style={{ alignSelf: 'flex-start', maxWidth: '70%',
                               background: '#fff', padding: '8px 14px', borderRadius: 14,
                               borderBottomLeftRadius: 4, fontSize: 11,
                               border: '1px solid var(--border)', color: 'var(--ink-muted)',
                               fontStyle: 'italic' }}>
                  💬 Sarah is typing...
                </div>
              </div>
            </div>
          </div>
        </PaperCard>

        {/* Daily Quest card */}
        <PaperCard accent="left-terra" hover onClick={() => goNav('daily-quest')}
          style={{ marginBottom: 20, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 20,
                   background: 'linear-gradient(135deg, rgba(21,101,192,0.04), var(--paper-card))' }}>
          <div style={{ fontSize: 36, flexShrink: 0 }}>🗓️</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Eyebrow color="#1565C0">Daily Quest · 每日任務</Eyebrow>
              <Badge variant="terra">今日</Badge>
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>聽說讀寫 × 間隔重複 × 視覺化單字</h3>
            <p style={{ color: 'var(--ink-muted)', fontSize: 13, lineHeight: 1.5 }}>每天 6 個高頻單字，依記憶曲線排程複習，模式每日輪換不重複。</p>
          </div>
          <Button variant="primary" style={{ flexShrink: 0 }} icon="arrowRight"
                  onClick={e => { e.stopPropagation(); goNav('daily-quest'); }}>開始</Button>
        </PaperCard>

        {/* Shadowing card */}
        <PaperCard accent="left-terra" hover onClick={() => goNav('shadowing')}
          style={{ marginBottom: 32, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{ padding: 14, background: '#2E7D32', color: '#fff',
                          borderRadius: 14, boxShadow: '0 4px 0 rgba(27,94,32,0.3)', flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>🎧</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Eyebrow color="#2E7D32">Shadowing · 跟讀訓練</Eyebrow>
                <Badge variant="green">NEW</Badge>
              </div>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>跟讀練習 — 節奏 × 語調 × 精準度</h2>
              <p style={{ color: 'var(--ink-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                閱讀目標句子 → 默念複誦 → 憑記憶輸入 → 逐字比對精準度。
                訓練你的語感與連音，讓口說更流暢自然。
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div>
                  <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>主題數</Eyebrow>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16 }}>4 主題</div>
                </div>
                <div>
                  <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>每組句數</Eyebrow>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16 }}>5–6 句</div>
                </div>
                <div>
                  <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>完成獎勵</Eyebrow>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16, color: '#2E7D32' }}>
                    +50–150 PTS
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Button variant="primary" style={{ background: '#2E7D32', boxShadow: '0 4px 0 rgba(27,94,32,0.3)' }}
                          icon="arrowRight" onClick={e => { e.stopPropagation(); goNav('shadowing'); }}>
                    開始跟讀
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PaperCard>

        {/* Mini features row */}
        <SectionHeader title="特殊訓練" eyebrow="Specialty Training" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: 'hash', title: '單字閃卡', desc: '間隔記憶，每日 30 張', tag: 'SRS' },
            { icon: 'target', title: '弱點復仇', desc: '重做歷史錯題', tag: 'AI 推薦' },
            { icon: 'zap', title: '極限挑戰', desc: '5 分鐘 22 題 +500 PTS', tag: '今日 ×2' },
          ].map(f => (
            <PaperCard key={f.title} accent="left-terra" hover onClick={() => goNav('quiz')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ padding: 8, background: 'var(--paper-muted)', color: 'var(--terra)',
                              borderRadius: 10 }}>
                  <Icon name={f.icon} size={18} />
                </div>
                <Badge>{f.tag}</Badge>
              </div>
              <h3 style={{ fontSize: 16 }}>{f.title}</h3>
              <p style={{ color: 'var(--ink-muted)', fontSize: 12, marginTop: 4 }}>{f.desc}</p>
            </PaperCard>
          ))}
        </div>
      </main>
    </div>
  );
}

function PracticeRow({ sec, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: 16,
      background: 'var(--paper-card)', border: '1px solid var(--border)',
      borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
      transition: 'all 200ms var(--ease-out)', fontFamily: 'var(--font-sans)',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--terra)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--paper-muted)',
                    color: 'var(--terra)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={sec.icon} size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
          <Badge style={{ fontSize: 9 }}>{sec.p}</Badge>
          <h3 style={{ fontSize: 15, margin: 0 }}>{sec.title}</h3>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{sec.desc}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14 }}>{sec.count} 題</div>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{sec.time}</div>
      </div>
      <Icon name="arrowRight" size={18} style={{ color: 'var(--terra)' }} />
    </button>
  );
}

function QuizScreen({ goNav, demo, setQuizResult }) {
  const items = QUIZ_PARTS.slice(0, 6); // 6 questions
  const [idx, setIdx] = useStateP(0);
  const [answers, setAnswers] = useStateP({});
  const [revealed, setRevealed] = useStateP({});
  const [streak, setStreak] = useStateP(0);
  const [timer, setTimer] = useStateP(0);
  const tRef = useRefP();
  const q = items[idx];
  const sel = answers[q.id];
  const isRev = revealed[q.id];

  useEffectP(() => {
    tRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(tRef.current);
  }, []);

  const choose = key => {
    if (isRev) return;
    setAnswers(a => ({ ...a, [q.id]: key }));
  };
  const submit = () => {
    if (!sel || isRev) return;
    setRevealed(r => ({ ...r, [q.id]: true }));
    if (sel === q.correct) setStreak(s => s + 1); else setStreak(0);
  };
  const next = () => {
    if (idx < items.length - 1) setIdx(idx + 1);
    else {
      const correct = items.filter(i => answers[i.id] === i.correct).length;
      setQuizResult({
        items, answers, correct, total: items.length,
        time: timer, streak, points: 100 + correct * 30 + (streak >= 3 ? 50 : 0),
      });
      goNav('quiz-result');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 72,
                      display: 'flex', alignItems: 'center', gap: 24 }}>
          <button onClick={() => goNav('practice')} style={{ background: 'transparent', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  color: 'var(--ink-muted)', fontWeight: 700, fontSize: 13 }}>
            <Icon name="x" size={16} /> 退出
          </button>
          <Badge>Part {q.part} · {q.skill === 'listening' ? '聽力' : '閱讀'}</Badge>
          <div style={{ flex: 1, height: 6, background: 'var(--paper-muted)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((idx + (isRev ? 1 : 0)) / items.length) * 100}%`,
                          background: 'var(--terra)', transition: 'width 400ms var(--ease-out)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {streak >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4,
                            color: 'var(--terra)', fontWeight: 900, fontSize: 13,
                            animation: 'pulseGold 1.5s infinite' }}>
                🔥 {streak} 連對
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
              {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
            </div>
            <Eyebrow color="var(--ink-muted)">{idx + 1} / {items.length}</Eyebrow>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 880, margin: '0 auto', padding: '40px 24px' }}>
        <PaperCard key={q.id} style={{ padding: 40, animation: 'slideUp 300ms var(--ease-out) both' }}>
          {q.part === 1 && <Part1Photo kind={q.photo?.kind} />}
          {q.skill === 'listening' && <AudioPlayer transcript={q.audio} />}
          {q.skill === 'listening' && q.question && (
            <p style={{ fontSize: 17, fontWeight: 700, marginTop: 28 }}>{q.question}</p>
          )}
          {q.skill === 'reading' && q.passage && (
            <div style={{ background: 'var(--paper-muted)', padding: 24, borderRadius: 12,
                          borderLeft: '3px solid var(--terra)', marginBottom: 24,
                          fontFamily: 'Georgia, serif', fontSize: 14, lineHeight: 1.8,
                          whiteSpace: 'pre-wrap' }}>{q.passage}</div>
          )}
          {q.skill === 'reading' && q.content && (
            <p style={{ fontSize: 16, marginBottom: 20, lineHeight: 1.7 }}>{q.content}</p>
          )}
          {q.skill === 'reading' && (q.blank || q.question) && (
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{q.blank || q.question}</p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
            {Object.entries(q.options).map(([key, text]) => {
              const isSel = sel === key;
              const isCorrect = key === q.correct;
              let bg = 'var(--paper-card)', border = 'var(--border)', color = 'var(--ink-muted)';
              if (isRev) {
                if (isCorrect) { bg = 'rgba(46,125,50,0.08)'; border = 'var(--state-success)'; color = 'var(--ink)'; }
                else if (isSel) { bg = 'rgba(198,40,40,0.06)'; border = 'var(--state-error)'; color = 'var(--ink)'; }
              } else if (isSel) {
                bg = 'var(--terra-05)'; border = 'var(--terra)'; color = 'var(--ink)';
              }
              return (
                <button key={key} onClick={() => choose(key)} disabled={isRev} style={{
                  textAlign: 'left', padding: '14px 18px', borderRadius: 12,
                  border: `1px solid ${border}`, background: bg, color,
                  fontWeight: 500, fontSize: 14, cursor: isRev ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  fontFamily: 'var(--font-sans)',
                }}>
                  <span style={{ fontWeight: 900, color: isSel || (isRev && isCorrect) ? 'var(--terra)' : 'var(--ink)' }}>
                    ({key})
                  </span>
                  <span style={{ flex: 1 }}>{text}</span>
                  {isRev && isCorrect && <Icon name="check" size={18} style={{ color: 'var(--state-success)' }} />}
                  {isRev && isSel && !isCorrect && <Icon name="x" size={18} style={{ color: 'var(--state-error)' }} />}
                </button>
              );
            })}
          </div>

          {isRev && (
            <div style={{ marginTop: 24, padding: 16, background: 'var(--paper-muted)',
                          borderRadius: 12, borderLeft: '3px solid var(--terra)',
                          animation: 'slideUp 400ms var(--ease-out) both' }}>
              <Eyebrow style={{ marginBottom: 8 }}>📚 解析</Eyebrow>
              <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>{q.explain}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28,
                        paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <Button variant="ghost" onClick={() => goNav('practice')}>退出</Button>
            {!isRev ? (
              <Button variant="primary" onClick={submit} disabled={!sel}>送出答案</Button>
            ) : (
              <Button variant="primary" onClick={next} icon="arrowRight">
                {idx === items.length - 1 ? '查看成績' : '下一題'}
              </Button>
            )}
          </div>
        </PaperCard>
      </main>
    </div>
  );
}

function QuizResult({ goNav, demo, result, setDemo, fireConfetti, firePoints }) {
  const [stage, setStage] = useStateP(0);
  const correct = result?.correct || 0;
  const total = result?.total || 6;
  const acc = Math.round((correct / total) * 100);
  const accCount = useCountUp(acc, 1200);
  const ptsCount = useCountUp(result?.points || 0, 1500);

  useEffectP(() => {
    setTimeout(() => setStage(1), 400);
    setTimeout(() => setStage(2), 1400);
    setTimeout(() => {
      fireConfetti?.();
      firePoints?.(result?.points || 0, '練習獎勵');
    }, 600);
    if (setDemo && demo) {
      setTimeout(() => {
        setDemo(d => {
          const newCompletedToday = (d.completedToday || 0) + 1;
          try {
            const today = new Date().toISOString().slice(0, 10);
            localStorage.setItem('certpath_daily_completed', JSON.stringify({ date: today, count: newCompletedToday }));
          } catch {}
          return {
            ...d,
            points: d.points + (result?.points || 0),
            completed: d.completed + 1,
            completedToday: newCompletedToday,
            accuracy: Math.round((d.accuracy * d.completed + acc) / (d.completed + 1)),
          };
        });
      }, 1800);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32,
                      animation: 'slideUp 500ms var(--ease-out) both' }}>
          <div style={{ fontSize: 64, marginBottom: 16,
                        animation: 'bounce 1s var(--ease-out)' }}>
            {acc >= 80 ? '🏆' : acc >= 60 ? '👏' : '💪'}
          </div>
          <Eyebrow style={{ marginBottom: 12 }}>Round Complete · 練習結束</Eyebrow>
          <h1 style={{ fontSize: 40, marginBottom: 8 }}>
            {acc >= 80 ? '太強了！' : acc >= 60 ? '不錯的表現' : '繼續加油'}
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 15 }}>
            完成於 {Math.floor((result?.time || 0) / 60)} 分 {(result?.time || 0) % 60} 秒
          </p>
        </div>

        <PaperCard accent="top-terra" style={{ padding: 40, marginBottom: 24,
                   background: 'linear-gradient(to bottom, var(--terra-05), var(--paper-card))' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 8 }}>正確率</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 56,
                            color: 'var(--terra)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {accCount}<span style={{ fontSize: 22 }}>%</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
                {correct} / {total} 題正確
              </div>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)' }}>
              <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 8 }}>獲得點數</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 56,
                            color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                +{ptsCount}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
                {result?.streak >= 3 && '🔥 連對加成 +50'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 8 }}>連對最高</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 56,
                            color: 'var(--state-success)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {result?.streak || 0}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>連續答對</div>
            </div>
          </div>
        </PaperCard>

        {/* Question review */}
        <div style={{ opacity: stage >= 2 ? 1 : 0, transition: 'opacity 500ms' }}>
          <SectionHeader title="題目回顧" eyebrow="Question Review" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result?.items?.map((q, i) => {
              const ans = result.answers[q.id];
              const right = ans === q.correct;
              return (
                <PaperCard key={q.id} style={{ padding: 20, borderLeft: `4px solid ${right ? 'var(--state-success)' : 'var(--state-error)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9999,
                                  background: right ? 'var(--state-success)' : 'var(--state-error)',
                                  color: '#fff', display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={right ? 'check' : 'x'} size={16} stroke={2.5} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Eyebrow>第 {i + 1} 題 · Part {q.part}</Eyebrow>
                        {!right && <Badge variant="terra">已加入錯題本</Badge>}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 4 }}>
                        {q.question || q.blank || (q.passage ? q.passage.slice(0, 60) + '…' : '聽力題')}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                        {right ? `✓ 答對 (${ans})` : `你選 (${ans || '–'})，正確 (${q.correct})`}
                      </div>
                    </div>
                  </div>
                </PaperCard>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
          <Button variant="outline" onClick={() => goNav('practice')}>再來一場</Button>
          <Button variant="primary" onClick={() => goNav('dashboard')} icon="arrowRight">
            返回總覽
          </Button>
        </div>
      </main>
    </div>
  );
}

window.PracticeCenter = PracticeCenter;
window.QuizScreen = QuizScreen;
window.QuizResult = QuizResult;
