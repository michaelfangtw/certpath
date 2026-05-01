// Leaderboard + Shop screens
const { useState: useStateX, useEffect: useEffectX } = React;

function LeaderboardScreen({ goNav, demo, dark }) {
  const [tab, setTab] = useStateX('total');
  const tabs = [
    { id: 'total', label: '總積分榜' },
    { id: 'week', label: '本週榜' },
    { id: 'streak', label: '連續登入榜' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <Navbar current="leaderboard" onNav={goNav} demo={demo} dark={dark} />
      <main style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32 }}>
          <Eyebrow>Leaderboard</Eyebrow>
          <h1>排行榜</h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 16, marginTop: 6 }}>
            與全平台 12,847 位學員一起競爭，前三名每月獲頒 <strong>金證書徽章</strong>
          </p>
        </div>

        {/* Top 3 podium */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'flex-end', marginBottom: 40 }}>
          {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((u, i) => {
            const heights = [180, 220, 160];
            const colors = ['#A0A0A0', '#D4AF37', '#CD7F32'];
            const medals = ['🥈', '🥇', '🥉'];
            return (
              <div key={u.rank} style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, margin: '0 auto 12px',
                              borderRadius: 9999, background: 'var(--terra)', color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 28,
                              border: `4px solid ${colors[i]}`,
                              boxShadow: `0 8px 24px ${colors[i]}40` }}>
                  {u.avatar}
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16, marginBottom: 4 }}>
                  {u.name}
                </div>
                <Badge variant={u.tier} style={{ marginBottom: 8 }}>
                  {TIER[u.tier].emoji} {TIER[u.tier].label}
                </Badge>
                <div style={{
                  height: heights[i], background: 'var(--paper-card)',
                  borderTop: `4px solid ${colors[i]}`, borderRadius: '8px 8px 0 0',
                  border: '1px solid var(--border)',
                  padding: 20, position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{medals[i]}</div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 28,
                                color: 'var(--terra)', fontVariantNumeric: 'tabular-nums' }}>
                    {u.score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>PTS</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--paper-muted)',
                      borderRadius: 12, marginBottom: 16, width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 18px', border: 'none', borderRadius: 8,
              background: tab === t.id ? 'var(--paper-card)' : 'transparent',
              color: tab === t.id ? 'var(--ink)' : 'var(--ink-muted)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
              fontFamily: 'var(--font-sans)',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <PaperCard style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 24px', background: 'var(--paper-muted)',
                        borderBottom: '1px solid var(--border)', display: 'grid',
                        gridTemplateColumns: '60px 1fr 100px 80px 100px', gap: 16 }}>
            {['#', 'User', 'Tier', 'Streak', 'Points'].map(h => (
              <Eyebrow key={h} color="var(--ink-muted)">{h}</Eyebrow>
            ))}
          </div>
          {[...LEADERBOARD, { rank: 6, name: 'Wang Y.', avatar: 'W', score: 8420, tier: 'green', delta: '+85', streak: 5 },
            { rank: 7, name: 'Hu R.', avatar: 'H', score: 8200, tier: 'green', delta: '-30', streak: 4 },
            { rank: 12, name: 'Lin J. (你)', avatar: 'A', score: demo.points, tier: demo.tier, delta: '+250', streak: demo.streak, isMe: true }
          ].map(u => (
            <div key={u.rank} style={{
              padding: '14px 24px', display: 'grid',
              gridTemplateColumns: '60px 1fr 100px 80px 100px', gap: 16, alignItems: 'center',
              borderBottom: '1px solid var(--border)',
              background: u.isMe ? 'var(--terra-05)' : (u.rank === 1 ? 'var(--cert-gold-tint)' : 'transparent'),
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 16,
                            color: u.rank <= 3 ? 'var(--terra)' : 'var(--ink-muted)' }}>
                {u.rank}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9999, background: 'var(--terra)',
                              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 900, fontSize: 13 }}>{u.avatar}</div>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</span>
                {u.isMe && <Badge>YOU</Badge>}
              </div>
              <Badge variant={u.tier}>{TIER[u.tier].label.replace('證書','')}</Badge>
              <div style={{ fontSize: 12 }}>🔥 {u.streak || Math.floor(Math.random() * 20) + 1}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 14, color: 'var(--terra)',
                            fontVariantNumeric: 'tabular-nums' }}>
                {u.score.toLocaleString()}
              </div>
            </div>
          ))}
        </PaperCard>
      </main>
    </div>
  );
}

