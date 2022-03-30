const { algoliasearch, instantsearch, algoliaConfig, routing } = window;

const searchClient = algoliasearch(
  algoliaConfig.applicationId,
  algoliaConfig.apiKey
);

const search = instantsearch({
  indexName: algoliaConfig.indexName + '_products',
  searchClient,
  routing
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
<article>
  <h1>{{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}</h1>
</article>
`,
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'taille',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
