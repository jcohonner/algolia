import React from 'react';
import PropTypes from 'prop-types';
import algoliasearch from 'algoliasearch/lite';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Preferences from './components/Preferences';
import Search from './components/Search';
import UserToken from './components/UserToken';
import AlgoliaContext from './context/AlgoliaContext';
import aa from 'search-insights';
import './App.css';

const searchClient = algoliasearch(
  '3EA6KSSDGW',
  '23fef1254e41ec407b1fc80f852e4a40'
);

function App() {
  aa('init', {
    appId: '3EA6KSSDGW',
    apiKey: '23fef1254e41ec407b1fc80f852e4a40',
  });

  const [userToken, setUserToken] = React.useState(null);
  const [userProfile, setUserProfile] = React.useState(null);
  const [tmpUserProfile, setTmpUserProfile] = React.useState(null);

  return (
    <AlgoliaContext.Provider
      value={{
        searchClient,
        aa,
        userToken,
        setUserToken,
        userProfile,
        setUserProfile,
        tmpUserProfile,
        setTmpUserProfile,
      }}
    >
      <div>
        <header className="header">
          <h1 className="header-title">
            <a href="/">Algolia Personalization & User Preferences</a>
          </h1>
          <p className="header-subtitle">
            using{' '}
            <a href="https://github.com/algolia/react-instantsearch">
              React InstantSearch
            </a>
          </p>
        </header>

        <div className="container">
          <Router>
            <Routes>
              <Route path="/" element={<UserToken />} />
              <Route path="/profile" element={<Preferences />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Router>
        </div>
      </div>
    </AlgoliaContext.Provider>
  );
}

function Hit(props) {
  return (
    <article>
      <p>
        <code>{JSON.stringify(props.hit).slice(0, 100)}...</code>
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
