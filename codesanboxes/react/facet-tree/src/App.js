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
  Stats
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';

import SectorRefinementList from './components/SectorRefinementList';
import ProfessionRefinementList from './components/ProfessionRefinementList';

const searchClient = algoliasearch('testingURRC5O46YV', 'ZDI2NTk0NTFlNWM2ODIyYjhlNDBhNzUyNzgwNDRhOGI1NGFhYjcxOTBkYzFhYTJmMzM5NTQ4YzdhODYwZGY1M3ZhbGlkVW50aWw9MTY1MzU2NjQzMDU5Mg==');

function App() {
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">facet-tree</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="jco_wk_cms_jobs_preprod2">
          <div className="search-panel">
            <div className="search-panel__filters">
              <Configure facets={['*']} maxValuesPerFacet={200} />
                <h2>Secteurs</h2>
                <SectorRefinementList attribute="new_sectors_name.fr" />
                <h2>Profession</h2>
                <ProfessionRefinementList attribute="new_profession_name.fr" />
            </div>

            <div className="search-panel__results">
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />
              <Stats/>
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
        <Highlight attribute="organization" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
