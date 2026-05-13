---
name: investigate
description: Systematic debugging with root cause investigation. Four phases: investigate, analyze, hypothesize, implement. Iron Law: no fixes without root cause. Use when asked to "debug this", "fix this bug", "why is this broken", "investigate this error", or "root cause analysis".
---

# Systematic Debugging & Investigation

## Iron Law

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

## Phase 1: Root Cause Investigation

1. **Collect symptoms** - Read error messages, stack traces, reproduction steps
2. **Read the code** - Trace from symptom back to potential causes
3. **Check recent changes** - `git log --oneline -20` on affected files
4. **Reproduce** - Can you trigger it deterministically?
5. **Trace data flow** - Where does bad value originate? Keep tracing up until you find the source

## Phase 2: Pattern Analysis

| Pattern | Signature | Where to look |
|---------|-----------|---------------|
| Race condition | Intermittent, timing-dependent | Concurrent access to shared state |
| Null propagation | TypeError, Cannot read property | Missing guards on optional values |
| State corruption | Inconsistent data, partial updates | Transactions, callbacks, hooks |
| Integration failure | Timeout, unexpected response | External API calls, service boundaries |
| Configuration drift | Works locally, fails in prod | Env vars, feature flags, DB state |

## Phase 3: Hypothesis Testing

1. Confirm hypothesis with a temp log/assertion at suspected root cause
2. If wrong: sanitize error, search for pattern, return to Phase 1
3. **3-strike rule:** If 3 hypotheses fail, STOP and question architecture

## Phase 4: Implementation

1. Fix the root cause, not the symptom
2. Minimal diff - fewest files, fewest lines
3. Write a regression test that fails without fix, passes with fix
4. Run full test suite

## Phase 5: Verification & Report

Output a structured debug report:
- **Symptom:** what the user observed
- **Root cause:** what was actually wrong
- **Fix:** what was changed (file:line)
- **Evidence:** test output showing fix works
- **Regression test:** file:line of new test
