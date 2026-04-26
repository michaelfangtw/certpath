// Dashboard with all the new features
const { useState: useStateDb, useEffect: useEffectDb } = React;

function DashboardScreen({ goNav, demo, theme, dark, openCoach }) {
  const cert = TIER[theme || demo.tier];
  const rival = findRival(demo.points || 0, 12);
  return (
    <div style={{ minHeight: '100vh', background: dark ? '#1a1612' : 'var(--paper-base)' }}>
      <Navbar current="dashboard" onNav={goNav} demo={demo} dark={dark} />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Catch-up alert — show when rival is within 200 PTS */}
        {rival.gap <= 200 && (
          <CatchUpBanner rival={rival} demo={demo} dark={dark} goNav={goNav} />
        )}

        {/* Welcome */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                      gap: 32, borderBottom: '1px solid var(--border)', paddingBottom: 32, marginBottom: 40 }}>
          <div>
            <Eyebrow style={{ marginBottom: 8 }}>Student Dashboard</Eyebrow>
            <h1 style={{ margin: 0, color: dark ? '#F5EFEA' : 'var(--ink)' }}>歡迎回來，{demo.firstName}</h1>
            <p style={{ color: dark ? '#A9A39C' : 'var(--ink-muted)', fontSize: 18, fontWeight: 500, marginTop: 4 }}>
              繼續你的<span style={{ color: cert.text, fontWeight: 700 }}>{cert.label.replace('證書', '')}</span>證書衝分旅程，AI 助教已備好今日進度。
            </p>
          </div>
          <CertBadge level={theme || demo.tier} />
        </div>

        {/* Countdown + Coach alert row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
          <CountdownCard days={demo.daysLeft} />
          <CoachAlert demo={demo} openCoach={openCoach} />
        </div>

        {/* BIG Start Today's Game CTA */}
        <button onClick={() => goNav('games')} style={{
          width: '100%', padding: '28px 36px', marginBottom: 32, border: 'none',
          borderRadius: 22, cursor: 'pointer', textAlign: 'left',
          background: 'linear-gradient(120deg, #FF6B3D 0%, #D4AF37 100%)',
          color: '#fff', boxShadow: '0 12px 0 #8B2F0F, 0 24px 60px -12px rgba(175,76,47,0.5)',
          display: 'flex', alignItems: 'center', gap: 28, position: 'relative', overflow: 'hidden',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
        }}
          onMouseDown={e => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 8px 0 #8B2F0F, 0 16px 40px -12px rgba(175,76,47,0.5)'; }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 12px 0 #8B2F0F, 0 24px 60px -12px rgba(175,76,47,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 12px 0 #8B2F0F, 0 24px 60px -12px rgba(175,76,47,0.5)'; }}>
          <div style={{ fontSize: 72, animation: 'bounce 2.4s ease-in-out infinite', flexShrink: 0 }}>🎮</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', opacity: 0.85, marginBottom: 6 }}>
              ★ DAILY MISSION · 4/26 ★
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 36, lineHeight: 1.1 }}>
              開始今日小遊戲 →
            </div>
            <div style={{ fontSize: 14, opacity: 0.95, marginTop: 8, fontWeight: 600 }}>
              3 款迷你遊戲輪播 · 通關 +100 PTS · 連 3 天再 +50 連勝獎
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', padding: '6px 14px', borderRadius: 9999,
                           fontSize: 11, fontWeight: 900, letterSpacing: '0.1em' }}>
              5 分鐘 · 隨時可玩
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>還沒挑戰 ⏰</div>
          </div>
          {/* Decorative sparkles */}
          <div style={{ position: 'absolute', top: 12, right: 24, fontSize: 18, opacity: 0.5 }}>✨</div>
          <div style={{ position: 'absolute', bottom: 14, right: 200, fontSize: 14, opacity: 0.4 }}>⭐</div>
          <div style={{ position: 'absolute', top: 30, right: 380, fontSize: 12, opacity: 0.4 }}>✨</div>
        </button>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
          <PaperCard accent="top-terra" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 8, right: 12, opacity: 0.04 }}>
              <Icon name="zap" size={80} stroke={1} />
            </div>
            <Eyebrow color="var(--ink-muted)">可用點數</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 36,
                          color: 'var(--terra)', lineHeight: 1, marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
              {demo.points.toLocaleString()} <span style={{ fontSize: 11, color: 'var(--ink-muted)', letterSpacing: '0.2em' }}>PTS</span>
            </div>
            <div style={{ marginTop: 16, padding: 10, background: 'var(--paper-muted)',
                          borderRadius: 10, fontSize: 11, fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>🔥</span> 連續 <span style={{ color: 'var(--terra)' }}>{demo.streak}</span> 天
            </div>
          </PaperCard>

          <PaperCard accent="top-terra">
            <Eyebrow color="var(--ink-muted)">目標等級</Eyebrow>
            <div style={{ marginTop: 12 }}><CertBadge level={theme || 'gold'} size="sm" /></div>
            <div style={{ color: 'var(--terra)', fontSize: 12, fontWeight: 700, marginTop: 16 }}>
              🚩 {demo.predicted >= 860 ? '已達標 — 衝刺 990！' : `差 ${860 - demo.predicted} 分`}
            </div>
          </PaperCard>

          <PaperCard accent="top-ink">
            <Eyebrow color="var(--ink-muted)">近期正確率</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 36,
                          color: 'var(--ink)', marginTop: 12, lineHeight: 1 }}>{demo.accuracy}%</div>
            <div style={{ color: 'var(--ink-muted)', fontSize: 11, fontStyle: 'italic', marginTop: 16 }}>
              已完成 {demo.completed} 場練習
            </div>
          </PaperCard>

          <PaperCard style={{ borderTop: '4px solid var(--terra-40)' }}>
            <Eyebrow color="var(--ink-muted)">預測 TOEIC</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 36,
                          color: 'var(--terra)', marginTop: 12, lineHeight: 1 }}>{demo.predicted}</div>
            <div style={{ color: 'var(--ink-muted)', fontSize: 11, marginTop: 4 }}>
              聽力 {demo.listening} · 閱讀 {demo.reading}
            </div>
          </PaperCard>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
          <div>
            <SectionHeader title="訓練中心" eyebrow="Training Center" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {[
                { icon: 'zap', title: '每日極限挑戰', sub: '加成 +500 PTS', desc: '完成當日特訓', extra: 'EXTRA +500', goto: 'practice' },
                { icon: 'sparkle', title: '🎮 每日小遊戲', sub: '3 種輕鬆玩', desc: '單字配對、聽力打地鼠、句子拼圖', extra: 'NEW', goto: 'games' },
                { icon: 'message', title: 'AI 對話練習', sub: '6 個情境 NEW', desc: '與 AI 即時對話評分', extra: 'BETA', goto: 'ai-conversation' },
                { icon: 'target', title: '弱點偵查復仇', sub: '錯題回放', desc: '針對歷史錯題深度複習', goto: 'review' },
                { icon: 'headphones', title: '聽力場景訓練', sub: 'Part 1 – 4', desc: '沉浸式照片、對話、短獨白', goto: 'practice' },
                { icon: 'book', title: '閱讀長難句練習', sub: 'Part 5 – 7', desc: '填空、邏輯、長篇分析', goto: 'practice' },
              ].map((p, i) => (
                <PaperCard key={i} accent="left-terra" hover onClick={() => goNav(p.goto)}
                           style={{ minHeight: 180 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ padding: 10, background: 'var(--paper-muted)', color: 'var(--terra)',
                                  borderRadius: 12, display: 'flex' }}>
                      <Icon name={p.icon} size={22} />
                    </div>
                    {p.extra && <Badge>{p.extra}</Badge>}
                  </div>
                  <h3 style={{ marginBottom: 4, fontSize: 18 }}>{p.title}</h3>
                  <Eyebrow style={{ fontSize: 10 }}>{p.sub}</Eyebrow>
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--ink-muted)', fontSize: 12, fontStyle: 'italic' }}>{p.desc}</span>
                    <Icon name="arrowRight" size={18} style={{ color: 'var(--terra)' }} />
                  </div>
                </PaperCard>
              ))}
            </div>

            <div style={{ height: 32 }} />
            <SectionHeader title="每日簽到月曆" eyebrow="Streak Calendar" />
            <StreakCalendar streak={demo.streak} />

            <div style={{ height: 32 }} />
            <SectionHeader title="排行榜 Top 5" eyebrow="Leaderboard" right={
              <a onClick={() => goNav('leaderboard')} style={{ fontSize: 12, color: 'var(--terra)',
                  fontWeight: 700, cursor: 'pointer' }}>查看全部 →</a>} />
            <LeaderboardMini />
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <PaperCard accent="double" style={{ padding: 28, position: 'sticky', top: 112 }}>
              <h3 style={{ fontSize: 18, marginBottom: 4 }}>能力分析圖</h3>
              <Eyebrow color="var(--ink-muted)" style={{ letterSpacing: '0.2em', marginBottom: 16,
                paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                Capability Mapping
              </Eyebrow>
              <RadarChartAnimated scores={demo.radar} animate />
              <div style={{ marginTop: 16, padding: 14, background: 'var(--paper-muted)',
                            borderRadius: 8, fontSize: 11, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                💡 <strong style={{ color: 'var(--ink)' }}>AI 建議：</strong>
                {demo.tier === 'gold' ? '推論能力略弱，建議多練 Part 7 多重文本。' :
                 demo.tier === 'blue' ? '聽力場景需加強，每日 Part 3 三題。' :
                 '基礎扎實，可開始拉長閱讀段落練習。'}
              </div>
              <button onClick={openCoach} style={{
                marginTop: 16, width: '100%', padding: '10px 14px',
                background: 'var(--terra)', color: '#fff', border: 'none', borderRadius: 10,
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
                boxShadow: 'var(--shadow-terra)',
              }}>
                <Icon name="message" size={14} /> 與 AI 教練聊聊
              </button>
            </PaperCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title, eyebrow, right }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 24,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 6 }}>{eyebrow}</Eyebrow>
        <h2 style={{ fontSize: 22 }}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

function CountdownCard({ days }) {
  const urgent = days <= 30;
  return (
    <PaperCard accent="top-terra" style={{ position: 'relative', overflow: 'hidden',
                                            background: urgent ? 'linear-gradient(135deg, var(--terra-05), var(--paper-card))' : 'var(--paper-card)' }}>
      <div style={{ position: 'absolute', top: 8, right: 12, opacity: 0.05 }}>
        <Icon name="flag" size={70} stroke={1} />
      </div>
      <Eyebrow style={{ marginBottom: 8 }}>距離考試</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 56,
                      color: urgent ? 'var(--terra)' : 'var(--ink)', lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
          {days}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: 14,
                      color: 'var(--ink-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          DAYS
        </div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 8, fontStyle: 'italic' }}>
        2026 年 6 月 14 日 · 09:30 場次
      </div>
    </PaperCard>
  );
}

