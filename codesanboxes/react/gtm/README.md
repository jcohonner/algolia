# Algolia Building the UI training

In this training we will learn how to implement Algolia in your website. We will cover

- how to implement InstantSearch using InstantSearch React Library
  - for search
  - for category pages
- how to implement Autocomplete.js
- how to send events to Algolia
- how to implement Recommend carrousels

This react project is a basic "almost" plain HTML Algoflix version with a pre-configured router (search, category pages, movie page) and fake components reproducing Algolia InstantSearch default components HTML.

# How to use

You can either use this boilerplate locally or in codesandbox.
Fork in codesandbox : https://codesandbox.io/p/sandbox/github/algolia/customer-solutions-onboarding/tree/main/building-the-ui/react/solution

## Let's get started

first, fork the provided repository. Then, using the dependencies section of codesanbox, include [algoliasearch](https://www.npmjs.com/package/algoliasearch) (>= v5) and [react-instantsearch](https://www.npmjs.com/package/react-instantsearch) (>= v7)

## Building the search page

Start implementing InstantSearch in `src/pages/Search.js`

You will need to

- Instantiate Algolia Client in a dedicated file `src/services/algoliaClient.js` and import it in the Search page
- Wrap the search components into [InstantSearch](https://www.algolia.com/doc/api-reference/widgets/instantsearch/react/)
- Replace "fake" components by InstantSearch ones
  - [SearchBox](https://www.algolia.com/doc/api-reference/widgets/search-box/react/)
  - [InfiniteHits](https://www.algolia.com/doc/api-reference/widgets/infinite-hits/react/)
  - [RefinementList](https://www.algolia.com/doc/api-reference/widgets/refinement-list/react/) for attributes
    - actors
    - genres
    - director
  - [ToggleRefinement](https://www.algolia.com/doc/api-reference/widgets/toggle-refinement/react/)
- Make the actors facet searchable
- Make the search page state part or URL for navigation [see guide](https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/react/)
- Create a sort by release date replica and add a [SortBy](https://www.algolia.com/doc/api-reference/widgets/sort-by/react/) widget to your search page

Tips:

- make sure your attributes are defined as facets
- Use the [singleIndex](https://www.algolia.com/doc/api-reference/widgets/single-index-state-mapping/js/) routing (not documented but also available in React). You may need to add instantsearch.js as a dependency (even if already a dependency of react-instantsearch)

## (advanced) Building the category page

Reusue your learnings and the code from Search to implement category page in `src/pages/Category.js`

Category identifier (attribute categoryPageIdentifiers in your index) is passed from URL. For now, use the home page carousel links to navigate to some of those pages.

You will need to add the [Configure](https://www.algolia.com/doc/api-reference/widgets/configure/react/) component to the list used in Search Page and remove the `SearchBox`

Tips:

- make sure the categoryPageIdentifiers attribute is set as facet (searchable)

## (advanced) Adding Autocomplete to your site

Let's replace `src/components/Autocomplete.js" by Algolia [Autocomplete Library](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/)

### Autocomplete & React

- Use dependency manager to add the @algolia/autocomplete-js package
- Follow these [instructions](https://www.algolia.com/doc/ui-libraries/autocomplete/integrations/using-react/) to create the Autocomplete component
- back in `src/components/Header.js` initialize your [sources](https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/) and pass it to Autocomplete (see next step)

### Adding Sources

in `src/components/Header.js`

- import Algolia search client
- connect Autocomplete with search using onSubmit parameter
  - replace the search box by a virtual one in the Search page to display current query using [`useSearchBox`](https://www.algolia.com/doc/api-reference/widgets/search-box/react#hook) hook
- add your movies index as a first source using [getAlgoliaResults](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-preset-algolia/getAlgoliaResults/) preset
- add your categories index as a second source using [getAlgoliaResults](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-preset-algolia/getAlgoliaResults/) preset
- add [recent searches plugin](https://www.algolia.com/doc/ui-libraries/autocomplete/guides/adding-recent-searches/)
  - add dependency (@algolia/autocomplete-plugin-recent-searches)
  - add the plugin
- open on click using `openOnFocus` parameter

Tips:

- ensure your search has a router enabled (`singleIndex`) and navigate to `search?query=XXX` on submit action
- if already on search page use navigate(0) to force refresh of Search component

#### Adding a query suggestion index

1. create a query suggestion index from the dashboad
   - go to the [query suggestion](https://dashboard.algolia.com/query-suggestions) dashboard page
   - create a new index with your movies index as a source
   - force the creation of suggestions on [facets values](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/react/#augment-query-suggestions-with-facet-data) from actors and directors
2. (Note: possible bug if click analytcis not enabled) add [query suggestion plugin](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-query-suggestions/createQuerySuggestionsPlugin/)
   - add dependency (@algolia/autocomplete-plugin-query-suggestion)
   - add the plugin

#### Multi state autocomplete

What has been designed is fine for as you type result but we would like a different list of sources when the search is emply.

- create a state with only recent searches and query suggestions when [query is empty](https://www.algolia.com/doc/ui-libraries/autocomplete/guides/implementing-multiple-search-states/)

## Sending events

- Include [Algolia Insights Library](https://www.algolia.com/doc/api-client/methods/insights/?client=javascript#include-the-insights-client-in-your-html) as part of main `public/index.html`
- [Initialize it](https://www.algolia.com/doc/api-reference/widgets/instantsearch/react/#widget-param-insights) using AppID and key + [`useCookie:true`](https://www.algolia.com/doc/api-reference/api-methods/init/)
- Enable analytics with `insights={true}` on search [InstantSearch component](https://www.algolia.com/doc/api-reference/widgets/instantsearch/react/#widget-param-insights)
- add a [conversion after search](https://www.algolia.com/doc/api-reference/api-methods/converted-object-ids-after-search/) when user clicks on Add to card
- add a [Viewed event](https://www.algolia.com/doc/api-reference/api-methods/viewed-object-ids/) when landing on Movie detail page `src/pages/Movie.js`
- add the conversion event when click on watch. Either a simple [puchase](https://www.algolia.com/doc/api-reference/api-methods/purchased-object-ids/) if no queryID or a [purchases after search](https://www.algolia.com/doc/api-reference/api-methods/purchased-object-ids-after-search/)
- add a [Viewed Filters](https://www.algolia.com/doc/api-reference/api-methods/viewed-filters/) event when user lands on a category page

TIPS:

- Your insights API key can be any API key with access to any index including non existng ones (security tip)!
- When Insights are enabled a `sendEvent` prop is passed to your Hit component
- use [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) to get queryID from URL
