/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'demo_products',
  searchClient: algoliasearch('3EA6KSSDGW', '23fef1254e41ec407b1fc80f852e4a40'),
});

const insightsMiddleware = instantsearch.middlewares.createInsightsMiddleware({
  insightsClient: null,
  onEvent(event) {
    const { widgetType, eventType, payload } = event;
    
    if (widgetType === 'ais.hits' && eventType === 'view') {
      


        var IDs = Array.from(document.querySelectorAll('[data-insights-object-id]')).filter(Boolean).map(function (element) {
          return element.getAttribute('data-insights-object-id');
        });

        console.log(payload,IDs);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'Hits Viewed',
      });
    }
  },
});

search.use(insightsMiddleware);

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
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
  }),
]);



search.start();