function CoachAlert({ demo, openCoach }) {
  const need = Math.max(15, Math.ceil((860 - demo.predicted) * 0.6));
  return (
    <div style={{
      background: 'var(--paper-card)', border: '1px solid var(--border)',
      borderLeft: '8px solid var(--terra)', borderRadius: 16, padding: '24px 32px',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 25px 60px -15px rgba(175,76,47,0.05)',
    }}>
      <div style={{ position: 'absolute', top: 16, right: 24, opacity: 0.04, pointerEvents: 'none' }}>
        <Icon name="alert" size={70} stroke={1} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
        <div style={{ width: 48, height: 48, background: 'var(--terra)', color: '#fff',
                      borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, boxShadow: 'var(--shadow-terra)' }}>
          <Icon name="alert" size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontSize: 18 }}>
            進度落後警示
            <Eyebrow style={{ fontSize: 9 }}>Academic Warning</Eyebrow>
          </h3>
          <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginTop: 6 }}>
            今日完成 <strong style={{ color: 'var(--ink)' }}>3</strong> 題。
            剩餘 <strong style={{ color: 'var(--ink)' }}>{demo.daysLeft}</strong> 天，
            建議每日練至 <span style={{ color: 'var(--terra)', fontWeight: 900,
              textDecoration: 'underline', textDecorationThickness: 2, textUnderlineOffset: 4 }}>{need}</span> 題。
          </p>
        </div>
        <Button variant="outline" onClick={openCoach}>
          <Icon name="message" size={14} /> 詢問教練
        </Button>
      </div>
    </div>
  );
}

