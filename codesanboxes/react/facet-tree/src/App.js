import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  Pagination,
  Highlight,
  Stats,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';


import RefinementTree from './components/RefinementTree';
import profession from './data/profession.json';
import secteur from './data/secteur.json';

const searchClient = algoliasearch('testingURRC5O46YV', 'ZDI2NTk0NTFlNWM2ODIyYjhlNDBhNzUyNzgwNDRhOGI1NGFhYjcxOTBkYzFhYTJmMzM5NTQ4YzdhODYwZGY1M3ZhbGlkVW50aWw9MTY1MzU2NjQzMDU5Mg==');


const transformProfessionNames = (items) => {
  console.log('transformProfsNames', items);
  const itemHash = {};
  items.forEach(item => {
    itemHash[item.label] = item;
  });

  return profession.map(parent => {
    const children = parent.children.map(child => {
      // itemHash[child];
      const key = `${parent.label} | ${child}`;
      return {
        label: child,
        key,
        isRefined: itemHash[key] ? itemHash[key].isRefined : false,
        count: itemHash[key] ? itemHash[key].count : 0,
        value: itemHash[key] ? itemHash[key].value : [],
        level: 1,
      };
    });
    return {
      label: parent.label,
      level: 0,
      items: children,
      value: [],
      count: 0,
      isRefined: false
    };
  });
}

const transformSectorsNames = (items) => {
  
  const itemHash = {};
  items.forEach(item => {
    itemHash[item.label] = item;
  });

  return secteur.map(parent => {
    const children = parent.children.map(child => {
      // itemHash[child];
      const key = `${parent.label} | ${child}`;
      return {
        label: child,
        key,
        isRefined: itemHash[key] ? itemHash[key].isRefined : false,
        count: itemHash[key] ? itemHash[key].count : 0,
        value: itemHash[key] ? itemHash[key].value : [],
        level: 1,
      };
    });
    return {
      label: parent.label,
      level: 0,
      items: children,
      value: [],
      count: 0,
      isRefined: false
    };
  });
}

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
                <RefinementTree attribute="new_sectors_name.fr" transformItems={transformSectorsNames}  />
                <h2>Profession</h2>
                <RefinementTree attribute="new_profession_name.fr" transformItems={transformProfessionNames}/>
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
