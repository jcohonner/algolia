import { checkPropTypes } from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlgoliaContext from '../context/AlgoliaContext';

function Preferences() {
  const algoliaContext = useContext(AlgoliaContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const apiHeaders = new Headers();
  apiHeaders.append('X-Algolia-API-Key', 'de4ffa91d0d23596f935534f45b046ba');
  apiHeaders.append('X-Algolia-Application-Id', '3EA6KSSDGW');

  const clickFilter = (attribute, genre) => {
    algoliaContext.aa('convertedFilters', {
      eventName: 'setUserPreference',
      index: 'movies_perso',
      userToken: algoliaContext.userToken,
      filters: [`${attribute}:${genre}`],
    });

    // Update tmp user profile
    const tmpUserProfile = algoliaContext.tmpUserProfile
      ? { ...algoliaContext.tmpUserProfile }
      : {
        scores: {},
      };

    if (!tmpUserProfile.scores[attribute])
      tmpUserProfile.scores[attribute] = {};
    tmpUserProfile.scores[attribute][genre] =
      (tmpUserProfile.scores[attribute][genre] || 0) + 1;

    algoliaContext.setTmpUserProfile(tmpUserProfile);
  };

  const genres = ['Thriller', 'Action', 'Drama', 'Crime', 'Romance', 'Family'];
  const actors = [
    'Bruce Willis',
    'Robert De Niro',
    'Nicole Kidman',
    'Tom Cruise',
  ];

  useEffect(() => {
    if (!algoliaContext.userToken) {
      navigate('/');
    }

    fetch(
      `https://personalization.eu.algolia.com/1/profiles/personalization/${algoliaContext.userToken}`,
      {
        headers: apiHeaders,
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(data => {
        console.log(data);
        algoliaContext.setUserProfile(data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // setPersonalizationFilters(['genres:Drama<score=1>']);
  }, []);

  const goToSearch = () => {
    navigate('/search');
  };

  return (
    <>
      {isLoading && (
        <div>Loading profile Information for {algoliaContext.userToken}...</div>
      )}
      {!isLoading && !algoliaContext.userProfile && (
        <>
          <h1>Set preferences for {algoliaContext.userToken}</h1>
          <h2>Genres</h2>
          <ul className="preferences">
            {genres.map(genre => (
              <li onClick={() => clickFilter('genres', genre)} key={genre}>
                {genre}
                {algoliaContext.tmpUserProfile &&
                  algoliaContext.tmpUserProfile.scores &&
                  algoliaContext.tmpUserProfile.scores.genres &&
                  algoliaContext.tmpUserProfile.scores.genres[genre]
                  ? `(${algoliaContext.tmpUserProfile.scores.genres[genre]})`
                  : ''}
              </li>
            ))}
          </ul>
          <h2>Actors</h2>
          <ul className="preferences">
            {actors.map(actor => (
              <li onClick={() => clickFilter('actors', actor)} key={actor}>
                {actor}
                {algoliaContext.tmpUserProfile &&
                  algoliaContext.tmpUserProfile.scores &&
                  algoliaContext.tmpUserProfile.scores.actors &&
                  algoliaContext.tmpUserProfile.scores.actors[actor]
                  ? `(${algoliaContext.tmpUserProfile.scores.actors[actor]})`
                  : ''}
              </li>
            ))}
          </ul>
          <button onClick={goToSearch}>Search with new preferences</button>
        </>
      )}

      {!isLoading && algoliaContext.userProfile && (
        <>
          <h1>Profile for {algoliaContext.userToken}</h1>

          <h2>Current profile</h2>

          {!algoliaContext.userProfile ? <p>No user profile yet</p> : null}

          {Object.keys(
            (algoliaContext.userProfile || { scores: {} }).scores
          ).map(attr => (
            <div key={attr}>
              <h2>{attr}</h2>
              <ul className="preferences">
                {Object.keys(algoliaContext.userProfile.scores[attr]).map(
                  value => (
                    <li key={value}>
                      {value}: {algoliaContext.userProfile.scores[attr][value]}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
          <button onClick={goToSearch}>Search with profile</button>
        </>
      )}
    </>
  );
}

export default Preferences;
