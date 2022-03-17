/* eslint-disable valid-jsdoc */
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList,
  Pagination,
  Highlight,
  Index,
  Snippet,
  connectStateResults,
  Configure,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';

const searchClient = algoliasearch(
  '3EA6KSSDGW',
  '23fef1254e41ec407b1fc80f852e4a40'
);

const hitsPerPageConf = {
  all: {
    movies: 20,
    products: 5,
    actors: 2,
    directors: 3,
  },
  movies: {
    movies: 20,
    products: 1,
    actors: 1,
    directors: 1,
  },
  products: {
    movies: 1,
    products: 10,
    actors: 1,
    directors: 1,
  },
  actors: {
    movies: 1,
    products: 1,
    actors: 20,
    directors: 1,
  },
  directors: {
    movies: 1,
    products: 1,
    actors: 1,
    directors: 20,
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'all',
      hitsPerPage: hitsPerPageConf.all,
    };
  }

  /**
   * handles the click on the tab
   * note that we also change the hitsPerPage in the state to adjust and avoid
   * the retrieval of a too large number of hits (which might be slow)
   * @param {*} event
   */
  handleTabClick = event => {
    const newTab = event.target.closest('[data-tab]').dataset.tab;
    this.setState({
      currentTab: newTab,
      hitsPerPage: hitsPerPageConf[newTab],
    });
  };

  render() {
    return (
      <div>
        <header className="header">
          <h1 className="header-title">
            <a href="/">Results from multiple indices in Tabs</a>
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
            <SearchBox
              className="searchbox"
              translations={{
                placeholder: '',
              }}
            />

            <ul className="tabs">
              <li onClick={this.handleTabClick} data-tab="all">
                All (<IndexStats index={['movies', 'actors', 'directors']} />)
              </li>
              <li onClick={this.handleTabClick} data-tab="movies">
                Movies (<IndexStats index="movies" />)
              </li>
              <li onClick={this.handleTabClick} data-tab="products">
                Products (<IndexStats index="products" />)
              </li>
              <li onClick={this.handleTabClick} data-tab="actors">
                Actors (<IndexStats index="actors" />)
              </li>
              <li onClick={this.handleTabClick} data-tab="directors">
                Directors (<IndexStats index="directors" />)
              </li>
            </ul>

            <div
              id="all"
              style={{
                display: this.state.currentTab === 'all' ? null : 'none',
              }}
              className="search-panel"
            >
              <AllHits />
            </div>

            <div
              id="movies"
              style={{
                display: this.state.currentTab === 'movies' ? null : 'none',
              }}
              className="search-panel"
            >
              <Index indexName="movies">
                <Configure hitsPerPage={this.state.hitsPerPage.movies} />
                <div className="search-panel__filters">
                  <RefinementList attribute="genres" />
                </div>

                <div className="search-panel__results">
                  <Hits hitComponent={Movie} />

                  <div className="pagination">
                    <Pagination />
                  </div>
                </div>
              </Index>
            </div>

            <div
              id="products"
              style={{
                display: this.state.currentTab === 'products' ? null : 'none',
              }}
              className="search-panel"
            >
              <Index indexName="demo_products" indexId="products">
                <Configure hitsPerPage={this.state.hitsPerPage.products} />
                <div className="search-panel__filters">
                  <RefinementList attribute="brand" />
                </div>

                <div className="search-panel__results">
                  <Hits hitComponent={Product} />

                  <div className="pagination">
                    <Pagination />
                  </div>
                </div>
              </Index>
            </div>

            <div
              id="actors"
              style={{
                display: this.state.currentTab === 'actors' ? null : 'none',
              }}
              className="search-panel"
            >
              <Index indexName="actors">
                <Configure hitsPerPage={this.state.hitsPerPage.actors} />
                <div className="search-panel__results">
                  <Hits hitComponent={Person} />

                  <div className="pagination">
                    <Pagination />
                  </div>
                </div>
              </Index>
            </div>
            <div
              id="directors"
              style={{
                display: this.state.currentTab === 'directors' ? null : 'none',
              }}
              className="search-panel"
            >
              <Index indexName="directors">
                <Configure hitsPerPage={this.state.hitsPerPage.directors} />
                <div className="search-panel__results">
                  <Hits hitComponent={Person} />

                  <div className="pagination">
                    <Pagination />
                  </div>
                </div>
              </Index>
            </div>
          </InstantSearch>
        </div>
      </div>
    );
  }
}

