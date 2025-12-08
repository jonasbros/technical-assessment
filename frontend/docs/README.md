# Dashboard Documentation

## Architecture

Components: Dashboard, TimeFrameSelect/ThemeSwitch, StatusCards/MetricsChart/DataGrid, SearchInput, MetricsTable, InlineError
Data: React Query (caching, 30s polling, error handling)
Theme: next-themes with system detection
State: Local UI state, shared timeframe via props
Files: /dashboard, /ui, /hooks, /lib, /tests
Errors: Component-level with retry using `refetch()`

## Accessibility

- Live regions announce search results
- Error alerts with `role="alert"`
- Proper table structure with `scope="col"`
- Icons marked `aria-hidden="true"`
- Theme toggle with focus management

Works with screen readers and keyboard only users.

## Performance

- React Query deduplication & caching
- 500ms debounced search
- Memoized calculations
- Bundle analysis with `npm run analyze`
- Web Vitals and React Profiler for monitoring

## Testing

Structure: /components, /integration, /accessibility, /performance
Coverage: 70 tests with network failure edge cases
Types: Component, integration, accessibility, performance, edge cases (API failures, null data)

Commands:

```bash
npm test                    # all tests (70 passing)
npm test DataGrid.test.tsx  # specific file
npm test -- --coverage     # with coverage
```

## Development

Setup: `npm install` and `npm run dev`

Style: Proper Typescript types, absolute imports using `@/`, organized file structure

Patterns:

- Props interfaces, error boundaries
- Aria labels on inputs, `aria-live` for announcements
- `useMemo` and `useCallback` for performance
- Component level error states with `InlineError` and retry
- Null handling: `select: (res) => res ?? []`

Git: `feat: description`

Edge cases: API failures, null data, malformed responses handled with graceful retry
