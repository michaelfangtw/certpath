// Daily Quest — redesigned daily quiz engine
// Principles: 1.單字視覺化  2.語言沉浸  3.間隔重複(SR)  4.聽說讀寫每天輪換
// NOTE: Icon, Button, PaperCard, Eyebrow, Badge, Navbar, SectionHeader, TIER
// are all defined globally by primitives.jsx / shell.jsx / screens-dashboard.jsx (loaded before this file).
const { useState: useSQ, useEffect: useEQ, useRef: useRQ, useCallback: useCQ, useMemo: useMQ } = React;

// ─── Vocabulary bank ──────────────────────────────────────────────────────────
const VOCAB_BANK = [
  { id:'v01', word:'substantial', pos:'adj', emoji:'🏋️', color:'#1565C0', difficulty:'gold',
    meaning:'大量的；實質性的', mnemonic:'sub+stance → 站得穩的基礎 → 大量',
    family:{adj:'substantial',adv:'substantially',noun:'substance'},
    sentence:'The company made a **substantial** investment in renewable energy last quarter.',
    audioCtx:'The merger resulted in a substantial increase in market share.' },
  { id:'v02', word:'negotiate', pos:'verb', emoji:'🤝', color:'#AF4C2F', difficulty:'blue',
    meaning:'協商；談判', mnemonic:'nego→否定，雙方都說不最後妥協→談判',
    family:{verb:'negotiate',noun:'negotiation',adj:'negotiable',person:'negotiator'},
    sentence:'Both parties agreed to **negotiate** the contract terms before the deadline.',
    audioCtx:'We still need to negotiate the final pricing with the supplier before Friday.' },
  { id:'v03', word:'allocate', pos:'verb', emoji:'📊', color:'#6A1B9A', difficulty:'gold',
    meaning:'分配；撥出資源', mnemonic:'al+locate → 找到位置放進去 → 分配',
    family:{verb:'allocate',noun:'allocation',adj:'allocated'},
    sentence:'The board decided to **allocate** 20% of the budget to R&D.',
    audioCtx:'Please allocate sufficient time for the client presentation rehearsal.' },
  { id:'v04', word:'comply', pos:'verb', emoji:'✅', color:'#2E7D32', difficulty:'blue',
    meaning:'遵守；順從規定', mnemonic:'com+ply → 折腰配合 → 遵守',
    family:{verb:'comply',noun:'compliance',adj:'compliant',phrase:'comply with'},
    sentence:'All vendors must **comply** with the safety regulations in Section 4.',
    audioCtx:'The audit confirmed that all departments comply with the data privacy policy.' },
  { id:'v05', word:'tentative', pos:'adj', emoji:'❓', color:'#E65100', difficulty:'gold',
    meaning:'暫定的；試探性的', mnemonic:'tent → 臨時帳篷 → 暫定的',
    family:{adj:'tentative',adv:'tentatively',noun:'tentativeness'},
    sentence:'We have a **tentative** meeting scheduled for Thursday, pending CEO availability.',
    audioCtx:'The launch date is still tentative — waiting on final approval from legal.' },
  { id:'v06', word:'streamline', pos:'verb', emoji:'⚡', color:'#00838F', difficulty:'blue',
    meaning:'簡化流程；使更有效率', mnemonic:'stream+line → 讓流程變直線 → 簡化',
    family:{verb:'streamline',adj:'streamlined',noun:'streamlining'},
    sentence:'The new software will **streamline** the expense reporting process significantly.',
    audioCtx:'Our goal is to streamline the onboarding workflow for new hires.' },
  { id:'v07', word:'prominent', pos:'adj', emoji:'🌟', color:'#F57C00', difficulty:'gold',
    meaning:'顯著的；知名的', mnemonic:'pro+minent → 向前突出 → 顯著',
    family:{adj:'prominent',adv:'prominently',noun:'prominence'},
    sentence:'She holds a **prominent** position in the pharmaceutical industry.',
    audioCtx:'The new brand logo is displayed prominently on all marketing materials.' },
  { id:'v08', word:'reimburse', pos:'verb', emoji:'💰', color:'#558B2F', difficulty:'green',
    meaning:'報銷；償還費用', mnemonic:'re+imburse → 把錢放回去 → 報銷',
    family:{verb:'reimburse',noun:'reimbursement'},
    sentence:'Please submit receipts by Friday to be **reimbursed** for travel expenses.',
    audioCtx:'The company will reimburse all reasonable expenses from the business trip.' },
  { id:'v09', word:'adjacent', pos:'adj', emoji:'🏙️', color:'#37474F', difficulty:'blue',
    meaning:'毗鄰的；緊鄰的', mnemonic:'ad+jacent → 躺在旁邊 → 毗鄰',
    family:{adj:'adjacent',adv:'adjacently',noun:'adjacency'},
    sentence:'The conference room is **adjacent** to the main lobby on the ground floor.',
    audioCtx:'We are considering leasing the office space adjacent to our headquarters.' },
  { id:'v10', word:'forthcoming', pos:'adj', emoji:'📅', color:'#AD1457', difficulty:'gold',
    meaning:'即將到來的', mnemonic:'forth+coming → 向前走來 → 即將到來',
    family:{adj:'forthcoming'},
    sentence:'Details about the **forthcoming** merger will be announced next week.',
    audioCtx:'Please review the agenda for the forthcoming board meeting before Tuesday.' },
];