function StreakCalendar({ streak }) {
  // 30-day strip
  const days = Array.from({ length: 30 }, (_, i) => {
    const claimed = i < streak;
    const today = i === streak - 1;
    const future = i >= streak;
    return { i, claimed, today, future };
  });
  return (
    <PaperCard style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <span><span style={{ color: 'var(--terra)', fontWeight: 900 }}>{streak}</span> 天連續</span>
          <span style={{ color: 'var(--ink-muted)' }}>·</span>
          <span style={{ color: 'var(--ink-muted)' }}>本月已簽 {Math.min(streak, 30)} / 30</span>
        </div>
        <Eyebrow color="var(--ink-muted)">April 2026</Eyebrow>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 6 }}>
        {days.map(d => (
          <div key={d.i} style={{
            aspectRatio: '1', borderRadius: 8,
            background: d.today ? 'var(--terra)' :
                        d.claimed ? 'var(--terra-10)' :
                        'var(--paper-muted)',
            border: d.today ? '2px solid var(--terra)' : '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 11,
            color: d.today ? '#fff' : d.claimed ? 'var(--terra)' : 'var(--ink-faint)',
            boxShadow: d.today ? 'var(--shadow-terra)' : 'none',
          }}>
            {d.today ? '🔥' : d.claimed ? '✓' : d.i + 1}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-around', fontSize: 11 }}>
        {[
          { d: 7, r: '+50 PTS', tag: '週獎' },
          { d: 14, r: '+150 PTS', tag: '雙週' },
          { d: 30, r: '+500 PTS · 🥇 邊框', tag: '月度' },
        ].map(m => {
          const reached = streak >= m.d;
          return (
            <div key={m.d} style={{ textAlign: 'center', opacity: reached ? 1 : 0.5 }}>
              <Eyebrow color="var(--ink-muted)" style={{ marginBottom: 4 }}>{m.tag}</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900,
                            color: reached ? 'var(--terra)' : 'var(--ink)' }}>
                {m.d} 天 {reached && '✓'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{m.r}</div>
            </div>
          );
        })}
      </div>
    </PaperCard>
  );
}

