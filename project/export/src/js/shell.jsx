// Shared shell pieces — Navbar, ToastFloater, ConfettiBurst, AudioPlayer
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

function Navbar({ current = 'dashboard', onNav, demo, dark }) {
  const links = [
    { id: 'dashboard',  label: '學習總覽' },
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

  const start = () => {
    if (playing) {
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
      return;
    }
    setPlaying(true);
    onPlay?.();
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

  useEffectS(() => () => cancelAnimationFrame(rafRef.current), []);

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

const _P1_SCENES = {
  'desk-laptop': (
    <>
      <rect width="400" height="225" fill="#EDF2F7"/>
      <rect width="400" height="145" fill="#E2E8F0"/>
      <rect x="290" y="20" width="80" height="60" rx="3" fill="#BEE3F8" stroke="#90CDF4" strokeWidth="2"/>
      <line x1="330" y1="20" x2="330" y2="80" stroke="#90CDF4" strokeWidth="1.5"/>
      <line x1="290" y1="50" x2="370" y2="50" stroke="#90CDF4" strokeWidth="1.5"/>
      <rect x="30" y="140" width="340" height="12" rx="2" fill="#C4A882"/>
      <rect x="30" y="150" width="340" height="70" fill="#B8956F"/>
      <rect x="80" y="118" width="130" height="24" rx="3" fill="#718096"/>
      <rect x="85" y="75" width="120" height="46" rx="3" fill="#2D3748"/>
      <rect x="90" y="80" width="110" height="36" rx="1" fill="#4A5568"/>
      <rect x="95" y="85" width="70" height="3" rx="1" fill="#63B3ED" opacity="0.8"/>
      <rect x="95" y="92" width="50" height="2" rx="1" fill="#A0AEC0" opacity="0.6"/>
      <rect x="95" y="98" width="60" height="2" rx="1" fill="#A0AEC0" opacity="0.5"/>
      <rect x="85" y="121" width="120" height="3" rx="1" fill="#4A5568"/>
      <circle cx="270" cy="108" r="18" fill="#C6937A"/>
      <rect x="250" y="124" width="40" height="50" rx="4" fill="#5A67D8"/>
      <rect x="225" y="140" width="40" height="10" rx="4" fill="#C6937A"/>
      <rect x="240" y="125" width="14" height="16" rx="2" fill="#fff" stroke="#CBD5E0"/>
      <ellipse cx="247" cy="125" rx="7" ry="3" fill="#E2E8F0"/>
      <text x="200" y="215" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#718096">
        Part 1 · Office scene
      </text>
    </>
  ),
  'meeting-room': (
    <>
      <rect width="400" height="225" fill="#F0FFF4"/>
      <rect width="400" height="130" fill="#E6FFFA"/>
      <rect x="120" y="15" width="160" height="80" rx="3" fill="#fff" stroke="#B2F5EA" strokeWidth="2"/>
      <rect x="126" y="21" width="148" height="68" fill="#F0FFFD"/>
      <line x1="135" y1="35" x2="200" y2="35" stroke="#81E6D9" strokeWidth="1.5"/>
      <line x1="135" y1="45" x2="220" y2="45" stroke="#81E6D9" strokeWidth="1.5"/>
      <line x1="135" y1="55" x2="185" y2="55" stroke="#81E6D9" strokeWidth="1.5"/>
      <ellipse cx="200" cy="165" rx="130" ry="42" fill="#D4A96A" stroke="#B7813A" strokeWidth="2"/>
      <ellipse cx="200" cy="165" rx="110" ry="30" fill="#DEB887"/>
      <rect x="100" y="118" width="30" height="22" rx="4" fill="#4A5568"/>
      <rect x="170" y="115" width="30" height="22" rx="4" fill="#4A5568"/>
      <rect x="240" y="115" width="30" height="22" rx="4" fill="#4A5568"/>
      <circle cx="115" cy="112" r="10" fill="#F6AD55"/>
      <circle cx="185" cy="109" r="10" fill="#68D391"/>
      <circle cx="255" cy="109" r="10" fill="#63B3ED"/>
      <rect x="155" y="200" width="30" height="22" rx="4" fill="#4A5568"/>
      <rect x="215" y="200" width="30" height="22" rx="4" fill="#4A5568"/>
      <text x="200" y="218" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#718096">
        Part 1 · Conference room
      </text>
    </>
  ),
  'reception': (
    <>
      <rect width="400" height="225" fill="#FFFAF0"/>
      <rect width="400" height="135" fill="#FEF3C7"/>
      <rect x="140" y="20" width="120" height="30" rx="4" fill="#D97706"/>
      <rect x="148" y="27" width="104" height="16" rx="2" fill="#FCD34D"/>
      <rect x="40" y="135" width="320" height="55" rx="4" fill="#D4A96A"/>
      <rect x="40" y="130" width="320" height="12" rx="2" fill="#B7813A"/>
      <rect x="200" y="95" width="70" height="40" rx="3" fill="#2D3748"/>
      <rect x="206" y="100" width="58" height="30" fill="#4A5568"/>
      <rect x="225" y="134" width="20" height="5" rx="1" fill="#4A5568"/>
      <circle cx="160" cy="108" r="16" fill="#C6937A"/>
      <rect x="144" y="122" width="32" height="20" rx="3" fill="#E53E3E"/>
      <rect x="330" y="115" width="14" height="22" rx="2" fill="#744210"/>
      <circle cx="337" cy="110" r="14" fill="#48BB78"/>
      <circle cx="325" cy="118" r="10" fill="#38A169"/>
      <rect x="50" y="185" width="28" height="20" rx="3" fill="#718096"/>
      <rect x="88" y="185" width="28" height="20" rx="3" fill="#718096"/>
      <circle cx="64" cy="180" r="9" fill="#F6AD55"/>
      <text x="200" y="215" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#718096">
        Part 1 · Reception area
      </text>
    </>
  ),
};

function Part1Photo({ kind = 'desk-laptop' }) {
  const scene = _P1_SCENES[kind] || _P1_SCENES['desk-laptop'];
  return (
    <div style={{
      width: '100%', aspectRatio: '16/9', background: 'var(--paper-muted)',
      borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', marginBottom: 24,
    }}>
      <svg viewBox="0 0 400 225" style={{ width: '100%', height: '100%' }}>
        {scene}
      </svg>
    </div>
  );
}

Object.assign(window, { Navbar, PointsFloater, DailySignInModal, AudioPlayer, Part1Photo });
