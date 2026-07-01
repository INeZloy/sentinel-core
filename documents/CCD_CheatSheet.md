# Clean Code Development (CCD) — Cheat Sheet

A 10-point quick reference for writing maintainable, readable code.

---

### 1. Meaningful Names
Variables, functions, and classes should reveal intent.
`daysSinceLastLogin` beats `d`. If a name needs a comment to explain it, rename it instead.

### 2. Functions Do One Thing
Each function should have a single, clear responsibility (Single Responsibility Principle).
If you can't describe what it does without using "and," split it.

### 3. Keep Functions Small
Aim for functions short enough to read on one screen.
Small functions are easier to test, name, and reuse.

### 4. Avoid Deep Nesting
More than 2–3 levels of nested `if`/`for` is a smell.
Use early returns (guard clauses), extract helper functions, or invert conditions to flatten logic.

### 5. DRY — Don't Repeat Yourself
Duplicated logic means duplicated bugs.
Extract repeated code into a shared function — but avoid premature or "clever" abstractions for one-off cases.

### 6. Comments Explain Why, Not What
Code should be self-explanatory about *what* it does.
Comments are for *why* a non-obvious decision was made (business rules, workarounds, trade-offs) — not for restating the code.

### 7. Consistent Formatting & Style
Follow one style guide, enforced by a linter/formatter (e.g., Prettier, Black, gofmt).
Consistency reduces cognitive load more than any individual style choice.

### 8. Error Handling Is Not an Afterthought
Handle errors explicitly, close to where they occur.
Don't swallow exceptions silently. Fail fast and loud rather than returning ambiguous nulls/-1s.

### 9. Tests as Documentation
Write tests that describe expected behavior clearly (Arrange–Act–Assert).
Well-named tests double as living documentation of intent.

### 10. Refactor Continuously (Boy Scout Rule)
Leave code cleaner than you found it.
Small, frequent refactors prevent the "big rewrite" trap and keep technical debt manageable.

---

*Quick gut-check before committing: Is the name clear? Is the function doing one thing? Is it flat, not nested? Is it tested? Would a stranger understand this in 6 months?*