function CatchUpBanner({ rival, demo, dark, goNav }) {
  const tierColor = TIER[rival.tier]?.text || '#FF6B3D';
  return (
    <div style={{
      marginBottom: 24,
      padding: 18,
      background: dark ? '#2a1f18' : 'linear-gradient(135deg, #FFF5EC 0%, #FFEED9 100%)',
      borderRadius: 18,
      border: `2px solid ${dark ? '#3a2f28' : '#FFCDB8'}`,
      boxShadow: dark ? 'none' : '0 4px 0 rgba(255,107,61,0.12)',
      display: 'flex', alignItems: 'center', gap: 18,
      animation: 'slideUp 500ms var(--ease-out) both',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: -10, top: -16, fontSize: 80, opacity: 0.06,
                    pointerEvents: 'none' }}>🏃‍♀️</div>
      <div style={{
        width: 56, height: 56, borderRadius: 9999,
        background: tierColor, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, fontSize: 22, fontFamily: 'var(--font-serif)',
        flexShrink: 0,
        boxShadow: `0 4px 0 ${tierColor}80`,
      }}>{rival.avatar}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <Eyebrow color={tierColor} style={{ fontSize: 10 }}>差一點點 · Catch-up Alert</Eyebrow>
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 17,
                       color: dark ? '#F5EFEA' : 'var(--ink)', lineHeight: 1.4 }}>
          再 <span style={{ color: tierColor, fontSize: 22 }}>+{rival.gap}</span> PTS 就能超越
          {' '}<span style={{ color: tierColor }}>{rival.name}</span>
          {' '}的第 <strong>{rival.rank}</strong> 名！
        </div>
        <div style={{ fontSize: 12, color: dark ? '#A9A39C' : 'var(--ink-muted)', marginTop: 4 }}>
          一場練習 +200 PTS · 一輪口說 +150 PTS · 完成今日任務 +300 PTS — 衝過去 🔥
        </div>
      </div>
      <Button variant="primary" icon="arrowRight"
              onClick={() => goNav('practice')}
              style={{ flexShrink: 0 }}>
        立刻追上去
      </Button>
    </div>
  );
}

