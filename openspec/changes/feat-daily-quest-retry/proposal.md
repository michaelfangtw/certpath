# Feat: Daily Quest — retry on wrong answer, explanation on correct (closes #173)

## Behaviour
- Wrong answer: highlight selection red, keep all options enabled so user can retry
- Correct answer: highlight green, reveal explanation panel (vocab.sentence + meaning), then
  auto-advance after 1800ms
- Only advance after finding the correct answer

## Implementation
Replace the single `rev` boolean in `ReadQ` and `ListenQ` with:
- `wrongSel` — the most recent wrong selection (cleared on next click)
- `correct` — true once the right answer is chosen

Explanation panel shows `vocab.meaning` and the sentence context from `vocab.sentence`.

## Files changed
- `project/js/screens-daily-quest.jsx`
