# Fix: Games — post-game confirm buttons require scrolling (closes #174)

## Problem
When a game ends, the done/result panel renders below the fold (appended after the game board).
The user must scroll down to see the "next level" / "take points" buttons.

## Fix
Add `useEffectGM(() => { if (done) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [done])`
to all three game components (WordMatchGame, SoundPopGame, WordOrderGame).

## Files changed
- `project/js/screens-games.jsx`
