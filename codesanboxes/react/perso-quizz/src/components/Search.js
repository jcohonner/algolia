import React, { useContext, useEffect } from 'react';
import AlgoliaContext from '../context/AlgoliaContext';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  Pagination,
  Index,
} from 'react-instantsearch-hooks-web';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function Search() {
  const algoliaContext = useContext(AlgoliaContext);
  const navigate = useNavigate();
  const [personalizationFilters, setPersonalizationFilters] = React.useState(
    null
  );

  useEffect(() => {
    if (!algoliaContext.userToken) {
      navigate('/');
    }

    if (algoliaContext.tmpUserProfile) {
      // we'll use the tmpUserProfile to set the personalizationFilters
      // in that case we do not send the userToken
      const newPersonalizationFilters = [];

      Object.keys(algoliaContext.tmpUserProfile.scores).forEach(attr => {
        Object.keys(algoliaContext.tmpUserProfile.scores[attr]).forEach(
          value => {
            newPersonalizationFilters.push(
              `${attr}:${value}<score=${algoliaContext.tmpUserProfile.scores[attr][value]}>`
            );
          }
        );
      });
      setPersonalizationFilters(newPersonalizationFilters);
    }
  }, []);

  return (
    <>
      <h1>Search experience personalized for {algoliaContext.userToken}</h1>
      <p>
        Personnalization from{' '}
        {personalizationFilters ? 'local user preferences' : 'existing profile'}
      </p>
      <InstantSearch
        searchClient={algoliaContext.searchClient}
        indexName="movies_perso"
      >
        <SearchBox
          className="searchbox"
          translations={{
            placeholder: '',
          }}
        />

        <Configure enablePersonalization={false} getRankingInfo={true} />

        <div className="search-panel">
          <div className="search-panel__results">
            <h2>Default results</h2>
            <Hits hitComponent={Hit} />

            <div className="pagination">
              <Pagination />
            </div>
          </div>

          <div className="search-panel__results">
            <Index indexName="movies_perso" indexId="m2">
              <h2>Personalized results</h2>
              {personalizationFilters ? (
                <Configure
                  facets={['*']}
                  maxValuesPerFacet={20}
                  enablePersonalization={true}
                  getRankingInfo={true}
                  personalizationFilters={personalizationFilters}
                />
              ) : (
                <Configure
                  facets={['*']}
                  maxValuesPerFacet={20}
                  enablePersonalization={true}
                  getRankingInfo={true}
                  userToken={algoliaContext.userToken}
                />
              )}
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </Index>
          </div>
        </div>
      </InstantSearch>
    </>
  );
}

function Hit({ hit }) {
  return (
    <article>
      <img src={hit.poster} />
      <h1>{hit.title}</h1>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default Search;
