---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code. Creates comprehensive implementation plans with bite-sized tasks, exact file paths, complete code examples, and TDD workflow.
---

# Writing Plans

Write comprehensive implementation plans assuming the engineer has zero context for the codebase. Document everything: which files to touch for each task, code, testing, how to test it. DRY. YAGNI. TDD. Frequent commits.

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## Bite-Sized Task Granularity

Each step is one action (2-5 minutes):
- "Write the failing test"
- "Run it to make sure it fails"
- "Implement the minimal code to make the test pass"
- "Run the tests and make sure they pass"
- "Commit"

## No Placeholders

Every step must contain the actual content. Plan failures:
- "TBD", "TODO", "implement later"
- "Add appropriate error handling" (without specifics)
- "Write tests for the above" (without actual test code)
- Steps that describe what to do without showing how

## Self-Review

After writing the complete plan:
1. **Spec coverage** - Can you point to a task that implements each requirement?
2. **Placeholder scan** - Search for red flags
3. **Type consistency** - Do names/methods match across tasks?
