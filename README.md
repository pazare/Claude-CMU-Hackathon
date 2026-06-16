# CMU Event Compass

CMU Event Compass puts events from across Carnegie Mellon into one feed and lets students filter to the ones they care about. Heinz, Tepper, SCS, HCII, Dietrich, and university-wide calendars all publish separately today, so students piece together what is happening from newsletters, Slack, Discord, and flyers. The result is missed events and decision fatigue. This prototype shows what one personalized feed could look like.

Built with Claude at the CMU Claude Hackathon in November 2025.

**Live demo:** https://pazare.github.io/Claude-CMU-Hackathon/
**Pitch deck:** https://pazare.github.io/Claude-CMU-Hackathon/pitch.html

![CMU Event Compass: the live Next.js app](docs/screenshot.png)

The live demo is the real Next.js app, exported as a static site and deployed to GitHub Pages. The original static design mock is kept at https://pazare.github.io/Claude-CMU-Hackathon/mock.html.

## What it does

- **Interest filtering.** Pick tags such as AI / ML, HCI / Design, Entrepreneurship, Healthcare, Policy & Society, Data Science, Product Management, and Robotics. Turn on "Only show my interests" to narrow the feed to matching events.
- **Multi-source aggregation.** Events from Heinz, Tepper, SCS, HCII, Dietrich, and university-wide calendars appear in a single list.
- **Date, source, and search filters.** Limit to Today, This Week, or This Month, filter by source unit, and run a free-text search over titles, descriptions, and host organizations. Filters combine.
- **Day grouping.** Events group by day, upcoming first, with in-progress and past events handled correctly.
- **Persistent preferences.** Interests, selected sources, date range, and the "Only show my interests" toggle save to localStorage, so the feed stays personalized between visits.
- **Onboarding.** First-time visitors pick interests once; returning visitors skip straight to their feed.

## Run it

```bash
npm install && npm run dev
```

Then open http://localhost:3000.

Other commands:

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # next lint
npm run format        # prettier --write
npm run format:check  # prettier --check
npm test              # vitest
npm run build         # production build
```

## How it is built

Next.js 14 (App Router), React 18, and TypeScript in strict mode, styled with Tailwind CSS. Tests run on Vitest, with ESLint and Prettier for linting and formatting. The filtering and storage logic lives in plain functions in `lib/` and is unit tested with a pinned clock so the date-relative cases stay deterministic.

GitHub Actions runs typecheck, lint, format check, tests, and build on every push and pull request. A separate workflow deploys the static export to GitHub Pages.

Repo layout:

| Path                                             | What it is                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| `app/`, `components/`, `lib/`, `data/`, `types/` | The Next.js + TypeScript app: filtering, onboarding, persistence. |
| `public/mock.html`                               | The original static high-fidelity design mock.                    |
| `public/pitch.html`                              | The six-slide pitch deck.                                         |
| `*.test.ts(x)`                                   | Vitest unit and component tests.                                  |

## How Claude was used

Claude generated and iterated on all three artifacts (static mock, pitch deck, Next.js app) during the hackathon; human direction covered product scope, the unification concept, information architecture, and CMU-specific details such as schools, venues, and event types.

## What this is

A one-day hackathon prototype, not a production system.

- Event data is mock data in `data/events.ts`, seeded as offsets from "now" so Today and This Week stay correct. There is no live CMU feed integration yet.
- Preferences persist in localStorage only. There are no accounts and no backend.

## Roadmap to a real product

1. Replace mock data with real sources by parsing ICS feeds or the public calendars of each school.
2. Ship the calendar subscription from the pitch deck: set interests once and subscribe to a per-student feed of matching events in Google or Apple Calendar.
3. Add lightweight preference learning so ranking improves as students accept or skip events.

## License

MIT. See LICENSE.
