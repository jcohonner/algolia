# proxy-html

InstantSearch.js (vanilla JS) search on `DEMO_movies`. All queries go through a Node proxy (using the `algoliasearch` JS client) that:

- **injects a filter** per index into every query, defined in `PROXY_FILTER` in `server.js` (default `{ DEMO_movies: "vote_average >= 6" }`), combined with `AND` if the front end already sends `filters`
- **renders each hit's HTML** server-side and adds it to the hit in a `html` field
- proxies **search for facet values** (searchable `actors` refinementList), with the same injected filter

The front end simply injects `hit.html` in the `hits` widget.

```bash
npm install
npm start                                  # http://localhost:3000
```

- `server.js`: proxy (`POST /search`, `POST /sffv`) + static server + `renderHit()`
- `public/app.js`: InstantSearch with a custom `searchClient` pointing to `/search` and `/sffv`
