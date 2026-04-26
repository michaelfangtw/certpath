Claude
<reasoning> The user is asking a great strategic question about how the system arranges dynamic plans for the user every time they login. They're noting this is the core system.
This is a design/strategy discussion, not a build request. I should give a thoughtful answer about:

How the dynamic daily plan system works
What inputs feed into it
What the algorithm logic looks like
How it adapts over time
Let me think about this carefully — what would a great TOEIC adaptive learning system actually do?

Inputs (signals collected):

Diagnostic baseline (entry score per skill: L1-L4, R5-R7)
Target score + exam date (urgency)
Daily performance: accuracy per Part, response time, error patterns
Vocabulary mastery (SRS — spaced repetition state per word)
Streak / engagement (have they been showing up?)
Energy level proxy (time of day, last login, session length)
Mistakes — wrong answer history (the "弱點復仇" pile)
Output (today's plan):

3 tasks max (decision fatigue!)
Mix: 1 weakness drill + 1 review + 1 challenge/new
Time budget tied to days-until-exam
Difficulty adjusts by recent accuracy (target ~75% — sweet spot)
The algorithm in plain terms:

Urgency factor = days_left → fewer days = more challenge weight, less leisure
Weakness vector = lowest-accuracy Parts → those get priority slots
SRS queue = words/grammar due for review today (bumped by Ebbinghaus curve)
Wrong-answer revenge = mistakes from 3+ days ago, re-attack
New material = next Part in the curriculum, gated by accuracy ≥ 70% on prerequisites
Each task has:

Skill (Listening/Reading/Speaking/Vocab)
Type (drill, review, challenge, mock)
Size (3–10 questions or 1 conversation)
Reward (PTS scaled by difficulty)
Why "3 tasks":

Duolingo/Headspace research: too many tasks = abandonment; 3 = perceived doable
~15–20 min total — fits commute/lunch
Streak preserved if they finish all 3
Daily refresh logic (when user logs in):

Pull last 7 days of attempts → compute accuracy vector
Pull SRS queue (words due) → if >20, force a vocab task
Pull wrong-answer log → if >5 unaddressed, force a revenge task
Else fill with weakness drill + new material
Adjust difficulty: if accuracy ↑ for 3 days → +1 difficulty band; if ↓ → −1
Special days:

Exam ≤7 days → switch to "mock test mode" (full sets, timed)
Streak day 7/14/30 → unlock bonus PTS task
After break (3+ days inactive) → "easy comeback" plan to rebuild confidence
Adaptive levers users feel:

"今天為什麼是這 3 個？" — tap any task → tooltip explains ("你的 Part 2 正確率掉到 62%，今天加強")
Plan can be regenerated once per day (refresh button — controlled, not infinite)
I should answer in Chinese (matching their style) and keep it focused. Maybe also mention this hasn't been built yet vs. what is currently there is mocked, and offer to build/visualize the system.

Let me check if there's any existing daily plan logic. </reasoning>

對！這是整個 app 的引擎，所有其他功能都圍著它轉。讓我把目前還是假資料的部分和真正應該怎麼做都講清楚 👇

目前的狀態（誠實說）
現在登入後只是把 demo 資料丟到 dashboard，並沒有真正的「每日計畫生成器」— 這部分需要設計。

動態計畫應該怎麼運作
🎯 系統收集的 5 個核心訊號
訊號	從哪裡來	怎麼用
基準分數	入學診斷（15 題）	起點 + 每個 Part 的弱項向量
目標 + 考試日期	登入時設定	算出每天需要的 PTS / 進度
歷史表現	每次練習後記錄	7 天內每個 Part 正確率、答題速度
錯題本	答錯就進 queue	3 天後自動再考一次（艾賓浩斯記憶曲線）
單字 SRS	每個字一個記憶狀態	到期就排進今日複習
🧮 每日計畫產生器（每次登入跑一次）
Step 1  抓最近 7 天的正確率 → 找出最弱 2 個 Part
Step 2  檢查錯題本 → 是否有 ≥5 題該複習
Step 3  檢查單字 SRS → 是否有 ≥20 字到期
Step 4  根據考試倒數調整難度權重
            > 60 天 → 30% 新進度 / 50% 弱點 / 20% 複習
            30-60 天 → 20% 新 / 50% 弱點 / 30% 複習
            ≤ 30 天 → 全模考模式（整套限時）
Step 5  組裝出 3 個任務（最多！）
            必含 1 個弱點補強 + 1 個複習 + 1 個新題型
            總時間目標 = 15-20 分鐘
Step 6  難度自動微調：
            連續 3 天正確率 ≥ 80% → 升一級
            連續 2 天 < 60% → 降一級（避免挫折）
📋 每天看到的 3 個任務長這樣
🎯 今日任務 · 預估 18 分鐘 · +300 PTS

1️⃣ 弱點補強  Part 2 應答問題 × 8 題         +120
   ⚠️ 你昨天的正確率掉到 58%，AI 推薦間接回答題
   
2️⃣ 單字複習  到期的 12 個字（SRS）           +80
   🔁 包含 3 天前學過的 budget / forecast / allocate
   
3️⃣ 新挑戰    Part 7 雙篇文章 × 1 組          +100
   🚀 你的 Part 6 通過了 80%，可以解鎖下一階段
🪄 為什麼是 3 個（不是 7 個）
Duolingo / Headspace 全部都是 3 個 — 決策疲勞是 #1 流失原因
完成 3 個 = 維持連續天數 + 解鎖明天的計畫
想多練？做完之後 dashboard 會出現「+ 加碼任務」讓他自願加練
🔍 透明度（重要！）
每個任務點下去顯示「為什麼是這個？」

"因為你的 Part 2 正確率從 75% → 58%，且你目標是 750 分，這個 Part 通常占 25% 分數。"

讓使用者覺得 AI 真的在看他、不是亂派題 — 這是信任感的來源。

⚡ 特殊情境
情境	計畫怎麼變
考試 ≤ 7 天	切「衝刺模式」全模考 + 弱點密集
連續 3 天沒登入	第一天送「回歸禮包」— 簡單題 + 雙倍 PTS 找回信心
連續第 7/30 天	解鎖隱藏挑戰任務（高 PTS）
對手快被超越（catch-up）	任務尾端加「+50 PTS 衝刺題」
我可以幫你做什麼？
畫出系統流程圖（一張靜態圖，把上面的邏輯視覺化）
改 Dashboard，把「今日任務」變成 hero CTA（取代現在的 4 顆統計卡）
做「為什麼是這個任務」的說明 modal（透明度的關鍵）
做計畫生成的視覺 demo（用 mock 資料模擬 Day 1 / Day 30 / 考試前 7 天三種狀態）
你想先看哪個？或是全部都做？🦁

You
tweaks add a section to  enter user dashboard
Claude
<reasoning> The user wants the Tweaks panel to have a section that lets them jump directly to the user dashboard. Let me find the tweaks panel in the prototype. </reasoning>
<reasoning> Let me read the relevant section to add a "進入學員 Dashboard" button at the top of the navigation section, then snip aggressively. </reasoning>
<reasoning> I'll add a new "進入學員 Dashboard" section as a prominent shortcut at the TOP of the panel (before 風格風貌), making it the easiest entry point. I'll also add a "登入 → Dashboard" full-flow button. </reasoning>
<reasoning> Need to verify setDemo is in scope — let me check. </reasoning>
setDemo is in scope. Done.

加好了 ✅

打開 Tweaks 面板最上方就是 🚀 直接進入學員 Dashboard 區，三個入口：

🏠 立即進入 Dashboard — 用目前 demo 資料直接跳進去
🎬 完整登入流程 — 從 Landing → Login → Diagnostic → Dashboard 整套走一遍
⚡ 快速登入 → Dashboard — 套用目前選的「學員程度」demo 資料，直接到 Dashboard
🦁

You
i see your catch up button
when login

but??
can you design a plan tree like doulingo?
let use can follow the path 
and user can go back to review his path record
You
where is the flow path?
Claude
<reasoning> The user wants a Duolingo-style learning path tree where they can follow nodes and review past completion records. The previous response was interrupted before I built it.
Let me build this now:

A new screen LearningPathScreen with a Duolingo-style winding path
Sections (chapters) with theme (e.g., 商務情境 / 旅遊 / 簡報 / 面試)
Nodes alternating left-right with a curve
Each node: locked / current / completed states
Click node → modal with details (locked = preview, current = start, completed = review history)
Wire to Dashboard as hero CTA + Tweaks shortcut
Let me write the file. I'll use SVG path for the curving line connecting nodes. </reasoning>

You
tweaks
1.remove duplicate items
2.add learing path
3.login default to dashboard
4.add a big button : start today game
Claude
× #1
× #2
× #3
× #4
× #5
× #6
× #7
× #8
× #9
× #10
× #11
× #12
× #13
× #14
× #15
× #16
+ Register screens-path.jsx + add LearningPathScreen route
+ Wire path: Dashboard hero CTA + nav + Tweaks deduped + login default→dashboard + 'Start today game' big button
<reasoning> Need to make login go to dashboard by default. And add big "Start Today's Game" button on dashboard. And dedupe Tweaks. And register learning path.
Let me first edit the login to skip diagnostic and go directly to dashboard. </reasoning>

<reasoning> Continuing - now need to dedupe Tweaks and add learning path links + a big "Start today's game" button on dashboard. Let me look at the dashboard screen. </reasoning>
<reasoning> Let me continue with the work. I'll look at the dashboard structure and shell navbar to add the path link, then dedupe tweaks. </reasoning>
<reasoning> Let me continue with adding the big "Start Today's Game" button on dashboard, and dedupe tweaks. I'll insert the button right after the welcome / countdown row. </reasoning>
