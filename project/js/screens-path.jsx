// Duolingo-style learning path — winding nodes, sections, locked/current/done states
const { useState: useStateLP, useEffect: useEffectLP, useRef: useRefLP, useMemo: useMemoLP } = React;

// ── Path data ──────────────────────────────────────────────────────────────
// A path = ordered list of sections, each with 5–7 nodes.
// Nodes have type: drill | listening | reading | conversation | game | boss
const PATH_SECTIONS = [
  {
    id: 's1', unit: 'Unit 1', title: '辦公室基本款', subtitle: 'Office Essentials',
    color: '#FF6B3D', emoji: '🏢',
    nodes: [
      { id: 'n1', type: 'drill',        title: 'Greetings & Names',        sub: 'Part 2 · 6 題',  pts: 60 },
      { id: 'n2', type: 'listening',    title: '辦公室電話用語',           sub: 'Part 3 · 5 題',  pts: 80 },
      { id: 'n3', type: 'drill',        title: '時間與行程',               sub: 'Part 5 · 8 題',  pts: 80 },
      { id: 'n4', type: 'conversation', title: '跟同事打招呼',             sub: 'AI 對話 · 5 輪', pts: 120 },
      { id: 'n5', type: 'game',         title: '單字配對 Lv1',             sub: '迷你遊戲',       pts: 50 },
      { id: 'n6', type: 'boss',         title: 'Unit 1 模考',              sub: '15 題 · 計時',  pts: 200 },
    ],
  },
  {
    id: 's2', unit: 'Unit 2', title: '會議與簡報', subtitle: 'Meetings & Presentations',
    color: '#9C5BC9', emoji: '📊',
    nodes: [
      { id: 'n7',  type: 'listening',    title: '會議邀約聽力',            sub: 'Part 3 · 6 題', pts: 80 },
      { id: 'n8',  type: 'drill',        title: '簡報常用片語',            sub: 'Part 5 · 10 題', pts: 100 },
      { id: 'n9',  type: 'reading',      title: 'Q3 業績報告',             sub: 'Part 7 · 1 篇', pts: 120 },
      { id: 'n10', type: 'conversation', title: '主持週會',                sub: 'AI 對話 · 7 輪', pts: 150 },
      { id: 'n11', type: 'game',         title: '句子拼圖 簡報句',         sub: '迷你遊戲',       pts: 80 },
      { id: 'n12', type: 'boss',         title: 'Unit 2 模考',             sub: '20 題 · 計時',  pts: 250 },
    ],
  },
  {
    id: 's3', unit: 'Unit 3', title: '客戶與業務', subtitle: 'Clients & Sales',
    color: '#22A06B', emoji: '🤝',
    nodes: [
      { id: 'n13', type: 'listening',    title: '客戶來電應對',           sub: 'Part 3 · 6 題', pts: 90 },
      { id: 'n14', type: 'reading',      title: '報價單與條款',           sub: 'Part 7 · 1 篇', pts: 120 },
      { id: 'n15', type: 'drill',        title: '商業書信片語',           sub: 'Part 6 · 12 題', pts: 100 },
      { id: 'n16', type: 'conversation', title: '客戶簡報 + Q&A',         sub: 'AI 對話 · 8 輪', pts: 180 },
      { id: 'n17', type: 'game',         title: '聽力打地鼠 商務字',      sub: '迷你遊戲',       pts: 80 },
      { id: 'n18', type: 'boss',         title: 'Unit 3 模考',            sub: '25 題 · 計時',   pts: 300 },
    ],
  },
  {
    id: 's4', unit: 'Unit 4', title: '差旅與機場', subtitle: 'Travel & Logistics',
    color: '#1976D2', emoji: '✈️',
    nodes: [
      { id: 'n19', type: 'listening',    title: '機場廣播',                sub: 'Part 4 · 5 題', pts: 80 },
      { id: 'n20', type: 'reading',      title: '飯店預訂與發票',          sub: 'Part 7 · 雙篇', pts: 150 },
      { id: 'n21', type: 'conversation', title: '飯店 check-in',           sub: 'AI 對話 · 6 輪', pts: 150 },
      { id: 'n22', type: 'drill',        title: '時態與旅遊片語',          sub: 'Part 5 · 12 題', pts: 100 },
      { id: 'n23', type: 'game',         title: '單字配對 Lv2',           sub: '迷你遊戲',       pts: 100 },
      { id: 'n24', type: 'boss',         title: 'Unit 4 模考',             sub: '30 題 · 計時',  pts: 350 },
    ],
  },
  {
    id: 's5', unit: 'Unit 5', title: '面試與職涯', subtitle: 'Interview & Career',
    color: '#D4AF37', emoji: '👔',
    nodes: [
      { id: 'n25', type: 'reading',      title: '徵才公告分析',            sub: 'Part 7 · 三篇', pts: 200 },
      { id: 'n26', type: 'conversation', title: '英文面試演練',            sub: 'AI 對話 · 10 輪', pts: 250 },
      { id: 'n27', type: 'drill',        title: '高分商務字彙',            sub: 'Part 5 · 15 題', pts: 150 },
      { id: 'n28', type: 'listening',    title: '面試官常見提問',          sub: 'Part 3 · 8 題', pts: 120 },
      { id: 'n29', type: 'game',         title: '句子拼圖 進階',          sub: '迷你遊戲',       pts: 120 },
      { id: 'n30', type: 'boss',         title: '🏆 金證大魔王',          sub: '完整模考',       pts: 500 },
    ],
  },
];


