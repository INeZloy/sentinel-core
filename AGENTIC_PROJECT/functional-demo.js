/**
 * Functional Programming demo (Requirement #13)
 *
 * Deliberately separate from server.js — this is a standalone module
 * proving each FP aspect in isolation, so it's easy to point at exactly
 * which lines satisfy which sub-requirement.
 *
 * Run: node functional-demo.js
 */

'use strict';

/* ------------------------------------------------------------------
 * 1. Only final (immutable) data structures.
 * Object.freeze makes mutation attempts fail silently (or throw in
 * strict mode) instead of corrupting shared state.
 * ---------------------------------------------------------------- */
const createMessage = (from, text, ts) =>
  Object.freeze({ from, text, ts });

/* ------------------------------------------------------------------
 * 2. Pure, side-effect-free functions.
 * No I/O, no mutation of arguments, no reliance on external state —
 * same input always produces the same output.
 * ---------------------------------------------------------------- */
const isFromUser = (username) => (msg) => msg.from === username;

const wordCount = (msg) => msg.text.trim().split(/\s+/).filter(Boolean).length;

const withRedactedDigits = (msg) =>
  createMessage(msg.from, msg.text.replace(/\d/g, '#'), msg.ts);

/* ------------------------------------------------------------------
 * 3. Higher-order functions: functions that take and/or return
 * other functions (map/filter/reduce are the built-in HOFs; below
 * are custom ones on top of them).
 * ---------------------------------------------------------------- */
const pipe = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);

const countMatching = (predicateFn) => (messages) =>
  messages.filter(predicateFn).length;

/* ------------------------------------------------------------------
 * 4. Functions as parameters and return values.
 * `pipe` above returns a function. Here, a function is built and
 * returned based on a parameter — a small "strategy" factory.
 * ---------------------------------------------------------------- */
const makeThresholdAlert = (threshold) => (count) =>
  count > threshold ? `ALERT: ${count} messages exceed threshold ${threshold}` : 'OK';

/* ------------------------------------------------------------------
 * 5. Closures / anonymous functions.
 * `makeCounter` returns an anonymous function that closes over
 * private, encapsulated state (`count`) with no external mutation
 * path — a functional alternative to a class with private fields.
 * ---------------------------------------------------------------- */
const makeMessageCounter = () => {
  let count = 0; // captured by the closure below, not accessible outside
  return () => {
    count += 1;
    return count;
  };
};

/* ------------------------------------------------------------------
 * Demo run — combining all of the above.
 * ---------------------------------------------------------------- */
function demo() {
  const messages = [
    createMessage('alice', 'call me at 12345', 1),
    createMessage('bob', 'hey there', 2),
    createMessage('alice', 'room 42, code 9981', 3),
  ];

  const aliceOnly = countMatching(isFromUser('alice'))(messages);
  const alertText = makeThresholdAlert(1)(aliceOnly);

  const redactPipeline = pipe(
    (msgs) => msgs.filter(isFromUser('alice')),
    (msgs) => msgs.map(withRedactedDigits),
  );
  const redacted = redactPipeline(messages);

  const nextId = makeMessageCounter();

  console.log('Messages from alice:', aliceOnly);
  console.log('Threshold check:', alertText);
  console.log('Redacted alice messages:', redacted);
  console.log('Closure-based ids:', nextId(), nextId(), nextId());
  console.log('Word count of first message:', wordCount(messages[0]));

  // Proof of immutability: under 'use strict', mutating a frozen object
  // throws a TypeError instead of silently failing — even stronger
  // evidence than a silent no-op would be.
  try {
    messages[0].text = 'MUTATED';
  } catch (err) {
    console.log('Mutation correctly rejected:', err.message);
  }
  console.log('Message unchanged:', messages[0].text);
}

demo();

module.exports = {
  createMessage,
  isFromUser,
  wordCount,
  withRedactedDigits,
  pipe,
  countMatching,
  makeThresholdAlert,
  makeMessageCounter,
};