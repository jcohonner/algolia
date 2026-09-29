const { searchBox, hits, refinementList, rangeInput, stats, pagination } = instantsearch.widgets;

// Custom search client: every query goes through the Node proxy.
const searchClient = {
  search(requests) {
    return fetch('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    }).then((res) => res.json());
  },
  searchForFacetValues(requests) {
    return fetch('/sffv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    }).then((res) => res.json());
  },
};

const search = instantsearch({
  indexName: 'DEMO_movies',
  searchClient,
  routing: true,
});

search.addWidgets([
  searchBox({ container: '#searchbox', placeholder: 'Search movies…' }),
  stats({ container: '#stats' }),
  refinementList({ container: '#genres', attribute: 'genres' }),
  refinementList({
    container: '#actors',
    attribute: 'actors',
    searchable: true,
    searchablePlaceholder: 'Search actors…',
    showMore: true,
  }),
  rangeInput({ container: '#year', attribute: 'year' }),
  hits({
    container: '#hits',
    templates: {
      // The HTML is produced by the proxy, the front end only injects it.
      item: (hit, { html }) => html`<div dangerouslySetInnerHTML=${{ __html: hit.html }}></div>`,
    },
  }),
  pagination({ container: '#pagination' }),
]);

search.start();
