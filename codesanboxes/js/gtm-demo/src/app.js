/* global instantsearch algoliasearch */

const isCategoryPage = window.location.href.indexOf("category.html") > -1;


const search = instantsearch({
  indexName: 'demo_products',
  searchClient: algoliasearch('3EA6KSSDGW', '23fef1254e41ec407b1fc80f852e4a40'),
});

const insightsMiddleware = instantsearch.middlewares.createInsightsMiddleware({
  insightsClient: null,
  onEvent(event) {
    const { widgetType, eventType, payload } = event;

    if (widgetType === 'ais.hits' && eventType === 'view') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: isCategoryPage
          ? 'Hits Viewed: Category Page'
          : 'Hits Viewed: Search Page',
        'algolia-insights-hit-viewed-object-ids': payload.objectIDs,
      });
    }
  },
});

search.use(insightsMiddleware);

let filters = '';
if (isCategoryPage) {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category')) {
    filters = `categories:'${urlParams.get('category')}'`;

    // Add the viewed filters to the main div for GTM
    document
      .querySelector('.ais-InstantSearch')
      .setAttribute(
        'data-insights-category-filter',
        `categories:${urlParams.get('category')}`
      );
  }
} else {
  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#searchbox',
    }),
  ]);
}

search.addWidgets([
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),
  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
    templates: {
      item: `
        <a
          data-insights-filter="brand:{{value}}"
          href="{{url}}"
          style="{{#isRefined}}font-weight: bold{{/isRefined}}"
        >
          <span>{{label}} ({{count}})</span>
        </a>
      `,
    },
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div class=”my-hit”
        data-insights-object-id="{{objectID}}"
          data-insights-position="{{__position}}"
          data-insights-query-id="{{__queryID}}"
          >

          <img src="{{image}}" align="left" alt="{{name}}"/>
          <div class="hit-name">
            {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
          </div>
          <div class="hit-description" >
          #{{objectID}} - {{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}
          </div>
          <div class="hit-price">\${{price}}</div>
          <div><a href="product.html?objectID={{objectID}}&queryID={{__queryID}}"> See Product </a></div>
          <button class="addToCart" data-insights-convert-after-search="Search: Add to cart">Add to cart</button>
          <button class="buy"  data-insights-convert-after-search="Search: buy">Buy</button>
          <button class="addToFav"  data-insights-convert="Search: Add To Favorites">Add to Favorites</button>
        </div>
      `,
    },
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),

  instantsearch.widgets.configure({
    clickAnalytics: true,
    filters,
  }),
]);



search.start();
