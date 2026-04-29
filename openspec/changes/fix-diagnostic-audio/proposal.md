# Fix: Diagnostic listening quiz — no sound (closes #171)

## Problem
`AudioPlayer` in `shell.jsx` only animates a progress bar; it never produces audio.
Listening questions pass their `audio` text via `transcript={q.audio}` but it is never spoken.

## Fix
Use the Web Speech API (`SpeechSynthesis`) inside `AudioPlayer.start()` to speak the
`transcript` text at the selected speed when the play button is clicked, and cancel on stop.
Gracefully no-ops when the API is unavailable.

## Files changed
- `project/js/shell.jsx`
