// Shared primitives — Logo, Icon, Eyebrow, Button, Badge, PaperCard, CertBadge
const { useState, useEffect, useRef, useMemo } = React;

const ICON_PATHS = {
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  headphones: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3z"/><path d="M21 19a2 2 0 0 1-2 2h-3v-5a2 2 0 0 1 2-2h3z"/><path d="M3 10a9 9 0 0 1 18 0"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  hash: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  timer: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  trend: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  play: '<polygon points="5 3 19 12 5 21 5 3"/>',
  pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  sparkle: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
  google: '<path d="M21.35 11.1H12v3.2h5.35c-.5 2.4-2.55 3.7-5.35 3.7-3.25 0-5.9-2.65-5.9-5.95s2.65-5.95 5.9-5.95c1.5 0 2.85.55 3.85 1.45l2.4-2.4C16.7 3.6 14.5 2.6 12 2.6c-5.2 0-9.4 4.2-9.4 9.4s4.2 9.4 9.4 9.4c5.45 0 9.05-3.85 9.05-9.25 0-.6-.05-1.05-.1-1.05Z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  rewind: '<polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/>',
  ff: '<polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
};

const Icon = ({ name, size = 18, stroke = 1.5, className = '', style = {} }) => {
  const paths = ICON_PATHS[name] || '';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
         fill={name === 'google' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round"
         className={className} style={style} dangerouslySetInnerHTML={{ __html: paths }} />
  );
};

const TIER = {
  gold:   { label: '金色證書', emoji: '🥇', range: '860 – 990', text: 'var(--cert-gold-text)',   bg: 'var(--cert-gold-tint)',   c: '#D4AF37' },
  blue:   { label: '藍色證書', emoji: '🔵', range: '730 – 855', text: 'var(--cert-blue-text)',   bg: 'var(--cert-blue-tint)',   c: '#4A6E91' },
  green:  { label: '綠色證書', emoji: '🟢', range: '470 – 725', text: 'var(--cert-green-text)',  bg: 'var(--cert-green-tint)',  c: '#4F7942' },
  brown:  { label: '棕色證書', emoji: '🟤', range: '220 – 465', text: 'var(--cert-brown-text)',  bg: 'var(--cert-brown-tint)',  c: '#78350F' },
  orange: { label: '橘色證書', emoji: '🟠', range: '10 – 215',  text: 'var(--cert-orange-text)', bg: 'var(--cert-orange-tint)', c: '#E67E22' },
};
const tierFromScore = s =>
  s >= 860 ? 'gold' : s >= 730 ? 'blue' : s >= 470 ? 'green' : s >= 220 ? 'brown' : 'orange';

const Logo = ({ size = 44, dark = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{ width: size, height: size, background: 'var(--terra)', color: '#fff', borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: size * 0.55,
                  boxShadow: '0 10px 20px -10px rgba(175,76,47,0.25)' }}>T</div>
    <div style={{ lineHeight: 1 }}>
      <div className="eyebrow" style={{ fontSize: 10, marginBottom: 2, color: dark ? '#D4AF37' : 'var(--terra)' }}>Study Coach</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18, color: dark ? '#F5EFEA' : 'var(--ink)' }}>
        TOEIC Golden Certs
      </div>
    </div>
  </div>
);

const Eyebrow = ({ children, color = 'var(--terra)', style = {} }) => (
  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 900, color,
                textTransform: 'uppercase', letterSpacing: '0.25em', lineHeight: 1, ...style }}>
    {children}
  </div>
);

const Button = ({ variant = 'primary', children, icon, iconLeft, onClick, style = {}, disabled, ...p }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px 24px', borderRadius: 8, fontFamily: 'var(--font-sans)',
    fontWeight: 700, fontSize: 14, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms var(--ease-out)', whiteSpace: 'nowrap', textDecoration: 'none',
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: 'var(--terra)', color: '#fff', boxShadow: 'var(--shadow-xs)' },
    outline: { background: 'transparent', color: 'var(--terra)', border: '2px solid var(--terra)', padding: '10px 22px' },
    ghost:   { background: 'transparent', color: 'var(--ink-muted)', padding: '8px 16px' },
    dark:    { background: 'var(--ink)', color: '#fff' },
    google:  { background: '#fff', color: '#3c4043', border: '1px solid #dadce0', padding: '12px 22px',
               fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
            style={{ ...base, ...variants[variant], ...style }} {...p}>
      {iconLeft && <Icon name={iconLeft} size={16} />}
      {children}
      {icon && <Icon name={icon} size={16} />}
    </button>
  );
};