// ─── SR engine ────────────────────────────────────────────────────────────────
const SR_STATES = {
  new:      { label:'🆕 New',      color:'#1565C0', bg:'rgba(21,101,192,0.1)',  next:'learning', interval:1  },
  learning: { label:'🔄 Learning', color:'#E65100', bg:'rgba(230,81,0,0.1)',    next:'review',   interval:3  },
  review:   { label:'📅 Review',   color:'#6A1B9A', bg:'rgba(106,27,154,0.1)', next:'mastered', interval:7  },
  mastered: { label:'⭐ Mastered', color:'#2E7D32', bg:'rgba(46,125,50,0.1)',   next:'mastered', interval:30 },
};
function getSRState(id) {
  const seen={v01:3,v02:1,v03:0,v04:2,v05:5,v06:0,v07:1,v08:4,v09:0,v10:2};
  const n=seen[id]||0;
  if(n===0) return 'new'; if(n<=2) return 'learning'; if(n<=4) return 'review'; return 'mastered';
}

// ─── Modality engine ──────────────────────────────────────────────────────────
const MODALITIES = [
  { id:'read',   icon:'📖', label:'讀', en:'Read',   color:'#1565C0', desc:'閱讀語境，選出正確意思' },
  { id:'write',  icon:'✍️', label:'寫', en:'Write',  color:'#2E7D32', desc:'填入正確單字，完成句子' },
  { id:'listen', icon:'🎧', label:'聽', en:'Listen', color:'#E65100', desc:'從對話語境判斷單字意思' },
  { id:'speak',  icon:'🎙️', label:'說', en:'Speak',  color:'#6A1B9A', desc:'跟讀句子，練習語調與精準度' },
];
function getTodayModality() {
  const d = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  return MODALITIES[d % 4];
}
function getTodayWords() {
  const order = {new:0,learning:1,review:2,mastered:3};
  return VOCAB_BANK.map(v => ({...v, sr:getSRState(v.id)}))
    .sort((a,b) => order[a.sr] - order[b.sr]).slice(0,6);
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function SRBadge({state}) {
  const s = SR_STATES[state];
  return <span style={{padding:'3px 10px',borderRadius:9999,fontSize:10,fontWeight:900,background:s.bg,color:s.color}}>{s.label}</span>;
}
function ModalityBadge({m, large}) {
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:large?10:6,
      padding:large?'10px 20px':'5px 12px',background:m.color+'18',border:'1.5px solid '+m.color+'40',borderRadius:10}}>
      <span style={{fontSize:large?24:16}}>{m.icon}</span>
      <div>
        <div style={{fontSize:large?18:11,fontWeight:900,color:m.color,fontFamily:'var(--font-serif)',lineHeight:1}}>{m.label} · {m.en}</div>
        {large && <div style={{fontSize:12,color:'var(--ink-muted)',marginTop:2}}>{m.desc}</div>}
      </div>
    </div>
  );
}
// Render **bold** markdown in sentence strings
function HL({text, c}) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <span>{parts.map((p,i) => i%2===1
      ? <strong key={i} style={{color:c, background:c+'18', padding:'0 4px', borderRadius:4}}>{p}</strong>
      : <span key={i}>{p}</span>)}
    </span>
  );
}

// ─── Vocab visualization card ─────────────────────────────────────────────────
function VocabCard({vocab, showFull, dark}) {
  const tier = TIER[vocab.difficulty];
  return (
    <div style={{borderRadius:18,overflow:'hidden',border:'2px solid '+vocab.color+'30',background:dark?'#241e19':'#fff',boxShadow:'0 4px 24px '+vocab.color+'20'}}>
      <div style={{background:'linear-gradient(135deg,'+vocab.color+','+vocab.color+'cc)',padding:'20px 24px',display:'flex',alignItems:'center',gap:16}}>
        <div style={{fontSize:48}}>{vocab.emoji}</div>
        <div>
          <div style={{fontSize:28,fontFamily:'var(--font-serif)',fontWeight:900,color:'#fff',letterSpacing:'-0.02em'}}>{vocab.word}</div>
          <div style={{display:'flex',gap:8,marginTop:6,flexWrap:'wrap'}}>
            <span style={{background:'rgba(255,255,255,0.25)',color:'#fff',fontSize:10,fontWeight:900,padding:'2px 8px',borderRadius:6}}>{vocab.pos.toUpperCase()}</span>
            <span style={{background:tier.tint,color:tier.text,fontSize:10,fontWeight:900,padding:'2px 8px',borderRadius:6}}>{tier.label}</span>
            <SRBadge state={vocab.sr} />
          </div>
        </div>
      </div>
      <div style={{padding:'20px 24px'}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:12,color:'var(--ink)'}}>{vocab.meaning}</div>
        <div style={{padding:'12px 16px',background:vocab.color+'0a',borderLeft:'3px solid '+vocab.color,borderRadius:'0 10px 10px 0',fontSize:14,lineHeight:1.7,color:'var(--ink)',marginBottom:14}}>
          <HL text={vocab.sentence} c={vocab.color} />
        </div>
        {showFull && <>
          <div style={{padding:'10px 14px',background:'var(--paper-muted)',borderRadius:10,fontSize:13,color:'var(--ink-muted)',marginBottom:14,display:'flex',gap:8}}>
            <span>🧠</span>
            <span><strong style={{color:'var(--ink)'}}>記憶錨：</strong>{vocab.mnemonic}</span>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:900,color:'var(--ink-muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>Word Family</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {Object.entries(vocab.family).map(([p,f]) => (
                <span key={p} style={{padding:'4px 10px',borderRadius:6,fontSize:12,fontWeight:700,background:vocab.color+'12',border:'1px solid '+vocab.color+'30',color:vocab.color}}>{p}: {f}</span>
              ))}
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}

