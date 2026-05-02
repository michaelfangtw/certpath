# Proposal: Document custom window events in SA.md (issue #245)

## Problem

Two custom `window` events are used for cross-component communication but are
not mentioned anywhere in SA.md:

| Event | Dispatched by | Handled by | Purpose |
|-------|--------------|------------|---------|
| `certpath:openExamModal` | `DashboardScreen` (`screens-dashboard.jsx`) | `Navbar` (`shell.jsx`) | Opens `ExamTargetModal` from outside the Navbar |
| `certpath:examTargetSet` | `ExamTargetModal` (`shell.jsx`) | `CountdownCard` (`screens-dashboard.jsx`) | Notifies dashboard that exam date was saved to localStorage |

These are the only cross-file communication mechanism outside React props,
making them architecturally significant.

## Fix

Add a "Custom Events" section to SA.md (after Core Functions) documenting both
events with their payloads, dispatchers, and handlers.
