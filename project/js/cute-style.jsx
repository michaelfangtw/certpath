// Cute style overlay — Duolingo-vibe layer that sits ON TOP of the official paper aesthetic
// Activated by adding `cute` class to body. Original mascot: 金獅 Leo — a golden lion cub
// with a black graduation tassel.

const { useState: useStateCute, useEffect: useEffectCute, useRef: useRefCute } = React;

const CUTE_CSS = `
/* ─── Cute mode overrides ─────────────────────────────────────────── */
body.cute {
  --paper-base: #FFF8F0;
  --paper-muted: #FFEED9;
  --paper-card: #FFFFFF;
  --terra: #FF6B3D;
  --terra-05: #FFF0EA;
  --terra-10: #FFE0D4;
  --terra-20: #FFCDB8;
  --border: #FFE3CC;
  --border-soft: #FFF0E0;
  --ink: #3D2817;
  --ink-muted: #8C6B52;
  --shadow-sm: 0 2px 0 rgba(255,107,61,0.15);
  --shadow-md: 0 4px 0 rgba(255,107,61,0.18), 0 8px 24px -8px rgba(255,107,61,0.15);
  --shadow-lg: 0 6px 0 rgba(255,107,61,0.2), 0 16px 32px -10px rgba(255,107,61,0.18);
  --shadow-xs: 0 3px 0 rgba(0,0,0,0.1);
  --shadow-terra: 0 4px 0 #C44818, 0 10px 24px -6px rgba(255,107,61,0.4);
}
body.cute h1, body.cute h2, body.cute h3 {
  letter-spacing: -0.02em;
}
body.cute button:not(:disabled):active {
  transform: translateY(2px) !important;
}

/* Round everything more */
body.cute [class*="paperCard"],
body.cute > * {  /* targeted via specific selectors below */
}

/* Float decorations container */
.cute-bg-decor {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
}
.cute-bg-decor .blob {
  position: absolute; border-radius: 50%; opacity: 0.35;
  filter: blur(40px);
  animation: cuteFloat 20s ease-in-out infinite;
}
@keyframes cuteFloat {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px, -40px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.95); }
}
@keyframes cuteBob {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
}
@keyframes cuteWave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-10deg); }
}
@keyframes cuteHeart {
  0% { transform: scale(0) translateY(0); opacity: 0; }
  20% { transform: scale(1.2) translateY(-10px); opacity: 1; }
  100% { transform: scale(0.8) translateY(-80px); opacity: 0; }
}
@keyframes cuteWobble {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}
`;

// Inject cute CSS once
(() => {
  if (document.getElementById('cute-css')) return;
  const s = document.createElement('style');
  s.id = 'cute-css';
  s.textContent = CUTE_CSS;
  document.head.appendChild(s);
})();

