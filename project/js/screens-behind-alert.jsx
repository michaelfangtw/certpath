// Behind-Schedule Alert Modal — appears when delay >= threshold
// Suggests adjusting target days (e.g., 60 → 90)
const { useState: useStateBS } = React;

function BehindScheduleAlert({ open, demo, onAdjust, onDismiss }) {
  const [picked, setPicked] = useStateBS(null);
  if (!open) return null;

  // Calculate "lag": how far behind the user is
  // Suggested: based on remaining days vs. needed practice volume
  const dailyNeeded = Math.ceil((860 - demo.predicted) * 0.6 / Math.max(1, demo.daysLeft));
  const dailyActual = 6; // demo "today" practice count
  const lagPct = Math.round(((dailyNeeded - dailyActual) / dailyNeeded) * 100);
  const daysBehind = 3;

  // Three extension options
  const options = [
    { add: 15, label: '+15 天', sub: '輕度延長', dailyNew: Math.ceil((860 - demo.predicted) * 0.6 / (demo.daysLeft + 15)) },
    { add: 30, label: '+30 天', sub: '建議選項', recommended: true,
      dailyNew: Math.ceil((860 - demo.predicted) * 0.6 / (demo.daysLeft + 30)) },
    { add: 60, label: '+60 天', sub: '寬鬆計畫', dailyNew: Math.ceil((860 - demo.predicted) * 0.6 / (demo.daysLeft + 60)) },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(45,41,38,0.55)',
      backdropFilter: 'blur(10px)', zIndex: 160,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s var(--ease-out) both',
    }}>
      <div style={{
        background: 'var(--paper-card)', borderRadius: 24, maxWidth: 600, width: '92%',
        position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        animation: 'slideUp 0.4s var(--ease-out) both',
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 36px 20px',
          background: 'linear-gradient(135deg, rgba(198,40,40,0.08), var(--terra-05))',
          borderBottom: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.06 }}>
            <Icon name="alert" size={140} stroke={1} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--state-error)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px -4px rgba(198,40,40,0.4)',
              animation: 'pulseGold 2s infinite',
            }}>
              <Icon name="alert" size={28} stroke={2.5} />
            </div>
            <div>
              <Eyebrow style={{ color: 'var(--state-error)', marginBottom: 6 }}>
                Schedule Drift Alert
              </Eyebrow>
              <h2 style={{ fontSize: 22, marginBottom: 2 }}>進度大幅落後 🚨</h2>
              <p style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                AI 教練建議調整目標日期，避免硬撐影響學習品質
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 36px' }}>
          {/* Diagnostic stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <div style={{ padding: 14, background: 'var(--paper-muted)', borderRadius: 10,
                          textAlign: 'center', border: '1px solid var(--border)' }}>
              <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9, marginBottom: 6 }}>進度落後</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 24,
                            color: 'var(--state-error)' }}>
                {lagPct}%
              </div>
            </div>
            <div style={{ padding: 14, background: 'var(--paper-muted)', borderRadius: 10,
                          textAlign: 'center', border: '1px solid var(--border)' }}>
              <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9, marginBottom: 6 }}>連續延遲</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 24,
                            color: 'var(--state-error)' }}>
                {daysBehind} 天
              </div>
            </div>
            <div style={{ padding: 14, background: 'var(--paper-muted)', borderRadius: 10,
                          textAlign: 'center', border: '1px solid var(--border)' }}>
              <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9, marginBottom: 6 }}>需每日</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 24,
                            color: 'var(--terra)' }}>
                {dailyNeeded} 題
              </div>
            </div>
          </div>

          {/* AI explanation */}
          <div style={{
            padding: 16, background: 'var(--paper-muted)', borderRadius: 12,
            borderLeft: '4px solid var(--terra)', marginBottom: 24,
            display: 'flex', gap: 12,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--terra)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0 }}>
              <Icon name="bot" size={16} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.7 }}>
              你最近 3 天每日只完成 <strong>{dailyActual} 題</strong>，但目前目標需要每日 <strong style={{ color: 'var(--state-error)' }}>{dailyNeeded} 題</strong>，
              已落後 <strong>{lagPct}%</strong>。硬撐反而容易倦怠 — 建議延長目標日期，
              讓每日學習量回到 <strong>10–15 題</strong>的健康範圍。
            </div>
          </div>

          {/* Options */}
          <Eyebrow style={{ marginBottom: 12 }}>選擇調整方案</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {options.map(o => {
              const isPicked = picked === o.add;
              return (
                <button key={o.add} onClick={() => setPicked(o.add)} style={{
                  width: '100%', padding: '14px 18px', textAlign: 'left',
                  background: isPicked ? 'var(--terra-05)' : 'var(--paper-card)',
                  border: `2px solid ${isPicked ? 'var(--terra)' : 'var(--border)'}`,
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  fontFamily: 'var(--font-sans)',
                  position: 'relative',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 9999,
                    border: `2px solid ${isPicked ? 'var(--terra)' : 'var(--border)'}`,
                    background: isPicked ? 'var(--terra)' : 'transparent',
                    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isPicked && <Icon name="check" size={12} stroke={3} style={{ color: '#fff' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 17 }}>
                        {demo.daysLeft} → {demo.daysLeft + o.add} 天
                      </span>
                      <Badge>{o.label}</Badge>
                      {o.recommended && (
                        <Badge variant="terra">⭐ AI 推薦</Badge>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
                      {o.sub} · 每日只需 <strong style={{ color: 'var(--ink)' }}>{o.dailyNew} 題</strong>
                      （目前 {dailyNeeded} 題）
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={onDismiss}>稍後再說</Button>
            <Button variant="primary" disabled={picked === null}
                    onClick={() => onAdjust(picked)} icon="check">
              確認調整
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.BehindScheduleAlert = BehindScheduleAlert;
