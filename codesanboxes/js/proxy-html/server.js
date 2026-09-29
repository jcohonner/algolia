const express = require("express");
const path = require("path");
const { algoliasearch } = require("algoliasearch");

const APP_ID = process.env.ALGOLIA_APP_ID || "3EA6KSSDGW";
const API_KEY =
  process.env.ALGOLIA_API_KEY || "23fef1254e41ec407b1fc80f852e4a40";
const PORT = process.env.PORT || 3000;

// Filters injected by the proxy, per index (Algolia `filters` syntax).
// Indices not listed here are queried without an extra filter.
const PROXY_FILTER = { DEMO_movies: "vote_average >= 6" };

const client = algoliasearch(APP_ID, API_KEY);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Highlighted values are already escaped by Algolia; we only swap the tags
// (InstantSearch sends `__ais-highlight__` as highlight tags, the API default is `<em>`).
const highlight = (hit, attribute) => {
  const value = hit._highlightResult?.[attribute]?.value;
  if (value === undefined) return escapeHtml(hit[attribute]);
  return value
    .replace(/__ais-highlight__|<em>/g, "<mark>")
    .replace(/__\/ais-highlight__|<\/em>/g, "</mark>");
};

const renderHit = (hit) => `
<article class="hit">
  <img class="hit-poster" src="${escapeHtml(hit.poster)}" alt="${escapeHtml(hit.title)}" loading="lazy" />
  <div class="hit-body">
    <h2 class="hit-title">${highlight(hit, "title")} <span class="hit-year">(${escapeHtml(hit.year)})</span></h2>
    <p class="hit-meta">
      ★ ${escapeHtml(hit.vote_average)} · ${escapeHtml(hit.director)}
      ${hit.on_sale ? '<span class="hit-badge">On sale</span>' : ""}
    </p>
    <p class="hit-genres">${(hit.genres || []).map((g) => `<span>${escapeHtml(g)}</span>`).join("")}</p>
    <p class="hit-overview">${escapeHtml(hit.overview)}</p>
    <p class="hit-price">${escapeHtml(hit.price)} €</p>
  </div>
</article>`;

// Combine the proxy filter with the one sent by the front end (if any).
const injectFilter = (indexName, params = {}) => {
  if (!PROXY_FILTER || !PROXY_FILTER[indexName]) return params;

  const filters = params.filters
    ? `(${params.filters}) AND (${PROXY_FILTER[indexName]})`
    : PROXY_FILTER[indexName];
  return { ...params, filters };
};

app.post("/search", async (req, res) => {
  try {
    const requests = (req.body.requests || []).map(({ indexName, params }) => ({
      indexName,
      ...injectFilter(indexName, params),
    }));

    const data = await client.search({ requests });

    // Inject the rendered HTML into each hit.
    data.results.forEach((result) => {
      result.hits = (result.hits || []).map((hit) => ({
        ...hit,
        html: renderHit(hit),
      }));
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message });
  }
});

// Search for facet values (e.g. the searchable `actors` refinementList).
// The proxy filter is also injected so facet hits and counts match the results.
app.post("/sffv", async (req, res) => {
  try {
    const results = await Promise.all(
      (req.body.requests || []).map(({ indexName, params }) => {
        const { facetName, facetQuery, maxFacetHits, ...searchParams } =
          injectFilter(indexName, params);
        return client.searchForFacetValues({
          indexName,
          facetName,
          searchForFacetValuesRequest: {
            facetQuery,
            maxFacetHits,
            params: new URLSearchParams(
              Object.entries(searchParams).map(([k, v]) => [
                k,
                typeof v === "string" ? v : JSON.stringify(v),
              ]),
            ).toString(),
          },
        });
      }),
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(
    `http://localhost:${PORT}  (injected filters: ${JSON.stringify(PROXY_FILTER)})`,
  );
});
