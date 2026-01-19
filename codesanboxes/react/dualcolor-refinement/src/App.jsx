
import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/algolia.css";
import "instantsearch.css/themes/satellite.css";
import './App.css'
import {algoliasearch} from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
import { DualColorRefinementList } from './components/dualcolor/DualColorRefinementList.jsx';

const parseColorValue = (value) => {
  const [role, name, hex] = value.split('|');
  return { role, name, hex };
};

const Hit = ({ hit }) => {
  const parsedColors = (hit.colors || []).map(parseColorValue);
  const primary = parsedColors.find((color) => color.role === 'primary');
  const secondary = parsedColors.filter((color) => color.role === 'secondary');

  return (
    <div className="hit-card">
      <div
        className="hit-swatch"
        style={{ backgroundColor: primary?.hex || '#e5e5e5' }}
      >
        <div className="hit-secondary">
          {secondary.map((color) => (
            <span
              key={`${color.role}-${color.name}-${color.hex}`}
              className="hit-secondary-chip"
              title={`${color.name} (${color.hex})`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
      <p>Priority: {hit.priority}</p>
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
      <InstantSearch indexName="colors" searchClient={searchClient}>
        <Configure getRankingInfo={false} />
        <SearchBox />
        <div className="search-layout">
          <aside className="search-panel">
            <h2>Couleurs</h2>
            <DualColorRefinementList attribute="colors" />
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
