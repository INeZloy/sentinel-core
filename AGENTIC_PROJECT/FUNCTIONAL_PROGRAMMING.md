# 13. Functional Programming

Demonstrated in [`functional-demo.js`](./functional-demo.js), a standalone
module (run: `node functional-demo.js`).

## Coverage checklist

| Aspect | Where | Notes |
|---|---|---|
| Only final (immutable) data structures | `createMessage` | Every message is built via `Object.freeze` — reassignment throws instead of silently corrupting shared state |
| Side-effect-free (pure) functions | `isFromUser`, `wordCount`, `withRedactedDigits` | No I/O, no argument mutation, same input → same output every time |
| Higher-order functions | `pipe`, `countMatching` | Both take function(s) as arguments and operate generically over any predicate/transform |
| Functions as parameters and return values | `makeThresholdAlert` | Takes a `threshold` and *returns a new function* that closes over it |
| Closures / anonymous functions | `makeMessageCounter` | Returns an anonymous arrow function that closes over private `count` — a functional alternative to a class with a private field, with no external mutation path |

## Real output from a run

```
Messages from alice: 2
Threshold check: ALERT: 2 messages exceed threshold 1
Redacted alice messages: [
  { from: 'alice', text: 'call me at #####', ts: 1 },
  { from: 'alice', text: 'room ##, code ####', ts: 3 }
]
Closure-based ids: 1 2 3
Word count of first message: 4
Mutation correctly rejected: Cannot assign to read only property 'text' of object '#<Object>'
Message unchanged: call me at 12345
```

The last two lines are the immutability proof: attempting
`messages[0].text = 'MUTATED'` on a frozen object throws a `TypeError`
under strict mode instead of silently succeeding — the data structure is
genuinely final, not just "final by convention."

## Why this lives in the messenger project, not Sentinel-Core

Sentinel-Core is plain C, which has no native closures or first-class
functions beyond raw function pointers (already used there for the
`alert_plugin` callback — a lightweight HOF-style pattern, see
`vitals.c`). The full FP aspect set (closures, immutability enforcement,
composition via `pipe`) is demonstrated where the language actually
supports it natively, per the assignment's own framing of this as a
language-appropriate proof rather than a forced C reimplementation.