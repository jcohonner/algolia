import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  RefinementList,
  Pagination,
  Highlight,
  connectSearchBox,
  CurrentRefinements,
} from 'react-instantsearch-dom';
import { Autocomplete } from './Autocomplete.jsx';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createTagsPlugin } from '@algolia/autocomplete-plugin-tags';
import qs from 'qs';
import PropTypes from 'prop-types';
import './App.css';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const VirtualSearchBox = connectSearchBox(() => null);

function createURL(searchState) {
  return qs.stringify(searchState, { addQueryPrefix: true });
}

function searchStateToUrl({ location }, searchState) {
  if (Object.keys(searchState).length === 0) {
    return '';
  }

  return `${location.pathname}${createURL(searchState)}`;
}

function urlToSearchState({ search }) {
  return qs.parse(search.slice(1));
}

function App() {
  const [searchState, setSearchState] = React.useState(() =>
    urlToSearchState(window.location)
  );
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      window.history.pushState(
        searchState,
        null,
        searchStateToUrl({ location: window.location }, searchState)
      );
    }, 400);
  }, [searchState]);

  function buildRefinementList(items, predicate) {
    return items.reduce((acc, item) => {
      const key = predicate(item);

      if (!acc.hasOwnProperty(key)) {
        acc[key] = [];
      }

      acc[key].push(item.label);

      return acc;
    }, {});
  }

  // ...
  const onSubmit = React.useCallback(({ state }) => {
    const refinementList = buildRefinementList(
      state.context.tagsPlugin.tags,
      tag => tag.facet
    );

    setSearchState(searchState => ({
      ...searchState,
      query: state.query,
      refinementList,
    }));
  }, []);

  const onReset = React.useCallback(() => {
    setSearchState(searchState => ({
      ...searchState,
      query: '',
      refinementList: {},
    }));
  }, []);

  const plugins = React.useMemo(() => {
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'search',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          onSelect(params) {
            setSearchState(searchState => ({
              ...searchState,
              query: params.item.label,
            }));
          },
        };
      },
    });

    return [
      recentSearchesPlugin,
      /*createQuerySuggestionsPlugin({
        searchClient,
        indexName: 'instant_search_demo_query_suggestions',
        getSearchParams() {
          return recentSearchesPlugin.data.getAlgoliaSearchParams({
            hitsPerPage: 5,
          });
        },
        transformSource({ source }) {
          return {
            ...source,
            onSelect(params) {
              setSearchState(searchState => ({
                ...searchState,
                query: params.item.query,
              }));
            },
          };
        },
      }),*/
      createTagsPlugin({
        getTagsSubscribers() {
          return [
            {
              sourceId: 'brands',
              getTag({ item }) {
                return item;
              },
            },
            {
              sourceId: 'categories',
              getTag({ item }) {
                return item;
              },
            },
          ];
        },
      }),
    ];
  }, []);

  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">autocomplete-react-instantsearch</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch
          searchClient={searchClient}
          indexName="instant_search"
          searchState={searchState}
          onSearchStateChange={setSearchState}
          createURL={createURL}
        >
          <VirtualSearchBox />
          <div className="search-panel">
            <div className="search-panel__filters">
            <CurrentRefinements/>
              Categories
              <RefinementList attribute="categories" />
              Brands
              <RefinementList attribute="brand" />
            </div>

            <div className="search-panel__results">
              <Autocomplete
                placeholder="Search"
                detachedMediaQuery="none"
                initialState={{
                  query: searchState.query,
                }}
                openOnFocus={true}
                onSubmit={onSubmit}
                onReset={onReset}
                plugins={plugins}
                searchClient={searchClient}
              />
              
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

function Hit(props) {
  return (
    <article>
      <h1>
        <Highlight attribute="name" hit={props.hit} />
      </h1>
      <p>
        <Highlight attribute="description" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
