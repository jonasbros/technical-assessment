# Dashboard Documentation

## Architecture

Components: Dashboard, TimeFrameSelect/ThemeSwitch, StatusCards/MetricsChart/DataGrid
Data: React Query (caching and 30s polling)
Theme: next-themes
State: Local UI state, shared timeframe via props
Files: /dashboard, /ui, /hooks, /lib, /tests

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

Commands:

```bash
npm test                    # all tests
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

Git: `feat: description`