// ── Helpers ─────────────────────────────────────────────────────────────────
const NODE_TYPE_META = {
  drill:        { icon: '✏️',  color: '#FF6B3D', label: '文法 / 單字' },
  listening:    { icon: '🎧',  color: '#1976D2', label: '聽力練習' },
  reading:      { icon: '📖',  color: '#22A06B', label: '閱讀練習' },
  conversation: { icon: '🗣️',  color: '#9C5BC9', label: 'AI 對話' },
  game:         { icon: '🎮',  color: '#F57C00', label: '迷你遊戲' },
  boss:         { icon: '🏆',  color: '#D4AF37', label: '單元魔王' },
};

function getNodeStatus(nodeId, progress, currentId, allNodes) {
  if (progress[nodeId]) return 'completed';
  if (nodeId === currentId) return 'current';
  // Find the index — if everything before current is done, this might be locked
  const idx = allNodes.findIndex(n => n.id === nodeId);
  const curIdx = allNodes.findIndex(n => n.id === currentId);
  if (curIdx === -1) return 'locked';
  return idx < curIdx ? 'completed' : 'locked';
}

// ── Main path screen ───────────────────────────────────────────────────────
function LearningPathScreen({ goNav, demo, dark, openGame }) {
  const [progress, setProgress] = useStateLP({});
  const [openNode, setOpenNode] = useStateLP(null);

  const allNodes = useMemoLP(() => PATH_SECTIONS.flatMap(s => s.nodes), []);

  // Derive current node as first incomplete node
  const currentId = allNodes.find(n => !progress[n.id])?.id ?? null;

  useEffectLP(() => {
    const sb = window.supabase;
    if (!sb) return;
    sb.from('user_path_progress')
      .select('node_id, completed_at, score, total, accuracy, pts, time, stars, kind, breakdown')
      .then(({ data, error }) => {
        if (error || !data) return;
        const map = {};
        data.forEach(row => {
          map[row.node_id] = {
            completedAt: row.completed_at,
            score: row.score,
            total: row.total,
            accuracy: row.accuracy,
            pts: row.pts,
            time: row.time,
            stars: row.stars,
            ...(row.kind ? { kind: row.kind } : {}),
            ...(row.breakdown ? { breakdown: row.breakdown } : {}),
          };
        });
        setProgress(map);
      });
  }, []);

  const totalDone = Object.keys(progress).length;
  const totalNodes = allNodes.length;
  const overallPct = Math.round((totalDone / totalNodes) * 100);

  const handleNodeClick = (node, section, status) => {
    setOpenNode({ node, section, status, record: progress[node.id] });
  };

  const handleStart = (node) => {
    setOpenNode(null);
    // Route based on type
    const route = {
      drill: 'quiz', listening: 'quiz', reading: 'quiz',
      conversation: 'ai-conversation', game: 'games', boss: 'quiz',
    }[node.type] || 'practice';
    goNav(route);
  };

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#1a1612' : 'var(--paper-base)' }}>
      <Navbar current="practice" onNav={goNav} demo={demo} dark={dark} />

      <main style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
            <div>
              <Eyebrow>Learning Path</Eyebrow>
              <h1 style={{ marginTop: 4 }}>學習路徑樹 🌳</h1>
              <p style={{ color: 'var(--ink-muted)', fontSize: 14, fontWeight: 500, marginTop: 4 }}>
                跟著 Leo 一路打過 5 個單元 · 最終挑戰金證大魔王
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Eyebrow color="var(--ink-muted)" style={{ fontSize: 9 }}>整體進度</Eyebrow>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 28, color: 'var(--terra)',
                             fontVariantNumeric: 'tabular-nums' }}>
                {totalDone}<span style={{ fontSize: 14, color: 'var(--ink-muted)' }}>/{totalNodes}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                {overallPct}% 完成
              </div>
            </div>
          </div>
          {/* Overall progress bar */}
          <div style={{ marginTop: 16, height: 8, background: 'var(--paper-muted)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${overallPct}%`,
                           background: 'linear-gradient(90deg, #FF6B3D, #D4AF37)',
                           borderRadius: 9999, transition: 'width 600ms ease' }} />
          </div>
        </div>

        {/* Sections */}
        {PATH_SECTIONS.map((section, sIdx) => {
          const sectionDone = section.nodes.filter(n => progress[n.id]).length;
          const sectionTotal = section.nodes.length;
          const sectionPct = (sectionDone / sectionTotal) * 100;
          const sectionUnlocked = sIdx === 0 || PATH_SECTIONS[sIdx - 1].nodes.every(n => progress[n.id]) ||
                                   section.nodes.some(n => n.id === currentId);
          const sectionActive = section.nodes.some(n => n.id === currentId);

          return (
            <div key={section.id} style={{ marginBottom: 12 }}>
              {/* Section header — chapter banner */}
              <SectionBanner section={section} done={sectionDone} total={sectionTotal} pct={sectionPct}
                             unlocked={sectionUnlocked} active={sectionActive} dark={dark} />

              {/* Nodes — winding layout, alternating left/right */}
              <div style={{ position: 'relative', padding: '24px 0 36px' }}>
                {section.nodes.map((node, nIdx) => {
                  const status = sectionUnlocked
                    ? getNodeStatus(node.id, progress, currentId, allNodes)
                    : 'locked';
                  // Sinusoidal-ish horizontal position: 0, 0.6, 1, 0.6, 0, -0.6 ...
                  // Use a smooth pattern over the section.
                  const positions = [0, 0.55, 0.85, 0.55, 0, -0.55];
                  const offset = positions[nIdx % positions.length];
                  return (
                    <PathNode key={node.id}
                              node={node}
                              status={status}
                              offset={offset}
                              section={section}
                              dark={dark}
                              record={progress[node.id]}
                              onClick={() => handleNodeClick(node, section, status)} />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* History card */}
        <PaperCard accent="left-terra" style={{ marginTop: 20, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 28 }}>📜</div>
            <div>
              <Eyebrow color="var(--terra)">Path Record</Eyebrow>
              <h3 style={{ fontSize: 16 }}>你走過的足跡</h3>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-muted)' }}>
              共 {totalDone} 站
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
            {totalDone === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13,
                            padding: '20px 0', fontStyle: 'italic' }}>
                尚未完成任何站點
              </div>
            ) : Object.entries(progress).reverse().map(([nodeId, rec]) => {
              const node = allNodes.find(n => n.id === nodeId);
              if (!node) return null;
              const meta = NODE_TYPE_META[node.type];
              return (
                <button key={nodeId}
                  onClick={() => {
                    const sec = PATH_SECTIONS.find(s => s.nodes.some(n => n.id === nodeId));
                    handleNodeClick(node, sec, 'completed');
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', background: 'var(--paper-muted)',
                    border: '1px solid var(--border)', borderRadius: 12,
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.color,
                                 color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 fontSize: 18 }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--ink)' }}>{node.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>
                      {rec.completedAt} · 正確率 {rec.accuracy}% · {rec.time}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: meta.color }}>
                    {'★'.repeat(rec.stars)}{'☆'.repeat(3 - rec.stars)}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--terra)' }}>
                    +{rec.pts}
                  </div>
                </button>
              );
            })}
          </div>
        </PaperCard>
      </main>

      {/* Node detail modal */}
      {openNode && (
        <NodeDetailModal node={openNode.node} section={openNode.section}
                         status={openNode.status} record={openNode.record}
                         onClose={() => setOpenNode(null)}
                         onStart={() => handleStart(openNode.node)}
                         dark={dark} />
      )}
    </div>
  );
}