function Movie(props) {
  return (
    <article>
      <img src={props.hit.poster} alt={props.hit.title} width="100%" />
      <h1>
        <Highlight attribute="title" hit={props.hit} />
      </h1>
    </article>
  );
}

Movie.propTypes = {
  hit: PropTypes.object.isRequired,
};

function Product(props) {
  return (
    <article>
      <img src={props.hit.image} alt={props.hit.name} width="100%" />
      <h1>
        <Highlight attribute="name" hit={props.hit} />
      </h1>
      <p>
        <Snippet attribute="description" hit={props.hit} />
      </p>
    </article>
  );
}

Product.propTypes = {
  hit: PropTypes.object.isRequired,
};

function Person(props) {
  return (
    <article>
      <img src={props.hit.picture} alt={props.hit.name} width="100%" />
      <h1>
        <Highlight attribute="name" hit={props.hit} />
      </h1>
      <p>
        <Snippet attribute="biography" hit={props.hit} />
      </p>
    </article>
  );
}

Person.propTypes = {
  hit: PropTypes.object.isRequired,
};

// Widget to display number of hits for each index (or sum of those passed to index prop)
const IndexStatsRender = ({ allSearchResults, index }) => {
  const indexArray = Array.isArray(index) ? index : [index];
  let hits = 0;

  indexArray.forEach(indexID => {
    if (allSearchResults && allSearchResults[indexID]) {
      hits = hits + allSearchResults[indexID].nbHits;
    }
  });

  return <span>{hits}</span>;
};

IndexStatsRender.propTypes = {
  allSearchResults: PropTypes.object,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

const IndexStats = connectStateResults(IndexStatsRender);

// Widget to display All Tab hits
const AllHitsRender = ({ allSearchResults }) => {
  if (!allSearchResults) {
    return <div></div>;
  }

  let directors;
  let actors;

  const movies = allSearchResults.movies ? allSearchResults.movies.hits : [];

  if (
    allSearchResults.directors &&
    allSearchResults.directors.hits.length > 0
  ) {
    directors = (
      <>
        <h2>Directors</h2>
        <ul>
          {allSearchResults.directors.hits.map(hit => (
            <li key={hit.objectID}>{hit.name}</li>
          ))}
        </ul>
      </>
    );
  }

  if (allSearchResults.actors && allSearchResults.actors.hits.length > 0) {
    actors = (
      <>
        <h2>Actors</h2>
        <ul>
          {allSearchResults.actors.hits.map(hit => (
            <li key={hit.objectID}>{hit.name}</li>
          ))}
        </ul>
      </>
    );
  }

  // Mixing Results from different indexes
  const positions = [3, 6, 8, 12, 15];
  const mixedResults = movies.map(movie => ({ hitType: 'Movie', hit: movie }));
  if (allSearchResults.products && allSearchResults.products.hits.length > 0) {
    allSearchResults.products.hits.slice(0, 5).map((hit, index) =>
      mixedResults.splice(positions[index], 0, {
        hitType: 'Product',
        hit,
      })
    );
  }

  return (
    <div className="ais-Hits">
      <ul className="ais-Hits-list">
        <li className="ais-Hits-item" key="diract">
          <article>
            {directors}
            {actors}
          </article>
        </li>
        {mixedResults.map(hit => (
          <li
            className="ais-Hits-item"
            key={`${hit.hitType}-${hit.hit.objectID}`}
          >
            {hit.hitType === 'Movie' ? <Movie hit={hit.hit} /> : ''}
            {hit.hitType === 'Product' ? <Product hit={hit.hit} /> : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

AllHitsRender.propTypes = {
  allSearchResults: PropTypes.object,
};

const AllHits = connectStateResults(AllHitsRender);

export default App;
