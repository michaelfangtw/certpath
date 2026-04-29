# Feat: Quiz Part 1 — distinct SVG scene illustrations (closes #176)

## Approach
Option 3 (SVG illustrations): lightweight, no external dependency, fully bundled.

## Changes
1. shell.jsx — extend Part1Photo to render 5 distinct SVG scenes:
   desk-laptop, meeting-room, reception, warehouse, presentation.
2. data.jsx — add 2 Part 1 questions to QUIZ_PARTS (meeting-room, reception kinds).
3. screens-diagnostic.jsx — pass q.photo?.kind to Part1Photo.
4. screens-practice.jsx — pass q.photo?.kind to Part1Photo.
