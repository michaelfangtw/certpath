// Shared shell pieces — Navbar, ToastFloater, ConfettiBurst, AudioPlayer
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

function Navbar({ current = 'dashboard', onNav, demo, dark }) {
  const links = [
    { id: 'dashboard',  label: '學習總覽' },
    { id: 'path',       label: '學習路徑' },
    { id: 'practice',   label: '練習中心' },
    { id: 'leaderboard', label: '排行榜' },
    { id: 'shop',       label: '獎勵商店' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: dark ? '1px solid rgba(212,175,55,0.15)' : '1px solid var(--border)',
      background: dark ? 'rgba(20,17,14,0.85)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)',
    }}>
      <nav style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <Logo size={44} dark={dark} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginLeft: 40 }}>
          {links.map(l => {
            const active = l.id === current;
            return (
              <a key={l.id} onClick={() => onNav?.(l.id)}
                 style={{
                   position: 'relative', padding: '28px 0', fontSize: 14, fontWeight: 700,
                   color: active ? 'var(--terra)' : (dark ? '#A9A39C' : 'var(--ink-muted)'),
                   cursor: 'pointer', letterSpacing: '-0.01em',
                   borderBottom: active ? '2px solid var(--terra)' : '2px solid transparent',
                 }}>
                {l.label}
              </a>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }}>
          <div style={{ textAlign: 'right' }}>
            <Eyebrow color={dark ? '#A9A39C' : 'var(--ink-muted)'} style={{ fontSize: 9, marginBottom: 2 }}>Points Balance</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: dark ? '#D4AF37' : 'var(--terra)' }}>
              {demo.points.toLocaleString()} 點
            </div>
          </div>
          <div style={{ height: 32, width: 1, background: dark ? 'rgba(212,175,55,0.2)' : 'var(--border)' }} />
          <div style={{
            width: 36, height: 36, borderRadius: 9999, background: 'var(--terra)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 14,
          }}>{demo.avatar}</div>
        </div>
      </nav>
    </header>
  );
}

// +Points floater that flies from button to top-right
function PointsFloater({ amount, label, onDone }) {
  useEffectS(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 100, left: '50%', transform: 'translateX(-50%)',
      zIndex: 200, pointerEvents: 'none',
      animation: 'pointsRise 2.4s var(--ease-out) forwards',
    }}>
      <div style={{
        background: 'var(--terra)', color: '#fff', padding: '16px 28px', borderRadius: 9999,
        fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 22,
        boxShadow: '0 20px 50px -10px rgba(175,76,47,0.5), 0 0 0 4px rgba(255,255,255,0.4)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ fontSize: 28 }}>✨</span>
        <span>+{amount} PTS</span>
        {label && <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em',
                                 textTransform: 'uppercase', opacity: 0.85 }}>{label}</span>}
      </div>
    </div>
  );
}

// Daily sign-in modal — appears after login
function DailySignInModal({ streak, onClaim }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(45,41,38,0.4)', backdropFilter: 'blur(8px)',
      zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s var(--ease-out) both',
    }}>
      <div style={{
        background: 'var(--paper-card)', borderRadius: 24, padding: 40, maxWidth: 480, width: '90%',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        borderTop: '6px solid var(--terra)', boxShadow: 'var(--shadow-xl)',
        animation: 'slideUp 0.4s var(--ease-out) both',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.04, pointerEvents: 'none' }}>
          <Icon name="flame" size={200} stroke={1} />
        </div>
        <Eyebrow style={{ marginBottom: 16 }}>Daily Sign-in · 每日簽到</Eyebrow>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔥</div>
        <h2 style={{ marginBottom: 8 }}>連續登入 第 {streak} 天</h2>
        <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 32 }}>
          堅持就是勝利 — 每日簽到送 <strong style={{ color: 'var(--terra)' }}>+10 點</strong>，連續 7 天加倍！
        </p>

        {/* 7-day streak strip */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
          {Array.from({ length: 7 }, (_, i) => {
            const claimed = i < streak;
            const today = i === streak - 1;
            return (
              <div key={i} style={{
                width: 44, height: 56, borderRadius: 10,
                border: today ? '2px solid var(--terra)' : '1px solid var(--border)',
                background: claimed ? (today ? 'var(--terra)' : 'var(--terra-10)') : 'var(--paper-muted)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: today ? '#fff' : (claimed ? 'var(--terra)' : 'var(--ink-faint)'),
                fontWeight: 900, fontSize: 11,
                boxShadow: today ? 'var(--shadow-terra)' : 'none',
              }}>
                <div style={{ fontSize: 14 }}>{i === 6 ? '🎁' : (claimed ? '✓' : '·')}</div>
                <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>D{i + 1}</div>
              </div>
            );
          })}
        </div>

        <Button variant="primary" onClick={onClaim} style={{ fontSize: 16, padding: '14px 32px' }}>
          領取 +10 點
        </Button>
      </div>
    </div>
  );
}

