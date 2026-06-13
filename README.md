# CMU Event Compass

A hackathon prototype that unifies CMU event discovery into one personalized feed. Built with Claude at a CMU hackathon in November 2025.

**Live demo:** https://pazare.github.io/Claude-CMU-Hackathon/
**Pitch deck:** https://pazare.github.io/Claude-CMU-Hackathon/pitch.html

![CMU Event Compass home feed — the static demo served by the live link above](docs/screenshot.png)

## The problem

CMU events live in silos. Heinz, Tepper, SCS, HCII, Dietrich, and university-wide calendars each publish separately, and students discover events through a mix of newsletters, Discord, Slack, and flyers. The result is decision fatigue, missed opportunities, and calendars that never reflect what is actually happening on campus.

## What it does

Event Compass puts every school's events in one feed and lets students filter by what they care about:

- **Interest-based filtering** with tags like AI / ML, HCI, entrepreneurship, policy, data science, healthcare, and robotics
- **Multi-source aggregation** across Heinz, Tepper, SCS, HCII, Dietrich, and university-wide calendars
- **Date, format, and source filters** plus free-text search
- **Persistent preferences** saved locally, so the feed stays personalized between visits

The pitch deck extends the concept to a calendar add-on: students set interests once, and the upcoming week's matching events sync to Google or Apple Calendar as a single subscription instead of one-by-one manual entry.

## What is in this repo

Three artifacts from the hackathon day:

| Path                                             | What it is                                                                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                                     | Static high-fidelity mock of the home feed. This is what the live demo serves.                                                     |
| `pitch.html`                                     | Six-slide pitch deck for the calendar add-on concept, built as a standalone page.                                                  |
| `app/`, `components/`, `lib/`, `data/`, `types/` | Working Next.js 14 + TypeScript prototype of the same design, with functional filtering, onboarding, and localStorage persistence. |

## Running the Next.js prototype

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The static demo and pitch deck need only a browser.

## Development

The prototype is set up with the checks you would expect on a real project:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint (next/core-web-vitals)
npm run format:check # prettier
npm test            # vitest (lib filters/formatters/storage + component tests)
npm run build       # production build
```

The pure logic in `lib/` and the localStorage layer are covered by a Vitest
suite (run with a pinned clock so the date-relative tests are deterministic).
A GitHub Actions workflow (`.github/workflows/ci.yml`) runs typecheck, lint,
format check, tests, and build on every push and pull request.

## How Claude was used

Claude generated and iterated on all three artifacts during the hackathon: the static mock, the pitch deck, and the Next.js implementation. Human direction covered product scope, the unification concept, information architecture, and CMU-specific details such as schools, venues, and event types.

## Honest limitations

This is a one-day hackathon prototype, not a production system:

- Event data is mock data in `data/events.ts`. There is no live integration with CMU calendar feeds yet.
- The static mock and the Next.js app are parallel implementations of the same design (each with its own sample data), not a single codebase.
- Preferences live in localStorage only. There are no accounts and no backend.

## Roadmap to a real product

1. Replace mock data with real sources, parsing ICS feeds or scraping the public calendars of each school.
2. Ship the calendar subscription described in the pitch deck, generating a per-student ICS feed.
3. Add lightweight preference learning so the ranking improves as students accept or skip events.

## License

MIT. See `LICENSE`.
