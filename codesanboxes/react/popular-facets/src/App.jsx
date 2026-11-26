
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/algolia.css";
import "instantsearch.css/themes/satellite.css";
import './App.css'
import {algoliasearch} from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Configure, DynamicWidgets, Index } from 'react-instantsearch';  
import { singleIndex } from "instantsearch.js/es/lib/stateMappings";
import RelevantWidgets from './components/RelevantWidgets';

const parseColorValue = (value) => {
  const [role, name, hex] = value.split('|');
  return { role, name, hex };
};

const Hit = ({ hit }) => {

  return (
    <div className="hit-card">
      <img src={hit.images} alt={hit.name} className="hit-image" />
      {hit.name}
    </div>
  );
};

function App() {
  const searchClient = algoliasearch(
    '7S12BM4BH8',
    '48250d6085d6df243d62d451edcdd9c6'
  );

  const indexName = "products";
  //const facets = 

  return (
    <>
      <h1>Algolia InstantSearch</h1>
      <InstantSearch indexName={indexName} searchClient={searchClient} routing={{ stateMapping: singleIndex(indexName) }} future={{
        preserveSharedStateOnUnmount: true
        
      }}>


        <Index indexName={indexName} >
          <Configure getRankingInfo={false} maxValuesPerFacet={100}/>
          <SearchBox />
          <div className="search-layout">
            <aside className="search-panel">
              <RelevantWidgets />            
            </aside>
            <section className="search-results">
              <Hits hitComponent={Hit} />
            </section>
          </div>
        </Index>
      </InstantSearch>
    </>
  )
}

export default App