// ── Section banner ─────────────────────────────────────────────────────────
function SectionBanner({ section, done, total, pct, unlocked, active, dark }) {
  return (
    <div style={{
      position: 'relative',
      background: unlocked ? section.color : '#999',
      color: '#fff',
      borderRadius: 18,
      padding: '16px 20px',
      boxShadow: unlocked ? `0 5px 0 ${section.color}aa` : '0 4px 0 rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: 16,
      opacity: unlocked ? 1 : 0.55,
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: 36 }}>{section.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', opacity: 0.85 }}>
          {section.unit}{active ? ' · 進行中' : ''}
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 19, marginTop: 2 }}>
          {section.title}
        </div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{section.subtitle}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 22 }}>
          {done}<span style={{ fontSize: 13, opacity: 0.7 }}>/{total}</span>
        </div>
        <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 9999,
                       marginTop: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#fff',
                         borderRadius: 9999, transition: 'width 500ms ease' }} />
        </div>
      </div>
      {!unlocked && (
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                       fontSize: 24 }}>🔒</div>
      )}
    </div>
  );
}

// ── Path node ──────────────────────────────────────────────────────────────
function PathNode({ node, status, offset, section, dark, record, onClick }) {
  const meta = NODE_TYPE_META[node.type];
  const size = node.type === 'boss' ? 90 : 76;

  const colors = {
    completed: { bg: '#22A06B',  shadow: '#1A7A50',  ring: '#22A06B' },
    current:   { bg: section.color,  shadow: '#8B2F0F',  ring: section.color },
    locked:    { bg: '#C9C2BC',  shadow: '#9A938D',  ring: '#C9C2BC' },
  };
  const c = colors[status];

  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      transform: `translateX(${offset * 110}px)`,
      marginBottom: 14,
      position: 'relative',
    }}>
      {/* Subtitle floating beside */}
      <div style={{ position: 'absolute', top: 10,
                     [offset >= 0 ? 'right' : 'left']: `calc(50% + ${size / 2 + 14}px)`,
                     textAlign: offset >= 0 ? 'right' : 'left',
                     maxWidth: 180, pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 13.5,
                       color: status === 'locked' ? 'var(--ink-muted)' : 'var(--ink)',
                       lineHeight: 1.3 }}>
          {node.title}
        </div>
        <div style={{ fontSize: 10, color: 'var(--ink-muted)', marginTop: 2 }}>
          {meta.label} · {node.sub}
        </div>
      </div>

      {/* Current pulse ring */}
      {status === 'current' && (
        <div style={{
          position: 'absolute', top: -8, left: '50%',
          width: size + 16, height: size + 16, borderRadius: 9999,
          marginLeft: -(size + 16) / 2,
          border: `3px dashed ${c.ring}`,
          animation: 'spin 6s linear infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* "START" tag for current */}
      {status === 'current' && (
        <div style={{
          position: 'absolute', top: -22, left: '50%',
          transform: 'translateX(-50%)',
          background: c.bg, color: '#fff',
          padding: '4px 12px', borderRadius: 9999,
          fontSize: 10, fontWeight: 900, letterSpacing: '0.1em',
          boxShadow: `0 3px 0 ${c.shadow}`,
          whiteSpace: 'nowrap',
          animation: 'bounceY 1.5s ease-in-out infinite',
        }}>
          START
        </div>
      )}

      <button onClick={onClick}
        style={{
          width: size, height: size, borderRadius: '50%',
          background: c.bg, color: '#fff',
          border: 'none',
          boxShadow: `0 6px 0 ${c.shadow}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: node.type === 'boss' ? 36 : 28,
          transition: 'all 150ms ease',
          position: 'relative',
        }}
        onMouseDown={e => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = `0 3px 0 ${c.shadow}`; }}
        onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 6px 0 ${c.shadow}`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 6px 0 ${c.shadow}`; }}>
        {status === 'locked' ? '🔒' : status === 'completed' ? '✓' : meta.icon}

        {/* Stars for completed */}
        {status === 'completed' && record && (
          <div style={{
            position: 'absolute', bottom: -8, left: '50%',
            transform: 'translateX(-50%)',
            background: '#fff', borderRadius: 9999,
            padding: '2px 8px', fontSize: 10, fontWeight: 900,
            color: '#D4AF37', whiteSpace: 'nowrap',
            border: '2px solid #D4AF37',
            boxShadow: '0 2px 0 rgba(0,0,0,0.08)',
          }}>
            {'★'.repeat(record.stars)}{'☆'.repeat(3 - record.stars)}
          </div>
        )}

        {/* Boss crown */}
        {node.type === 'boss' && status !== 'completed' && (
          <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                         fontSize: 22 }}>👑</div>
        )}
      </button>
    </div>
  );
}

// ── Node detail modal ──────────────────────────────────────────────────────
function NodeDetailModal({ node, section, status, record, onClose, onStart, dark }) {
  const meta = NODE_TYPE_META[node.type];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(20,16,12,0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, zIndex: 1000,
      animation: 'fadeIn 200ms ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 22, maxWidth: 460, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        animation: 'slideUp 350ms var(--ease-out) both',
      }}>
        {/* Header */}
        <div style={{
          background: status === 'locked' ? '#999' :
                       status === 'completed' ? '#22A06B' : section.color,
          color: '#fff',
          padding: '28px 28px 22px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.2)', border: 'none',
            width: 32, height: 32, borderRadius: 9999, color: '#fff',
            cursor: 'pointer', fontSize: 18,
          }}>✕</button>

          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38, marginBottom: 12,
          }}>
            {status === 'locked' ? '🔒' : status === 'completed' ? '✓' : meta.icon}
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', opacity: 0.9 }}>
            {section.unit} · {meta.label.toUpperCase()}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 22, marginTop: 6 }}>
            {node.title}
          </div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
            {node.sub} · 完成獎勵 +{node.pts} PTS
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {status === 'locked' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                             padding: 14, background: '#FFF8E1', borderRadius: 12,
                             border: '1px solid #F4DD8E', marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>🔐</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#8A6914' }}>
                  完成前一站才能解鎖。一步一步來！
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                這一站會練：<strong style={{ color: 'var(--ink)' }}>{node.title}</strong>。
                通關後可獲得 <strong style={{ color: 'var(--terra)' }}>+{node.pts} PTS</strong>，
                並解鎖下一站。
              </div>
              <Button variant="ghost" onClick={onClose} style={{ width: '100%', marginTop: 18 }}>
                我知道了
              </Button>
            </div>
          )}

          {status === 'current' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                             padding: 14, background: '#FFF5EC', borderRadius: 12,
                             border: '1px solid #FFCDB8', marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>⚡</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C44818' }}>
                  這是你目前的進度 — Leo 在這裡等你！
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                <MiniStat label="預估時長" value="5–8 min" />
                <MiniStat label="難度" value={'★'.repeat(node.type === 'boss' ? 3 : 2) + '☆'.repeat(node.type === 'boss' ? 0 : 1)} />
                <MiniStat label="獎勵" value={`+${node.pts}`} highlight />
              </div>

              <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                💡 為什麼是這個任務：根據你 {section.unit} 的進度，
                這站可以幫你補強 <strong style={{ color: 'var(--ink)' }}>{meta.label}</strong> 弱點。
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>等等再做</Button>
                <Button variant="primary" onClick={onStart} icon="arrowRight" style={{ flex: 2 }}>
                  開始這一站
                </Button>
              </div>
            </div>
          )}

          {status === 'completed' && record && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                             padding: 14, background: '#E8F5E9', borderRadius: 12,
                             border: '1px solid #A5D6A7', marginBottom: 16 }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1B5E20' }}>
                  這一站已通關 · {record.completedAt}
                </div>
              </div>

              {/* Stars row */}
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 32, color: '#D4AF37', letterSpacing: 6 }}>
                  {'★'.repeat(record.stars)}<span style={{ color: '#E0DBD6' }}>{'★'.repeat(3 - record.stars)}</span>
                </div>
              </div>

              {/* Stat grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
                <MiniStat label="正確率" value={`${record.accuracy}%`}
                          highlight={record.accuracy >= 80} />
                <MiniStat label="得分" value={`${record.score}/${record.total}`} />
                <MiniStat label="用時" value={record.time} />
                <MiniStat label="點數" value={`+${record.pts}`} highlight />
              </div>

              {/* Oral breakdown if applicable */}
              {record.kind === 'oral' && record.breakdown && (
                <div style={{ padding: 14, background: 'var(--paper-muted)', borderRadius: 12, marginBottom: 16 }}>
                  <Eyebrow style={{ marginBottom: 8 }}>口說評分明細</Eyebrow>
                  {Object.entries({ fluency: '流暢度', grammar: '文法', relevance: '切題度' }).map(([k, label]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, width: 60 }}>{label}</div>
                      <div style={{ flex: 1, height: 6, background: '#fff', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${record.breakdown[k]}%`,
                                       background: '#9C5BC9', borderRadius: 9999 }} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, width: 30, textAlign: 'right' }}>
                        {record.breakdown[k]}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>關閉</Button>
                <Button variant="primary" onClick={onStart} icon="refresh" style={{ flex: 2 }}>
                  再挑戰一次
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, highlight }) {
  return (
    <div style={{
      padding: '10px 12px',
      background: highlight ? '#FFF5EC' : 'var(--paper-muted)',
      border: highlight ? '1px solid #FFCDB8' : '1px solid var(--border)',
      borderRadius: 10,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                     color: 'var(--ink-muted)', marginBottom: 4 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16,
                     color: highlight ? 'var(--terra)' : 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}

window.LearningPathScreen = LearningPathScreen;