const STATIC_SHOP_ITEMS = [
  { id: 1, icon: '📚', name: '單字書 PDF', desc: 'NEW TOEIC 必考 1500 字', cost: 500, tag: '熱銷' },
  { id: 2, icon: '🎧', name: '一對一聽力諮詢', desc: '15 分鐘真人教練 Zoom', cost: 1200, tag: '即將推出', comingSoon: true },
  { id: 3, icon: '⚡', name: '雙倍積分卡', desc: '24 小時內練習積分 x2', cost: 300 },
  { id: 4, icon: '🔓', name: '解鎖高難度題庫', desc: '金色程度專屬 200 題', cost: 800, tag: '即將推出', comingSoon: true },
  { id: 5, icon: '🥇', name: '金色頭像邊框', desc: '永久金邊頭框', cost: 1500, tag: '即將推出', comingSoon: true },
  { id: 6, icon: '☕', name: 'Starbucks 抵用券 NT$100', desc: '完成 30 天連續登入即可兌換', cost: 2500, tag: '即將推出', comingSoon: true },
  { id: 7, icon: '🎯', name: '錯題分析 AI 報告', desc: '個人化 PDF 弱點分析', cost: 600, tag: '即將推出', comingSoon: true },
  { id: 8, icon: '⏰', name: '考試提醒服務', desc: '考前 30 天每日推送', cost: 200, tag: '即將推出', comingSoon: true },
];

function ShopScreen({ goNav, demo, dark, firePoints, setDemo }) {
  const [items, setItems] = useStateX(STATIC_SHOP_ITEMS);
  useEffectX(() => {
    if (window.supabaseClient?.fetchShopItems) {
      window.supabaseClient.fetchShopItems().then(remote => { if (remote) setItems(remote); });
      return;
    }
    const sb = window.supabase;
    if (!sb) return;
    sb.from('shop_items')
      .select('id,icon,name,desc,cost,tag,coming_soon')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data?.length) return;
        setItems(data.map(r => ({
          id: r.id, icon: r.icon, name: r.name, desc: r.desc,
          cost: r.cost, tag: r.tag || undefined,
          comingSoon: r.coming_soon || false,
        })));
      });
  }, []);

  const [bought, setBought] = useStateX(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('certpath_purchases') || '[]');
      return new Set(saved);
    } catch { return new Set(); }
  });
  const buy = (item) => {
    if (demo.points < item.cost || bought.has(item.id) || item.comingSoon) return;
    setBought(s => {
      const next = new Set([...s, item.id]);
      try { localStorage.setItem('certpath_purchases', JSON.stringify([...next])); } catch {}
      return next;
    });
    setDemo?.(d => ({ ...d, points: d.points - item.cost }));
    firePoints?.(-item.cost, '已兌換');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <Navbar current="shop" onNav={goNav} demo={demo} dark={dark} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 32,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Eyebrow>Reward Shop</Eyebrow>
            <h1>獎勵商店</h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: 16, marginTop: 6 }}>
              累積的點數可在這裡兌換實體與虛擬獎勵 — 每月推出限量品項
            </p>
          </div>
          <PaperCard accent="top-terra" style={{ padding: '20px 28px', textAlign: 'right' }}>
            <Eyebrow color="var(--ink-muted)">My Wallet</Eyebrow>
            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 32,
                          color: 'var(--terra)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
              {demo.points.toLocaleString()} <span style={{ fontSize: 12 }}>PTS</span>
            </div>
          </PaperCard>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {items.map(item => {
            const owned = bought.has(item.id);
            const canAfford = demo.points >= item.cost;
            return (
              <PaperCard key={item.id} accent="top-terra" style={{
                padding: 20, position: 'relative', overflow: 'hidden',
                opacity: owned ? 0.6 : 1,
              }}>
                {item.tag && (
                  <div style={{ position: 'absolute', top: 12, right: 12,
                                background: 'var(--terra)', color: '#fff', padding: '3px 8px',
                                borderRadius: 6, fontSize: 9, fontWeight: 900, letterSpacing: '0.1em' }}>
                    {item.tag}
                  </div>
                )}
                <div style={{ fontSize: 56, marginBottom: 12, textAlign: 'center' }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>{item.name}</h3>
                <p style={{ fontSize: 11, color: 'var(--ink-muted)', minHeight: 32, lineHeight: 1.5 }}>{item.desc}</p>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18,
                                color: canAfford ? 'var(--terra)' : 'var(--ink-faint)' }}>
                    {item.cost.toLocaleString()} <span style={{ fontSize: 9 }}>PTS</span>
                  </div>
                  <Button variant={owned ? 'ghost' : item.comingSoon ? 'outline' : canAfford ? 'primary' : 'outline'}
                          onClick={() => buy(item)} disabled={owned || item.comingSoon || !canAfford}
                          style={{ fontSize: 11, padding: '6px 12px' }}>
                    {owned ? '已兌換 ✓' : item.comingSoon ? '即將推出' : canAfford ? '兌換' : '點數不足'}
                  </Button>
                </div>
              </PaperCard>
            );
          })}
        </div>
      </main>
    </div>
  );
}

window.LeaderboardScreen = LeaderboardScreen;
window.ShopScreen = ShopScreen;
