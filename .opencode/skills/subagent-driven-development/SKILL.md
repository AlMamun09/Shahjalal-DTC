---
name: subagent-driven-development
description: Execute implementation plans by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review. For multi-step feature implementation.
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Core principle:** Fresh subagent per task + two-stage review = high quality, fast iteration

## When to Use

- Have an implementation plan with independent tasks
- Stay in the same session
- Each task produces working, testable software

## The Process

1. Read plan, extract all tasks with full text, create task list
2. For each task:
   - Dispatch implementer subagent with full task text + context
   - Implementer implements, tests, commits, self-reviews
   - Dispatch spec compliance reviewer
   - Dispatch code quality reviewer
   - Loop until both approve

## Model Selection

- Mechanical implementation (1-2 files, clear spec) → fast/cheap model
- Integration/multi-file coordination → standard model
- Architecture, design, review → most capable model

## Implementer Statuses

- **DONE** → Proceed to spec compliance review
- **DONE_WITH_CONCERNS** → Read concerns before proceeding
- **NEEDS_CONTEXT** → Provide missing context and re-dispatch
- **BLOCKED** → Assess blocker, or escalate

## Red Flags

- Never start implementation on main/master without explicit consent
- Never skip reviews (spec compliance OR code quality)
- Never dispatch multiple implementation subagents in parallel (conflicts)
- Never accept "close enough" on spec compliance
