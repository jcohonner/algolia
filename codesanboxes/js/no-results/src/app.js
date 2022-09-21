const { algoliasearch, instantsearch } = window;

const algoliaClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');

//Overrides the search client to hide no result container at 
//each new search
const searchClient = {
  ...algoliaClient,
  search(requests) {
    document.getElementById('no-results').style.display = 'none';
    return algoliaClient.search(requests);
  },
};



const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
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
      empty(results) {
        document.getElementById('no-results').style.display = 'block';
        loadNoResults();
        return;
      },
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.dynamicWidgets({
    container: '#dynamic-widgets',
    fallbackWidget({ container, attribute }) {
      return instantsearch.widgets.panel({ templates: { header: attribute } })(
        instantsearch.widgets.refinementList
      )({
        container,
        attribute,
      });
    },
    widgets: [
      container =>
        instantsearch.widgets.panel({
          templates: { header: 'brand' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'brand',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: 'rating' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'rating',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: 'categories' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'categories',
        }),
    ],
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  })
]);

search.start();


const loadNoResults = () => {

  const container = document.getElementById('no-results');

  if (container.hasAttribute('data-populated')) {
    //do nothing as the container is already populated with results
    return;
  }

  //Run a custom query directly using the searchClient 
  //empty query will bring back results based on the custom ranking
  //ruleContext will allow to display specific results based on a rule if needed
  searchClient.multipleQueries([
    {
      indexName: 'instant_search_demo_query_suggestions',
      query: '',
      params: {
        hitsPerPage: 3,
        ruleContexts: ['no-results'],
      },
    },
    {
      indexName: 'instant_search',
      query: '',
      params: {
        hitsPerPage: 4,
        ruleContexts: ['no-results']
      }
    }]).then(({ results }) => {
      const producquerySuggestions = results[0].hits;
      const products = results[1].hits;

      const suggestions = producquerySuggestions.map((hit) => {
        return `<li>${hit.query}</li>`;
      });

      const productHTML = products.map(hit => `
      <li class="ais-Hits-item">
        <article>
          <h1>${hit.name}</h1>
        </article>
        </li>
      `);

      const html = `
      <div class="no-results-text"><h1>No results</h1></div>
      <div class="no-results-suggestions">
        <h2>Popular searches</h2>
        <ul>
          ${suggestions.join('')}
        </ul>
      </div>

      <div class="no-results-hits">
      <h2>Popular products</h2>
        <div class="ais-Hits">
          <ol class="ais-Hits-list">
              ${productHTML.join('')}
          </ol>
        </div>
      </div>`
      container.innerHTML = html;
      container.setAttribute('data-populated', true);
    });

}
