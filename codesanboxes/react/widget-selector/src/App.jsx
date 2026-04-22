
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/algolia.css";
import "instantsearch.css/themes/satellite.css";
import './App.css'
import {algoliasearch} from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Configure, DynamicWidgets, Index } from 'react-instantsearch';  
import CustomDynamicWidgets from './components/CustomDynamicWidgets';

const parseColorValue = (value) => {
  const [role, name, hex] = value.split('|');
  return { role, name, hex };
};

const Hit = ({ hit }) => {

  return (
    <div className="hit-card">
      <img src={hit.poster} alt={hit.title} className="hit-image" style={{width: "100%"}}/>
      {hit.title}
    </div>
  );
};

function App() {
  const searchClient = algoliasearch(
    '3EA6KSSDGW',
    'a433431fb4a6d199ef13550dcd457f95'
  );

  return (
    <>
      <h1>Algolia InstantSearch</h1>
      <InstantSearch indexName="DEMO_movies" searchClient={searchClient} future={{
        preserveSharedStateOnUnmount: true
      }}>
        <Configure getRankingInfo={false} maxValuesPerFacet={100}/>
        <SearchBox />
        <div className="search-layout">
          <aside className="search-panel">
            <CustomDynamicWidgets />            
          </aside>
          <section className="search-results">
            <Hits hitComponent={Hit} />
          </section>
        </div>
      </InstantSearch>
    </>
  )
}

export default App