function LeaderboardMini() {
  return (
    <PaperCard style={{ padding: 0, overflow: 'hidden' }}>
      {LEADERBOARD.map((u, i) => (
        <div key={u.rank} style={{
          display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px',
          borderBottom: i === LEADERBOARD.length - 1 ? 'none' : '1px solid var(--border)',
          background: u.rank === 1 ? 'var(--cert-gold-tint)' : 'transparent',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: u.rank <= 3 ? 'var(--ink)' : 'var(--paper-muted)',
            color: u.rank <= 3 ? '#fff' : 'var(--ink-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14,
          }}>
            {u.rank}
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 9999, background: 'var(--terra)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13,
          }}>{u.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</div>
            <Badge variant={u.tier} style={{ marginTop: 2 }}>{TIER[u.tier].emoji} {TIER[u.tier].label}</Badge>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16, color: 'var(--terra)' }}>
              {u.score.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: u.delta.startsWith('+') ? 'var(--state-success)' :
                          u.delta.startsWith('-') ? 'var(--terra)' : 'var(--ink-muted)' }}>
              {u.delta === '0' ? '— 持平' : u.delta}
            </div>
          </div>
        </div>
      ))}
    </PaperCard>
  );
}

// AI Coach chat overlay
function CoachChat({ open, onClose }) {
  const [msgs, setMsgs] = useStateDb([
    { role: 'bot', text: '哈囉！我是你的 AI 多益教練 🤖' },
    { role: 'bot', text: '我注意到你最近 Part 2 的間接回答正確率只有 60%，要不要從這裡開始加強？' },
  ]);
  const [draft, setDraft] = useStateDb('');

  const send = () => {
    if (!draft.trim()) return;
    const u = draft;
    setMsgs(m => [...m, { role: 'user', text: u }]);
    setDraft('');
    setTimeout(() => {
      setMsgs(m => [...m, { role: 'bot',
        text: u.includes('閱讀') || u.includes('Part 7') ?
          '建議今天先做 5 題 Part 7 雙篇文章，重點放在跨文章推論。完成後我會幫你整理錯題重點 ✨'
          : '了解！我幫你排了 10 題 Part 2 間接回答的迷你練習，預估 8 分鐘完成。準備好了嗎？' }]);
    }, 800);
  };

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 100,
      width: 380, height: 520, background: 'var(--paper-card)',
      borderRadius: 20, border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', animation: 'slideUp 300ms var(--ease-out) both',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'var(--terra)', color: '#fff' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bot" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 15 }}>AI 多益教練</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>● 線上 · 隨時為你解答</div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <Icon name="x" size={20} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%', padding: '10px 14px', borderRadius: 14,
            background: m.role === 'user' ? 'var(--terra)' : 'var(--paper-muted)',
            color: m.role === 'user' ? '#fff' : 'var(--ink)',
            fontSize: 13, lineHeight: 1.6,
          }}>
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input value={draft} onChange={e => setDraft(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && send()}
               placeholder="輸入訊息..."
               style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 10,
                        padding: '10px 14px', fontSize: 13, fontFamily: 'var(--font-sans)',
                        outline: 'none', background: 'var(--paper-muted)' }} />
        <button onClick={send} style={{ padding: '0 14px', background: 'var(--terra)',
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
          <Icon name="send" size={16} />
        </button>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
window.CoachChat = CoachChat;
window.CatchUpBanner = CatchUpBanner;