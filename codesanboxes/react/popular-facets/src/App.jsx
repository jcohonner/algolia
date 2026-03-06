
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/algolia.css";
import "instantsearch.css/themes/satellite.css";
import './App.css'
import {algoliasearch} from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Configure, DynamicWidgets } from 'react-instantsearch';  
import RelevantWidgets from './components/RelevantWidgets';

const parseColorValue = (value) => {
  const [role, name, hex] = value.split('|');
  return { role, name, hex };
};

const Hit = ({ hit }) => {

  return (
    <div className="hit-card">
      {hit.title}
    </div>
  );
};

function App() {
  const searchClient = algoliasearch(
    '3EA6KSSDGW',
    '23fef1254e41ec407b1fc80f852e4a40'
  );

  return (
    <>
      <h1>Algolia InstantSearch</h1>
      <InstantSearch indexName="DEMO_movies" searchClient={searchClient} future={{
        preserveSharedStateOnUnmount: true
      }}>
        <Configure getRankingInfo={false} />
        <SearchBox />
        <div className="search-layout">
          <aside className="search-panel">
            <RelevantWidgets />            
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
