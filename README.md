# CMU Event Compass

<!-- PABLO-CONFIRM: exact hackathon name and date — draft says "the Claude CMU Hackathon, November 2025". Fix if the official event name differs. -->
A hackathon prototype that unifies CMU event discovery into one personalized feed. Built with Claude at the Claude CMU Hackathon, November 2025.

**Live demo:** https://pazare.github.io/Claude-CMU-Hackathon/
**Pitch deck:** https://pazare.github.io/Claude-CMU-Hackathon/pitch.html

## The problem

CMU events live in silos. Heinz, Tepper, SCS, HCII, and university-wide calendars each publish separately, and students discover events through a mix of newsletters, Discord, Slack, and flyers. The result is decision fatigue, missed opportunities, and calendars that never reflect what is actually happening on campus.

## What it does

Event Compass puts every school's events in one feed and lets students filter by what they care about:

- **Interest-based filtering** with tags like AI / ML, HCI, entrepreneurship, policy, and data science
- **Multi-source aggregation** across Heinz, Tepper, SCS, HCII, Dietrich, and university-wide calendars
- **Date, format, and source filters** plus free-text search
- **Persistent preferences** saved locally, so the feed stays personalized between visits

The pitch deck extends the concept to a calendar add-on: students set interests once, and the upcoming week's matching events sync to Google or Apple Calendar as a single subscription instead of one-by-one manual entry.

## What is in this repo

Three artifacts from the hackathon day:

| Path | What it is |
|---|---|
| `index.html` | Static high-fidelity mock of the home feed. This is what the live demo serves. |
| `pitch.html` | Six-slide pitch deck for the calendar add-on concept, built as a standalone page. |
| `app/`, `components/`, `lib/`, `data/`, `types/` | Working Next.js 14 + TypeScript prototype of the same design, with functional filtering, onboarding, and localStorage persistence. |

## Running the Next.js prototype

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The static demo and pitch deck need only a browser.

## How Claude was used

<!-- PABLO-CONFIRM: verify this paragraph matches how Claude was actually used during the hackathon before pushing. -->
Claude generated and iterated on all three artifacts during the hackathon: the static mock, the pitch deck, and the Next.js implementation. Human direction covered product scope, the unification concept, information architecture, and CMU-specific details such as schools, venues, and event types.

## Honest limitations

This is a one-day hackathon prototype, not a production system:

- Event data is mock data in `data/events.ts`. There is no live integration with CMU calendar feeds yet.
- The static mock and the Next.js app are parallel implementations of the same design, not a single codebase.
- Preferences live in localStorage only. There are no accounts and no backend.

## Roadmap to a real product

1. Replace mock data with real sources, parsing ICS feeds or scraping the public calendars of each school.
2. Ship the calendar subscription described in the pitch deck, generating a per-student ICS feed.
3. Add lightweight preference learning so the ranking improves as students accept or skip events.

## License

MIT. See `LICENSE`.