// Audio player with speed controls
function AudioPlayer({ transcript = '', onPlay }) {
  const [playing, setPlaying] = useStateS(false);
  const [speed, setSpeed] = useStateS(1.0);
  const [progress, setProgress] = useStateS(0);
  const rafRef = useRefS();
  const uttRef = useRefS();

  const stop = () => {
    setPlaying(false);
    cancelAnimationFrame(rafRef.current);
    window.speechSynthesis?.cancel();
  };

  const start = () => {
    if (playing) { stop(); return; }
    setPlaying(true);
    onPlay?.();

    if (transcript && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(transcript);
      utt.lang = 'en-US';
      utt.rate = speed;
      utt.onend = () => setPlaying(false);
      uttRef.current = utt;
      window.speechSynthesis.speak(utt);
    }

    let p = progress;
    const dur = 6000 / speed;
    const t0 = performance.now() - p * dur;
    const tick = t => {
      const np = Math.min(1, (t - t0) / dur);
      setProgress(np);
      if (np < 1) rafRef.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffectS(() => () => { cancelAnimationFrame(rafRef.current); window.speechSynthesis?.cancel(); }, []);

  return (
    <div style={{
      padding: 24, background: 'var(--paper-muted)',
      borderRadius: 16, border: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button onClick={start} style={{
          width: 56, height: 56, borderRadius: 9999, background: 'var(--terra)', color: '#fff',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-terra)', flexShrink: 0,
        }}>
          <Icon name={playing ? 'pause' : 'play'} size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Eyebrow color="var(--ink)" style={{ letterSpacing: '0.3em' }}>Auditory Prompt</Eyebrow>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0.8, 1.0, 1.2].map(s => (
                <button key={s} onClick={() => setSpeed(s)} style={{
                  padding: '4px 10px', borderRadius: 6,
                  border: '1px solid', borderColor: speed === s ? 'var(--terra)' : 'var(--border)',
                  background: speed === s ? 'var(--terra)' : 'transparent',
                  color: speed === s ? '#fff' : 'var(--ink-muted)',
                  fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 900,
                  letterSpacing: '0.05em', cursor: 'pointer',
                }}>
                  {s.toFixed(1)}x
                </button>
              ))}
            </div>
          </div>
          {/* Waveform progress */}
          <div style={{ height: 40, position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
            {Array.from({ length: 48 }, (_, i) => {
              const filled = (i / 48) <= progress;
              const h = 8 + Math.abs(Math.sin(i * 0.7)) * 24 + (i % 3) * 3;
              return (
                <div key={i} style={{
                  flex: 1, height: h,
                  background: filled ? 'var(--terra)' : 'var(--border)',
                  borderRadius: 2, transition: 'background 100ms',
                }} />
              );
            })}
          </div>
          {transcript && (
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-faint)',
                          fontStyle: 'italic', fontFamily: 'monospace' }}>
              ▸ {transcript.length > 80 ? transcript.slice(0, 80) + '…' : transcript}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Photo placeholder for Part 1 (since no real images)
function Part1Photo({ kind = 'desk-laptop' }) {
  return (
    <div style={{
      width: '100%', aspectRatio: '16/9', background: 'var(--paper-muted)',
      borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', marginBottom: 24,
    }}>
      <svg viewBox="0 0 400 225" style={{ width: '100%', height: '100%' }}>
        <rect width="400" height="225" fill="#EEE9E6"/>
        {/* Simple desk scene illustration */}
        <rect x="20" y="160" width="360" height="50" fill="#D9D1C9" />
        <rect x="60" y="120" width="120" height="50" rx="4" fill="#fff" stroke="#A9A39C" strokeWidth="1.5" />
        <rect x="68" y="128" width="104" height="34" rx="2" fill="#2D2926" />
        <circle cx="240" cy="140" r="20" fill="#AF4C2F"/>
        <rect x="220" y="155" width="40" height="60" rx="4" fill="#AF4C2F" opacity="0.7"/>
        <rect x="280" y="135" width="60" height="20" rx="2" fill="#fff" stroke="#A9A39C"/>
        <text x="200" y="40" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="11"
              fontStyle="italic" fill="#A9A39C">Photo · Q1 Part 1 illustration</text>
      </svg>
    </div>
  );
}

Object.assign(window, { Navbar, PointsFloater, DailySignInModal, AudioPlayer, Part1Photo });