const Badge = ({ variant = 'terra', children, style = {} }) => {
  const variants = {
    terra:  { background: 'var(--terra-10)', borderColor: 'var(--terra-20)', color: 'var(--terra)' },
    ink:    { background: 'var(--paper-muted)', borderColor: 'var(--border)', color: 'var(--ink)' },
    gold:   { background: 'var(--cert-gold-tint)', borderColor: 'rgba(212,175,55,0.3)', color: 'var(--cert-gold-text)' },
    blue:   { background: 'var(--cert-blue-tint)', borderColor: 'rgba(74,110,145,0.3)', color: 'var(--cert-blue-text)' },
    green:  { background: 'var(--cert-green-tint)', borderColor: 'rgba(79,121,66,0.3)', color: 'var(--cert-green-text)' },
    brown:  { background: 'var(--cert-brown-tint)', borderColor: 'rgba(120,53,15,0.3)', color: 'var(--cert-brown-text)' },
    orange: { background: 'var(--cert-orange-tint)', borderColor: 'rgba(230,126,34,0.3)', color: 'var(--cert-orange-text)' },
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                   borderRadius: 6, fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                   letterSpacing: '0.05em', border: '1px solid', whiteSpace: 'nowrap',
                   ...variants[variant], ...style }}>
      {children}
    </span>
  );
};

const PaperCard = ({ accent, children, style = {}, onClick, hover }) => {
  const [h, setH] = useState(false);
  const accents = {
    'left-terra':  { borderLeft: '4px solid var(--terra)' },
    'left-ink':    { borderLeft: '4px solid var(--ink)' },
    'top-terra':   { borderTop: '4px solid var(--terra)' },
    'top-ink':     { borderTop: '4px solid var(--ink)' },
    'double':      { border: '4px double var(--border)', boxShadow: 'var(--shadow-sm)' },
    'dashed':      { border: '2px dashed rgba(175,76,47,0.3)', background: 'var(--terra-05)' },
  };
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
         style={{
           background: 'var(--paper-card)', border: '1px solid var(--border)',
           borderRadius: 16, padding: 24,
           boxShadow: h && hover ? 'var(--shadow-lg)' : 'var(--shadow-md)',
           transform: h && hover ? 'translateY(-4px)' : 'translateY(0)',
           borderColor: h && hover ? 'var(--terra-20)' : 'var(--border)',
           transition: 'all 500ms var(--ease-out)',
           cursor: onClick ? 'pointer' : 'default',
           ...(accent ? accents[accent] : {}),
           ...style,
         }}>
      {children}
    </div>
  );
};

const CertBadge = ({ level, size = 'md' }) => {
  const cfg = TIER[level];
  if (!cfg) return null;
  if (size === 'sm') return <Badge variant={level}>{cfg.emoji} {cfg.label}</Badge>;
  return (
    <div style={{ background: 'var(--paper-card)', border: '1px solid var(--border)',
                  borderTop: `4px solid ${cfg.c}`, borderRadius: 16, padding: 24, textAlign: 'center', minWidth: 200 }}>
      <div style={{ width: 56, height: 56, borderRadius: 9999, background: cfg.bg,
                    border: `1px solid ${cfg.c}40`, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 10 }}>{cfg.emoji}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18, color: cfg.text }}>{cfg.label}</div>
      <Eyebrow color="var(--ink-muted)" style={{ marginTop: 4 }}>Official Target</Eyebrow>
      <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '14px 0' }} />
      <Eyebrow color="var(--ink-muted)">Score Range</Eyebrow>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: 14, marginTop: 4, color: 'var(--ink)' }}>{cfg.range}</div>
    </div>
  );
};

// ── Hooks ───────────────────────────────────────────────
function useCountUp(target, dur = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const step = t => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

Object.assign(window, { Icon, Logo, Eyebrow, Button, Badge, PaperCard, CertBadge, TIER, tierFromScore, useCountUp });
