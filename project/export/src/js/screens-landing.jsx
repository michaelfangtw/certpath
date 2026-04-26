// Landing + Login screens
const { useState: useStateL, useEffect: useEffectL } = React;

function LandingScreen({ goNav }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)' }}>
      <header style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)',
                       display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                       maxWidth: 1280, margin: '0 auto' }}>
        <Logo size={44} />
        <Button variant="primary" onClick={() => goNav('login')}>
          Google 一鍵登入
        </Button>
      </header>

      <section style={{ maxWidth: 1024, margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        <Badge style={{ marginBottom: 32 }}>✨ 2018 新制題型完整收錄</Badge>
        <h1 className="display" style={{ fontSize: 64, marginBottom: 20 }}>
          多益<span style={{ color: 'var(--terra)' }}> 金色證書 </span>練習平台
        </h1>
        <p style={{ fontSize: 20, color: 'var(--ink-muted)', fontWeight: 500, maxWidth: 640, margin: '0 auto 40px' }}>
          智慧練習 × 遊戲化激勵 × 即時分數換算<br/>
          從程度診斷到衝破 <span style={{ color: 'var(--terra)', fontWeight: 900 }}>860 分</span>，一步到位
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Button variant="primary" style={{ fontSize: 16, padding: '14px 28px',
                                              animation: 'pulseGold 2s ease-in-out infinite' }}
                  onClick={() => goNav('login')} iconLeft="google">
            Google 快速登入，立即開始
          </Button>
          <Button variant="outline" style={{ fontSize: 16, padding: '12px 26px' }}>了解功能 ↓</Button>
        </div>
      </section>

      <section style={{ maxWidth: 1024, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Achievement Tiers</Eyebrow>
          <h2>證書等級</h2>
          <p style={{ color: 'var(--ink-muted)', marginTop: 8 }}>根據預測分數自動解鎖證書成就</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <CertBadge level="gold" />
          <CertBadge level="blue" />
          <CertBadge level="green" />
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Eyebrow style={{ marginBottom: 12 }}>Core Features</Eyebrow>
          <h2>核心功能</h2>
          <p style={{ color: 'var(--ink-muted)', marginTop: 8 }}>完整的多益學習生態系</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: 'headphones', title: '聽力練習', desc: 'Part 1–4 完整題型，三人對話、圖表題一次搞定' },
            { icon: 'book', title: '閱讀理解', desc: 'Part 5–7 單句填空、段落填空、多重文本閱讀' },
            { icon: 'hash', title: '單字閃卡', desc: '間隔記憶系統 (SRS)，錯題自動收錄、智慧複習' },
            { icon: 'trend', title: '即時計分', desc: 'TOEIC 官方換算表，精準預測你的聽力 + 閱讀分數' },
            { icon: 'target', title: '程度診斷', desc: '首次登入 15 題快速診斷，智慧分配學習計劃' },
            { icon: 'trophy', title: '遊戲化激勵', desc: '每日登入 +10 點、練習 +100 點、連續登入翻倍獎勵' },
          ].map(f => (
            <PaperCard key={f.title} accent="left-terra" hover>
              <div style={{ padding: 12, background: 'var(--paper-muted)', color: 'var(--terra)',
                            borderRadius: 16, display: 'inline-flex', marginBottom: 16 }}>
                <Icon name={f.icon} size={24} />
              </div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>{f.desc}</p>
            </PaperCard>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center',
                       color: 'var(--ink-muted)', fontSize: 13, marginTop: 64 }}>
        © 2026 TOEIC Certs Game · 預測分數僅供參考，實際成績以 ETS 官方考試為準
      </footer>
    </div>
  );
}

function LoginScreen({ goNav }) {
  const [stage, setStage] = useStateL('idle'); // idle, signing, done
  const [email, setEmail] = useStateL('angela.lin@gmail.com');

  const begin = () => {
    setStage('signing');
    setTimeout(() => setStage('done'), 1400);
    setTimeout(() => goNav('diagnostic-intro'), 2400);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper-base)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'absolute', top: 24, left: 32 }}>
        <a onClick={() => goNav('landing')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                                                       color: 'var(--ink-muted)', fontSize: 13, fontWeight: 700,
                                                       cursor: 'pointer' }}>
          <Icon name="arrowLeft" size={14} /> 返回首頁
        </a>
      </div>

      <PaperCard accent="top-terra" style={{ maxWidth: 440, width: '100%', padding: 48, textAlign: 'center' }}>
        <Logo size={56} />
        <div style={{ height: 32 }} />
        <Eyebrow style={{ marginBottom: 12 }}>Sign In</Eyebrow>
        <h2 style={{ marginBottom: 8 }}>登入帳號</h2>
        <p style={{ color: 'var(--ink-muted)', fontSize: 14, marginBottom: 32 }}>
          僅支援 Google 帳號 — 一鍵建立你的學習檔案
        </p>

        {stage === 'idle' && (
          <>
            <Button variant="google" onClick={begin}
                    style={{ width: '100%', fontSize: 15, padding: '14px 24px', marginBottom: 12 }}>
              <Icon name="google" size={18} style={{ color: '#4285F4' }} />
              使用 Google 帳號繼續
            </Button>
            <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 24, lineHeight: 1.6 }}>
              繼續即表示同意我們的 <a style={{ color: 'var(--terra)' }}>服務條款</a> 與 <a style={{ color: 'var(--terra)' }}>隱私政策</a>
            </div>
          </>
        )}

        {stage === 'signing' && (
          <div style={{ padding: '24px 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 20px',
                          border: '1px solid var(--border)', borderRadius: 12, background: 'var(--paper-muted)' }}>
              <div style={{ width: 24, height: 24, border: '2px solid var(--terra-20)',
                            borderTopColor: 'var(--terra)', borderRadius: 9999,
                            animation: 'spin 0.8s linear infinite' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>正在連線 Google…</div>
                <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{email}</div>
              </div>
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div style={{ padding: '24px 0', animation: 'slideUp 400ms var(--ease-out) both' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 9999, background: 'var(--state-success)',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={28} stroke={2.5} />
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 18 }}>
                歡迎，Angela
              </div>
              <Eyebrow color="var(--ink-muted)">Redirecting to Diagnostic…</Eyebrow>
            </div>
          </div>
        )}
      </PaperCard>
    </div>
  );
}

window.LandingScreen = LandingScreen;
window.LoginScreen = LoginScreen;
