---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes. Follows a disciplined 4-phase debugging process with root cause tracing.
---

# Systematic Debugging

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**The Iron Law:** NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

## The Four Phases

### Phase 1: Root Cause Investigation

1. Read error messages carefully - don't skip past errors
2. Reproduce consistently - exact steps, every time?
3. Check recent changes - git diff, recent commits
4. Gather evidence - log at component boundaries
5. Trace data flow - where does bad value originate?

### Phase 2: Pattern Analysis

1. Find working examples in the same codebase
2. Compare against references - read implementations completely
3. Identify differences between working and broken
4. Understand dependencies

### Phase 3: Hypothesis and Testing

1. Form single hypothesis: "I think X is root cause because Y"
2. Make the smallest possible change to test it
3. Verify before continuing
4. If wrong, form NEW hypothesis (don't add more fixes on top)

### Phase 4: Implementation

1. Create a failing test case first
2. Implement single fix addressing the root cause
3. Verify fix - test passes, no other tests broken
4. If fix doesn't work after 3 attempts: STOP and question the architecture

## Red Flags - STOP and Follow Process

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- Each fix reveals a new problem in a different place
