# Lessons Learned & Anti-Patterns

Document hard-won lessons, debugging breakthroughs, and recurring pitfalls in this repository to prevent repeating past mistakes.

## Anti-Patterns to Avoid
- *Example*: Do not mock database transactions in integration tests; use SQLite memory or test container.

## Known Gotchas
- *Example*: Modifying schema requires running `npm run db:generate` before compiling TypeScript.