// 金獅 Leo — original cartoon lion mascot SVG
function LeoMascot({ size = 120, mood = 'happy', wave = false, style = {} }) {
  // moods: happy, cheer, sleepy, sad, study
  const eyeY = mood === 'sleepy' ? 38 : 36;
  const eyeShape = mood === 'sleepy'
    ? <><path d="M28 38 Q33 40 38 38" stroke="#3D2817" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M62 38 Q67 40 72 38" stroke="#3D2817" strokeWidth="2.5" strokeLinecap="round" fill="none"/></>
    : <><circle cx="33" cy={eyeY} r="4" fill="#3D2817"/>
        <circle cx="67" cy={eyeY} r="4" fill="#3D2817"/>
        <circle cx="34.5" cy={eyeY - 1.5} r="1.4" fill="#fff"/>
        <circle cx="68.5" cy={eyeY - 1.5} r="1.4" fill="#fff"/></>;

  const mouth = mood === 'sad'
    ? <path d="M42 56 Q50 50 58 56" stroke="#3D2817" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    : mood === 'cheer'
    ? <path d="M40 50 Q50 62 60 50 Q56 56 50 56 Q44 56 40 50 Z" fill="#7C2D12" stroke="#3D2817" strokeWidth="2"/>
    : <path d="M42 52 Q50 58 58 52" stroke="#3D2817" strokeWidth="2.5" strokeLinecap="round" fill="none"/>;

  return (
    <svg viewBox="0 0 100 110" width={size} height={size * 1.1} style={{ ...style, animation: 'cuteBob 3s ease-in-out infinite' }}>
      {/* Mane (puffy ring) */}
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
          const r = (a * Math.PI) / 180;
          const cx = 50 + Math.cos(r) * 30;
          const cy = 47 + Math.sin(r) * 30;
          return <circle key={a} cx={cx} cy={cy} r="14" fill="#D4762A"/>;
        })}
        <circle cx="50" cy="47" r="32" fill="#E08A3F"/>
      </g>
      {/* Ears */}
      <ellipse cx="26" cy="25" rx="7" ry="9" fill="#D4762A"/>
      <ellipse cx="26" cy="26" rx="3.5" ry="5" fill="#FF9B6A"/>
      <ellipse cx="74" cy="25" rx="7" ry="9" fill="#D4762A"/>
      <ellipse cx="74" cy="26" rx="3.5" ry="5" fill="#FF9B6A"/>
      {/* Face */}
      <circle cx="50" cy="48" r="22" fill="#FFD89E"/>
      {/* Cheeks */}
      <circle cx="28" cy="52" r="4" fill="#FF9B6A" opacity="0.5"/>
      <circle cx="72" cy="52" r="4" fill="#FF9B6A" opacity="0.5"/>
      {/* Eyes */}
      {eyeShape}
      {/* Nose */}
      <path d="M47 47 L53 47 L50 50 Z" fill="#3D2817"/>
      {/* Mouth */}
      {mouth}
      {/* Graduation tassel — yellow + black */}
      <rect x="42" y="14" width="16" height="4" fill="#1a1a1a"/>
      <polygon points="36,14 64,14 50,8" fill="#1a1a1a"/>
      <circle cx="62" cy="14" r="1.5" fill="#FFD700"/>
      <line x1="62" y1="14" x2="68" y2="22" stroke="#FFD700" strokeWidth="1.5"/>
      <circle cx="68" cy="23" r="2.5" fill="#FFD700"/>
      {/* Optional waving paw */}
      {wave && (
        <g style={{ transformOrigin: '78px 75px', animation: 'cuteWave 1.8s ease-in-out infinite' }}>
          <ellipse cx="84" cy="78" rx="7" ry="6" fill="#E08A3F"/>
          <circle cx="82" cy="76" r="1" fill="#3D2817"/>
          <circle cx="86" cy="76" r="1" fill="#3D2817"/>
        </g>
      )}
    </svg>
  );
}

// Floating background decorations only visible in cute mode
function CuteBgDecor({ enabled }) {
  if (!enabled) return null;
  const blobs = [
    { c: '#FFCDB8', x: '5%',  y: '10%', s: 220, d: 0 },
    { c: '#FFE3CC', x: '85%', y: '15%', s: 180, d: 3 },
    { c: '#FFD89E', x: '10%', y: '70%', s: 260, d: 6 },
    { c: '#FFCDB8', x: '80%', y: '75%', s: 200, d: 9 },
  ];
  return (
    <div className="cute-bg-decor">
      {blobs.map((b, i) => (
        <div key={i} className="blob" style={{
          background: b.c, left: b.x, top: b.y, width: b.s, height: b.s,
          animationDelay: `${b.d}s`,
        }}/>
      ))}
    </div>
  );
}

// Floating Leo mascot in corner — clickable, gives encouragement
function LeoFloater({ enabled, onClick }) {
  const [bubble, setBubble] = useStateCute(null);
  const lines = [
    '今天也加油喔！🎉',
    '小目標：5 題就好！',
    '你連續 12 天打卡了 🔥',
    '差一點點就升等了！',
    '休息一下也很重要 ☕',
  ];
  useEffectCute(() => {
    if (!enabled) return;
    const t = setInterval(() => {
      setBubble(lines[Math.floor(Math.random() * lines.length)]);
      setTimeout(() => setBubble(null), 4000);
    }, 12000);
    return () => clearInterval(t);
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 90 }}>
      {bubble && (
        <div style={{
          position: 'absolute', bottom: 90, left: 70, minWidth: 180,
          background: '#fff', border: '2px solid #FFCDB8',
          borderRadius: 16, padding: '10px 14px',
          boxShadow: '0 4px 0 rgba(255,107,61,0.15), 0 12px 24px -8px rgba(255,107,61,0.2)',
          fontSize: 13, fontWeight: 700, color: '#3D2817',
          animation: 'slideUp 300ms ease-out both',
        }}>
          {bubble}
          <div style={{ position: 'absolute', bottom: -8, left: 16, width: 0, height: 0,
                        borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                        borderTop: '8px solid #FFCDB8' }}/>
        </div>
      )}
      <button onClick={onClick} style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
      }}>
        <LeoMascot size={88} mood="happy" wave />
      </button>
    </div>
  );
}

Object.assign(window, { LeoMascot, CuteBgDecor, LeoFloater });
