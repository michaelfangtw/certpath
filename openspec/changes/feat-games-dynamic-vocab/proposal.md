# Feat: Games — source vocab dynamically from VOCAB_BANK (closes #175)

## Problem
WORD_LEVELS, SOUND_POP, SCRAMBLE are hardcoded. VOCAB_BANK (from screens-daily-quest.jsx)
has words with SRS state that should feed the games.

## Load-order note
screens-games.jsx loads before screens-daily-quest.jsx, so VOCAB_BANK must be read inside
functions at call-time, not at the top level.

## Fix
1. Add `_getBank()`, `_srPriority()`, `buildWordMatchLevels()`, `buildSoundPops()`,
   `buildScrambles()` helpers above the game components.
2. Each game component computes its data once via useMemoGM calling the builders,
   prepending dynamic vocab-bank levels/rounds before the hardcoded fallbacks.

## Files changed
- `project/js/screens-games.jsx`