// ─── Question type: Read ──────────────────────────────────────────────────────
function ReadQ({vocab, onAnswer}) {
  const [sel,setSel] = useSQ(null);
  const [rev,setRev] = useSQ(false);
  const opts = useMQ(() => [vocab.meaning, ...VOCAB_BANK.filter(v=>v.id!==vocab.id).sort(()=>Math.random()-0.5).slice(0,3).map(v=>v.meaning)].sort(()=>Math.random()-0.5), [vocab.id]);
  const submit = () => { if(!sel||rev) return; setRev(true); setTimeout(()=>onAnswer(sel===vocab.meaning),900); };
  return (
    <div>
      <div style={{padding:'16px 20px',background:'var(--paper-muted)',borderRadius:14,borderLeft:'4px solid #1565C0',marginBottom:24,fontFamily:'Georgia,serif',fontSize:15,lineHeight:1.8,color:'var(--ink)'}}>
        <HL text={vocab.sentence} c="#1565C0" />
      </div>
      <p style={{fontWeight:700,fontSize:15,marginBottom:16}}>上文中 <strong style={{color:'#1565C0'}}>"{vocab.word}"</strong> 最貼近哪個意思？</p>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {opts.map((opt,i) => {
          const isSel=sel===opt, isC=opt===vocab.meaning;
          let bg='var(--paper-card)', bd='var(--border)';
          if(rev) { if(isC){bg='rgba(46,125,50,0.08)';bd='#2E7D32';} else if(isSel){bg='rgba(198,40,40,0.06)';bd='var(--state-error)';} }
          else if(isSel) { bg='#1565C010'; bd='#1565C0'; }
          return (
            <button key={i} onClick={()=>!rev&&setSel(opt)} style={{textAlign:'left',padding:'13px 18px',borderRadius:12,border:'1.5px solid '+bd,background:bg,color:'var(--ink)',fontSize:14,cursor:rev?'default':'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:12,transition:'all 150ms'}}>
              <span style={{width:22,height:22,borderRadius:6,background:'#1565C015',color:'#1565C0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,flexShrink:0}}>{String.fromCharCode(65+i)}</span>
              <span style={{flex:1}}>{opt}</span>
              {rev&&isC&&<Icon name="check" size={16} style={{color:'#2E7D32'}}/>}
              {rev&&isSel&&!isC&&<Icon name="x" size={16} style={{color:'var(--state-error)'}}/>}
            </button>
          );
        })}
      </div>
      {!rev && <div style={{marginTop:20,textAlign:'right'}}><Button variant="primary" style={{background:'#1565C0',boxShadow:'0 4px 0 rgba(13,71,161,0.3)'}} onClick={submit} disabled={!sel}>確認答案</Button></div>}
    </div>
  );
}

// ─── Question type: Write ─────────────────────────────────────────────────────
function WriteQ({vocab, onAnswer}) {
  const [typed,setTyped] = useSQ('');
  const [rev,setRev] = useSQ(false);
  const inputRef = useRQ();
  const blank = vocab.sentence.replace(/\*\*(.+?)\*\*/, '________');
  useEQ(() => { setTimeout(()=>inputRef.current&&inputRef.current.focus(), 100); }, []);
  const ok = typed.trim().toLowerCase() === vocab.word.toLowerCase();
  const submit = () => { if(!typed.trim()||rev) return; setRev(true); setTimeout(()=>onAnswer(ok), 1200); };
  return (
    <div>
      <div style={{padding:'16px 20px',background:'var(--paper-muted)',borderRadius:14,borderLeft:'4px solid #2E7D32',marginBottom:24,fontFamily:'Georgia,serif',fontSize:15,lineHeight:1.9}}>{blank}</div>
      <p style={{fontWeight:700,fontSize:15,marginBottom:4}}>空格中應填入哪個單字？（提示：{vocab.meaning}）</p>
      <p style={{fontSize:12,color:'var(--ink-muted)',marginBottom:16}}>詞性：<strong>{vocab.pos}</strong> · 字母數：{vocab.word.length}</p>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <input ref={inputRef} value={typed} onChange={e=>!rev&&setTyped(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="輸入單字…"
          style={{flex:1,padding:'14px 18px',borderRadius:12,fontSize:16,border:'1.5px solid '+(rev?(ok?'#2E7D32':'var(--state-error)'):'var(--border)'),background:rev?(ok?'rgba(46,125,50,0.06)':'rgba(198,40,40,0.06)'):'var(--paper-card)',fontFamily:'var(--font-sans)',color:'var(--ink)',outline:'none'}}
          onFocus={e=>!rev&&(e.target.style.borderColor='#2E7D32')}
          onBlur={e=>!rev&&(e.target.style.borderColor='var(--border)')} />
        {!rev && <Button variant="primary" style={{background:'#2E7D32',boxShadow:'0 4px 0 rgba(27,94,32,0.3)',height:48,padding:'0 20px'}} onClick={submit} disabled={!typed.trim()}>送出</Button>}
      </div>
      {rev && <div style={{marginTop:14,padding:'14px 18px',borderRadius:12,animation:'slideUp 300ms var(--ease-out) both',background:ok?'rgba(46,125,50,0.08)':'rgba(198,40,40,0.06)',border:'1px solid '+(ok?'#2E7D32':'var(--state-error)')}}>
        {ok ? <><strong style={{color:'#2E7D32'}}>✓ 正確！</strong> "{vocab.word}" — {vocab.meaning}</>
            : <><strong style={{color:'var(--state-error)'}}>✗ 答案是：</strong><strong> {vocab.word}</strong> — {vocab.meaning}</>}
      </div>}
    </div>
  );
}

// ─── Question type: Listen ────────────────────────────────────────────────────
function ListenQ({vocab, onAnswer}) {
  const [sel,setSel] = useSQ(null);
  const [rev,setRev] = useSQ(false);
  const [played,setPlayed] = useSQ(false);
  const opts = useMQ(() => [vocab.meaning, ...VOCAB_BANK.filter(v=>v.id!==vocab.id).sort(()=>Math.random()-0.5).slice(0,3).map(v=>v.meaning)].sort(()=>Math.random()-0.5), [vocab.id]);
  const submit = () => { if(!sel||rev) return; setRev(true); setTimeout(()=>onAnswer(sel===vocab.meaning),900); };
  return (
    <div>
      <div style={{padding:'20px 24px',background:'var(--paper-muted)',borderRadius:14,marginBottom:24,display:'flex',alignItems:'center',gap:16}}>
        <button onClick={()=>setPlayed(true)} style={{width:52,height:52,borderRadius:9999,border:'none',background:played?'var(--paper-card)':'#E65100',color:played?'var(--ink-muted)':'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 200ms',boxShadow:played?'none':'0 4px 0 rgba(191,54,12,0.4)'}}>
          <Icon name="play" size={22} />
        </button>
        <div style={{flex:1}}>
          <div style={{fontSize:12,color:'var(--ink-muted)',marginBottom:6}}>{played ? '🎧 播放完畢 — 根據語境判斷底線單字的意思' : '點擊播放，仔細聆聽對話語境'}</div>
          {played && <div style={{fontSize:13,fontFamily:'Georgia,serif',lineHeight:1.7,color:'var(--ink)',animation:'fadeIn 400ms both'}}>
            "{vocab.audioCtx.split(vocab.word).map((p,i,arr) => i<arr.length-1
              ? <span key={i}>{p}<strong style={{borderBottom:'2px solid #E65100',color:'#E65100'}}>{vocab.word}</strong></span>
              : <span key={i}>{p}</span>)}"
          </div>}
        </div>
      </div>
      {played && <div style={{animation:'slideUp 300ms var(--ease-out) both'}}>
        <p style={{fontWeight:700,fontSize:15,marginBottom:16}}>對話中 <strong style={{color:'#E65100'}}>"{vocab.word}"</strong> 的意思最接近？</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {opts.map((opt,i) => {
            const isSel=sel===opt, isC=opt===vocab.meaning;
            let bg='var(--paper-card)', bd='var(--border)';
            if(rev) { if(isC){bg='rgba(46,125,50,0.08)';bd='#2E7D32';} else if(isSel){bg='rgba(198,40,40,0.06)';bd='var(--state-error)';} }
            else if(isSel) { bg='#E6510010'; bd='#E65100'; }
            return (
              <button key={i} onClick={()=>!rev&&setSel(opt)} style={{textAlign:'left',padding:'13px 18px',borderRadius:12,border:'1.5px solid '+bd,background:bg,color:'var(--ink)',fontSize:14,cursor:rev?'default':'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:12,transition:'all 150ms'}}>
                <span style={{width:22,height:22,borderRadius:6,background:'#E6510015',color:'#E65100',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900,flexShrink:0}}>{String.fromCharCode(65+i)}</span>
                <span style={{flex:1}}>{opt}</span>
                {rev&&isC&&<Icon name="check" size={16} style={{color:'#2E7D32'}}/>}
                {rev&&isSel&&!isC&&<Icon name="x" size={16} style={{color:'var(--state-error)'}}/>}
              </button>
            );
          })}
        </div>
        {!rev && <div style={{marginTop:20,textAlign:'right'}}><Button variant="primary" style={{background:'#E65100',boxShadow:'0 4px 0 rgba(191,54,12,0.3)'}} onClick={submit} disabled={!sel}>確認答案</Button></div>}
      </div>}
    </div>
  );
}

// ─── Question type: Speak ─────────────────────────────────────────────────────
function SpeakQ({vocab, onAnswer}) {
  const [typed,setTyped] = useSQ('');
  const [rev,setRev] = useSQ(false);
  const inputRef = useRQ();
  const target = vocab.sentence.replace(/\*\*/g, '');
  const norm = s => s.toLowerCase().replace(/[^a-z0-9\s]/g,'').trim();
  const tok  = s => norm(s).split(/\s+/).filter(Boolean);
  const tW   = tok(target), uW = tok(typed);
  const diff = tW.map((w,i) => ({word:w, status:uW[i]===undefined?'pending':uW[i]===w?'correct':'wrong'}));
  const acc  = Math.round(diff.filter(w=>w.status==='correct').length / tW.length * 100);
  useEQ(() => { setTimeout(()=>inputRef.current&&inputRef.current.focus(), 100); }, []);
  const submit = () => { if(!typed.trim()||rev) return; setRev(true); setTimeout(()=>onAnswer(acc>=70), 1200); };
  return (
    <div>
      <div style={{padding:'20px 24px',background:'var(--paper-muted)',borderRadius:14,borderLeft:'4px solid #6A1B9A',marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:900,color:'#6A1B9A',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10}}>🎙️ 大聲複誦這個句子：</div>
        <div style={{fontFamily:'Georgia,serif',fontSize:16,lineHeight:1.8,color:'var(--ink)'}}>"<HL text={vocab.sentence} c="#6A1B9A"/>"</div>
        <div style={{marginTop:10,padding:'6px 12px',background:'#6A1B9A18',borderRadius:8,fontSize:12,color:'#6A1B9A',fontWeight:700}}>語調提示：stress "{vocab.word}" — {vocab.meaning}</div>
      </div>
      {typed && <div style={{padding:'14px 18px',background:'var(--paper-card)',border:'1px solid var(--border)',borderRadius:12,marginBottom:14,display:'flex',flexWrap:'wrap',gap:'6px 10px'}}>
        {diff.map((w,i) => (
          <span key={i} style={{fontSize:15,fontFamily:'var(--font-serif)',fontWeight:700,padding:'2px 6px',borderRadius:6,
            background:w.status==='correct'?'rgba(46,125,50,0.1)':w.status==='wrong'?'rgba(198,40,40,0.08)':'var(--paper-muted)',
            color:w.status==='correct'?'#2E7D32':w.status==='wrong'?'var(--state-error)':'var(--ink-faint)'}}>{w.word}</span>
        ))}
        <span style={{fontSize:11,color:'var(--ink-muted)',alignSelf:'center',marginLeft:4}}>精準度 {acc}%</span>
      </div>}
      <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
        <textarea ref={inputRef} value={typed} onChange={e=>!rev&&setTyped(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),submit())}
          placeholder="憑記憶輸入剛才複誦的句子… (Enter 送出)" rows={2}
          style={{flex:1,resize:'none',padding:'12px 16px',borderRadius:12,border:'1.5px solid var(--border)',background:'var(--paper-card)',fontFamily:'var(--font-sans)',fontSize:14,lineHeight:1.6,color:'var(--ink)',outline:'none'}}
          onFocus={e=>e.target.style.borderColor='#6A1B9A'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
        {!rev && <Button variant="primary" style={{background:'#6A1B9A',boxShadow:'0 4px 0 rgba(74,20,140,0.3)',height:52,padding:'0 20px',flexShrink:0}} onClick={submit} disabled={!typed.trim()}>送出</Button>}
      </div>
      {rev && <div style={{marginTop:14,padding:'14px 18px',borderRadius:12,background:acc>=70?'rgba(46,125,50,0.08)':'rgba(230,81,0,0.06)',border:'1px solid '+(acc>=70?'#2E7D32':'#E65100'),animation:'slideUp 300ms var(--ease-out) both',fontSize:13}}>
        {acc>=70?<strong style={{color:'#2E7D32'}}>✓ 通過！精準度 {acc}%</strong>:<strong style={{color:'#E65100'}}>繼續加油！精準度 {acc}%</strong>}
        <div style={{marginTop:8,color:'var(--ink-muted)',lineHeight:1.6}}>標準句：<em>"{target}"</em></div>
      </div>}
    </div>
  );
}

// ─── Login gate modal ─────────────────────────────────────────────────────────
function DailyQuestGate({goNav, demo, onSkip}) {
  const m = getTodayModality();
  const words = getTodayWords();
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:24,backdropFilter:'blur(6px)'}}>
      <PaperCard accent="top-terra" style={{padding:40,maxWidth:520,width:'100%',animation:'slideUp 400ms var(--ease-out) both',textAlign:'center'}}>
        <div style={{fontSize:56,marginBottom:12}}>{m.icon}</div>
        <Eyebrow style={{marginBottom:8}}>今日任務 · Daily Quest</Eyebrow>
        <h2 style={{marginBottom:8}}>歡迎回來，{demo.firstName}！</h2>
        <p style={{color:'var(--ink-muted)',fontSize:14,lineHeight:1.7,marginBottom:24}}>
          今日連續學習第 <strong style={{color:'var(--terra)'}}>{demo.streak}</strong> 天 🔥<br/>
          今天的模式是 <strong style={{color:m.color}}>{m.icon} {m.label} · {m.en}</strong>
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:28}}>
          {[
            {v:words.length+'題', l:'今日單字'},
            {v:words.filter(w=>w.sr==='new').length+'🆕 '+words.filter(w=>w.sr==='learning'||w.sr==='review').length+'🔄', l:'New + 複習'},
            {v:'+60~180', l:'完成 PTS'},
          ].map((s,i) => (
            <div key={i} style={{padding:'14px 10px',background:'var(--paper-muted)',borderRadius:12,border:'1px solid var(--border)'}}>
              <div style={{fontFamily:'var(--font-serif)',fontWeight:900,fontSize:15,marginBottom:4}}>{s.v}</div>
              <div style={{fontSize:11,color:'var(--ink-muted)'}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Button variant="primary" style={{fontSize:15,padding:'14px 0',width:'100%'}} onClick={()=>goNav('daily-quest-run')} icon="arrowRight">
            開始今日訓練 ({words.length} 題)
          </Button>
          <button onClick={onSkip} style={{background:'transparent',border:'none',cursor:'pointer',fontSize:13,color:'var(--ink-muted)',padding:'8px',fontFamily:'var(--font-sans)'}}>
            稍後再做，先進主頁 →
          </button>
        </div>
      </PaperCard>
    </div>
  );
}

// ─── Hub screen ───────────────────────────────────────────────────────────────
function DailyQuestHub({goNav, demo, dark}) {
  const m = getTodayModality();
  const words = getTodayWords();
  const srC = {new:0,learning:0,review:0,mastered:0};
  words.forEach(w => srC[w.sr]++);
  return (
    <div style={{minHeight:'100vh',background:dark?'#1a1612':'var(--paper-base)'}}>
      <Navbar current="practice" onNav={goNav} demo={demo} dark={dark} />
      <main style={{maxWidth:1100,margin:'0 auto',padding:'48px 24px 80px'}}>
        <div style={{marginBottom:36}}>
          <Eyebrow>Daily Quest · 今日任務</Eyebrow>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
            <div>
              <h1 style={{marginBottom:10}}>每日語言訓練</h1>
              <p style={{color:'var(--ink-muted)',fontSize:15,maxWidth:540,lineHeight:1.6,marginBottom:10}}>6 個單字 · 今日模式：</p>
              <ModalityBadge m={m} large />
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {Object.entries(srC).filter(([,v])=>v>0).map(([state,count]) => {
                const s = SR_STATES[state];
                return <div key={state} style={{padding:'12px 20px',background:s.bg,borderRadius:12,border:'1px solid '+s.color+'30',textAlign:'center'}}>
                  <div style={{fontSize:18,fontFamily:'var(--font-serif)',fontWeight:900,color:s.color}}>{count}</div>
                  <div style={{fontSize:10,color:s.color,fontWeight:700}}>{s.label}</div>
                </div>;
              })}
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:36}}>
          {[
            {icon:'🖼️',title:'視覺化',desc:'字根+Emoji+詞族記憶錨',color:'#1565C0'},
            {icon:'🌊',title:'語言沉浸',desc:'全英文語境句，中文輔助',color:'#00838F'},
            {icon:'📈',title:'間隔重複',desc:'Ebbinghaus記憶曲線排程',color:'#6A1B9A'},
            {icon:m.icon,title:'聽說讀寫',desc:'今日：'+m.label+' '+m.en,color:m.color},
          ].map(p => (
            <div key={p.title} style={{padding:'14px 16px',borderRadius:12,background:p.color+'0c',border:'1px solid '+p.color+'20'}}>
              <div style={{fontSize:22,marginBottom:6}}>{p.icon}</div>
              <div style={{fontWeight:900,fontSize:13,color:p.color,marginBottom:3}}>{p.title}</div>
              <div style={{fontSize:11,color:'var(--ink-muted)',lineHeight:1.4}}>{p.desc}</div>
            </div>
          ))}
        </div>
        <SectionHeader title="今日單字" eyebrow={'Today\'s Words · '+words.length+' items · '+m.icon+' '+m.label+'模式'} />
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:40}}>
          {words.map(v => (
            <div key={v.id} style={{borderRadius:14,overflow:'hidden',border:'2px solid '+v.color+'25',background:dark?'#241e19':'#fff'}}>
              <div style={{background:'linear-gradient(135deg,'+v.color+'dd,'+v.color+'99)',padding:'14px 18px',display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:32}}>{v.emoji}</span>
                <div>
                  <div style={{fontSize:18,fontFamily:'var(--font-serif)',fontWeight:900,color:'#fff'}}>{v.word}</div>
                  <SRBadge state={v.sr} />
                </div>
              </div>
              <div style={{padding:'10px 18px',fontSize:13,color:'var(--ink-muted)'}}>{v.meaning}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'40px 24px',background:'var(--paper-card)',borderRadius:20,border:'1px solid var(--border)'}}>
          <div style={{fontSize:48,marginBottom:12}}>{m.icon}</div>
          <h2 style={{marginBottom:8}}>今日模式：{m.label} · {m.en}</h2>
          <p style={{color:'var(--ink-muted)',fontSize:14,marginBottom:28,maxWidth:400,margin:'0 auto 28px'}}>{m.desc}。完成 6 題可獲得 +120–220 PTS。</p>
          <Button variant="primary" style={{fontSize:16,padding:'14px 36px'}} onClick={()=>goNav('daily-quest-run')} icon="arrowRight">開始今日訓練</Button>
        </div>
      </main>
    </div>
  );
}

// ─── Runner screen ────────────────────────────────────────────────────────────
function DailyQuestRunner({goNav, demo, firePoints, fireConfetti, setDemo, dark, onFinish}) {
  const m = getTodayModality();
  const words = getTodayWords();
  const [idx,setIdx]         = useSQ(0);
  const [results,setResults] = useSQ([]);
  const [showCard,setShowCard] = useSQ(true);
  const [done,setDone]       = useSQ(false);
  const vocab = words[idx];

  const handleAnswer = useCQ((correct) => {
    const updated = [...results, {id:vocab.id, correct}];
    setResults(updated);
    if (idx+1 >= words.length) {
      const pts = 60 + updated.filter(r=>r.correct).length * 20;
      firePoints && firePoints(pts, '每日訓練·'+m.label+'模式');
      if (updated.filter(r=>r.correct).length >= 5) fireConfetti && fireConfetti();
      setTimeout(() => setDemo && setDemo(d=>({...d,points:d.points+pts,completed:d.completed+1})), 800);
      setDone(true);
    } else {
      setShowCard(true);
      setIdx(i => i+1);
    }
  }, [idx, results, words.length, vocab]);

  if (done) {
    const total = results.length;
    const correct = results.filter(r=>r.correct).length;
    const pct = Math.round(correct/total*100);
    const nextM = MODALITIES[(MODALITIES.indexOf(m)+1)%4];
    const extras = [
      {icon:'🎮', title:'玩單字遊戲',  desc:'Word Match +100 PTS',  route:'games'},
      {icon:'🗣️', title:'AI 口說對話', desc:'情境演練 +150 PTS',    route:'ai-conversation'},
      {icon:'🎧', title:'跟讀練習',    desc:'Shadowing +80 PTS',    route:'shadowing'},
    ];
    return (
      <div style={{minHeight:'100vh',background:'var(--paper-base)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
        <div style={{maxWidth:640,width:'100%'}}>
          <PaperCard accent="top-terra" style={{padding:48,textAlign:'center',animation:'slideUp 500ms var(--ease-out) both',marginBottom:20}}>
            <div style={{fontSize:64,marginBottom:16}}>{pct>=83?'🏆':pct>=60?'🎉':'💪'}</div>
            <Eyebrow style={{marginBottom:8}}>每日任務完成 · {m.icon} {m.en} Mode</Eyebrow>
            <h2 style={{marginBottom:4}}>正確率 {pct}%</h2>
            <p style={{color:'var(--ink-muted)',fontSize:14,marginBottom:20}}>
              {pct>=83?'✨ 表現優異！這些單字快要進入 Mastered 了。':pct>=60?'不錯！間隔重複會在明後天複習錯誤的單字。':'繼續努力，系統會在明天安排重點複習。'}
            </p>
            <div style={{textAlign:'left',marginBottom:20,display:'flex',flexDirection:'column',gap:6}}>
              {words.map((v,i) => {
                const r = results[i]; if(!r) return null;
                const nextSR = r.correct ? SR_STATES[v.sr].next : 'learning';
                return (
                  <div key={v.id} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 12px',borderRadius:10,background:r.correct?'rgba(46,125,50,0.06)':'rgba(198,40,40,0.04)',border:'1px solid '+(r.correct?'rgba(46,125,50,0.3)':'rgba(198,40,40,0.2)')}}>
                    <span style={{fontSize:22,flexShrink:0}}>{v.emoji}</span>
                    <div style={{flex:1}}><div style={{fontWeight:900,fontSize:14}}>{v.word}</div><div style={{fontSize:11,color:'var(--ink-muted)'}}>{v.meaning}</div></div>
                    <div style={{textAlign:'right'}}><SRBadge state={nextSR}/><div style={{fontSize:10,color:'var(--ink-muted)',marginTop:2}}>{r.correct?'下次：'+SR_STATES[nextSR].interval+'天後':'明天重練'}</div></div>
                    <span style={{fontSize:16}}>{r.correct?'✅':'❌'}</span>
                  </div>
                );
              })}
            </div>
            <div style={{padding:'12px 16px',background:'var(--paper-muted)',borderRadius:10,marginBottom:24,fontSize:13,color:'var(--ink-muted)',textAlign:'left'}}>
              <strong style={{color:'var(--ink)'}}>明日模式：</strong>{nextM.icon} {nextM.label} · {nextM.en} — {nextM.desc}
            </div>
            <Button variant="primary" style={{width:'100%',fontSize:15,padding:'14px 0'}} onClick={()=>{onFinish&&onFinish();goNav('dashboard');}} icon="arrowRight">進入主頁</Button>
          </PaperCard>
          <div style={{padding:'20px 24px',background:'var(--paper-card)',borderRadius:16,border:'1px solid var(--border)',animation:'slideUp 600ms var(--ease-out) both'}}>
            <Eyebrow style={{marginBottom:12}}>繼續賺取額外積分 · Extra Points</Eyebrow>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {extras.map(ex => (
                <button key={ex.route} onClick={()=>goNav(ex.route)} style={{padding:'16px 12px',textAlign:'center',background:'var(--paper-muted)',border:'1px solid var(--border)',borderRadius:12,cursor:'pointer',fontFamily:'var(--font-sans)',transition:'all 200ms'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--terra)';e.currentTarget.style.transform='translateY(-2px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';}}>
                  <div style={{fontSize:28,marginBottom:8}}>{ex.icon}</div>
                  <div style={{fontWeight:900,fontSize:13,marginBottom:4}}>{ex.title}</div>
                  <div style={{fontSize:11,color:'var(--terra)',fontWeight:700}}>{ex.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--paper-base)',display:'flex',flexDirection:'column'}}>
      <div style={{background:'var(--paper-card)',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px',height:72,display:'flex',alignItems:'center',gap:20}}>
          <button onClick={()=>goNav('daily-quest')} style={{background:'transparent',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:'var(--ink-muted)',fontWeight:700,fontSize:13}}>
            <Icon name="arrowLeft" size={16} /> 退出
          </button>
          <div style={{height:24,width:1,background:'var(--border)'}} />
          <ModalityBadge m={m} />
          <div style={{flex:1}} />
          <div style={{display:'flex',gap:20,fontSize:12}}>
            <div><Eyebrow color="var(--ink-muted)" style={{fontSize:9}}>題目</Eyebrow><div style={{fontFamily:'var(--font-serif)',fontWeight:900,fontSize:14}}>{idx+1} / {words.length}</div></div>
            {results.length>0 && <div><Eyebrow color="var(--ink-muted)" style={{fontSize:9}}>正確</Eyebrow><div style={{fontFamily:'var(--font-serif)',fontWeight:900,fontSize:14,color:'#2E7D32'}}>{results.filter(r=>r.correct).length}/{results.length}</div></div>}
          </div>
        </div>
        <div style={{height:4,background:'var(--paper-muted)'}}>
          <div style={{height:'100%',width:(idx/words.length*100)+'%',background:m.color,transition:'width 400ms var(--ease-out)'}} />
        </div>
      </div>
      <div style={{flex:1,maxWidth:1100,width:'100%',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 380px',gap:0}}>
        <div style={{padding:'36px 32px 80px',overflowY:'auto'}}>
          <div key={vocab.id} style={{animation:'slideUp 300ms var(--ease-out) both'}}>
            {m.id==='read'   && <ReadQ   vocab={vocab} onAnswer={handleAnswer} />}
            {m.id==='write'  && <WriteQ  vocab={vocab} onAnswer={handleAnswer} />}
            {m.id==='listen' && <ListenQ vocab={vocab} onAnswer={handleAnswer} />}
            {m.id==='speak'  && <SpeakQ  vocab={vocab} onAnswer={handleAnswer} />}
          </div>
        </div>
        <div style={{background:'var(--paper-card)',borderLeft:'1px solid var(--border)',padding:24,overflowY:'auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <Eyebrow>單字視覺化</Eyebrow>
            <button onClick={()=>setShowCard(c=>!c)} style={{background:'transparent',border:'none',cursor:'pointer',fontSize:12,color:'var(--ink-muted)',fontFamily:'var(--font-sans)'}}>{showCard?'收起 ▲':'展開 ▼'}</button>
          </div>
          {showCard && <div style={{animation:'slideUp 250ms var(--ease-out) both'}}><VocabCard vocab={vocab} showFull={m.id!=='write'} dark={dark} /></div>}
          <div style={{marginTop:24}}>
            <Eyebrow color="var(--ink-muted)" style={{marginBottom:10}}>今日佇列 · SR Queue</Eyebrow>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {words.map((v,i) => (
                <div key={v.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,background:i===idx?m.color+'12':'transparent',border:'1px solid '+(i===idx?m.color+'40':'transparent')}}>
                  <span style={{fontSize:18}}>{v.emoji}</span>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{v.word}</div></div>
                  {i<idx && results[i] && <span>{results[i].correct?'✅':'❌'}</span>}
                  {i===idx && <span style={{fontSize:10,color:m.color,fontWeight:900}}>NOW</span>}
                  {i>idx && <SRBadge state={v.sr} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DailyQuestGate = DailyQuestGate;
window.DailyQuestHub  = DailyQuestHub;
window.DailyQuestRunner = DailyQuestRunner;
