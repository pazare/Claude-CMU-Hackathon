# CMU Event Compass

A unified web application for CMU students to discover events across multiple siloed platforms (Tepper, Heinz, HCII, SCS, Dietrich, University-wide) in one interface.

## Features

- **Interest-based filtering**: Set your interests and see prioritized events
- **Multi-source aggregation**: Browse events from different CMU schools and centers
- **Advanced filtering**: Filter by date range, source, format, and search query
- **Persistent preferences**: Your selections are saved in localStorage
- **Responsive design**: Works seamlessly on desktop and mobile
- **Clean, accessible UI**: Built with accessibility best practices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── EventCard.tsx       # Event display card
│   ├── FiltersPanel.tsx    # Filter controls
│   ├── InterestSelector.tsx # Interest selection UI
│   ├── OnboardingCard.tsx  # First-time user onboarding
│   ├── SearchBar.tsx       # Search input
│   ├── DateRangeSelector.tsx
│   ├── SourceFilter.tsx
│   └── EmptyState.tsx      # Empty state component
├── lib/
│   ├── filters.ts          # Filtering and sorting logic
│   ├── formatters.ts       # Date/time formatting utilities
│   └── storage.ts          # localStorage persistence
├── data/
│   └── events.ts           # Mock event data (TODO: replace with API)
└── types/
    └── events.ts           # TypeScript type definitions
```

## Extending the App

### Adding Real Data Sources

The app currently uses mock data from `data/events.ts`. To integrate real APIs or ICS feeds:

1. Replace the `mockEvents` import in `app/page.tsx` with a data fetching function
2. Use Next.js API routes or client-side fetch to retrieve data
3. Transform the external data format to match the `Event` interface

### Adding More Event Types

To add new event formats or interest tags:

1. Update the type definitions in `types/events.ts`
2. Add corresponding color mappings in `lib/formatters.ts` (for formats)
3. Update the filter components to include new options

### Customizing Colors

Color scheme customization points:

- **CMU Red**: Defined in `tailwind.config.ts` as `cmu-red`
- **Format Badges**: Modify `getFormatBadgeClasses()` in `lib/formatters.ts`
- **Interest Tags**: Update styling in `InterestSelector.tsx` and `EventCard.tsx`

## Architecture Notes

- **Filtering Pipeline**: Pure functions in `lib/filters.ts` make it easy to test and extend
- **Persistence**: All preferences saved to localStorage for seamless user experience
- **Component Design**: Modular components make it easy to customize individual features
- **Type Safety**: Full TypeScript coverage ensures type safety across the application

## License

MIT

