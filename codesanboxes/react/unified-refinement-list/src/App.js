import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  DynamicWidgets,
  RefinementList,
  Pagination,
  Highlight,
  Index,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';
import UnifiedRefinementList from './components/UnifiedRefinementList';

const searchClient = algoliasearch('3EA6KSSDGW', '23fef1254e41ec407b1fc80f852e4a40');

function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">unified-refinement-list</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="movies">
          <Configure
            hitsPerPage={4}
            filters="year=2002"
            facets={['*']} maxValuesPerFacet={20}
          />
          <div className="search-panel">
            <div className="search-panel__filters">

              <UnifiedRefinementList attribute="genres" />
            </div>

            <div className="search-panel__results">
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />

              <h1>2002</h1>
              <RefinementList attribute="genres" limit="20 " />
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>

              <h1>2006</h1>
              <Index indexName="movies" indexId="movies2006">
                <Configure hitsPerPage={4} filters="year=2006" />
                <RefinementList attribute="genres" limit="20 " />
                <Hits hitComponent={Hit} />

                <div className="pagination">
                  <Pagination />
                </div>

              </Index>

            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

function Hit({ hit }) {
  return (
    <article>
      <img src={hit.poster} width="100%" />
      <h1>
        <Highlight attribute="title" hit={hit} />
      </h1>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
