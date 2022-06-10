import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlgoliaContext from '../context/AlgoliaContext';

function UserToken() {
  const algoliaContext = useContext(AlgoliaContext);
  const navigate = useNavigate();

  const handleKeyPress = event => {
    if (event.keyCode === 13 || event.charCode === 13) {
      navigate('/profile');
    }
  };

  const handleChange = event => {
    algoliaContext.setUserToken(event.target.value);
  };

  return (
    <>
      <h1>Set User Token</h1>
      <input
        type="text"
        value={algoliaContext.userToken || ''}
        onKeyPress={e => handleKeyPress(e)}
        onChange={e => handleChange(e)}
      />
    </>
  );
}

export default UserToken;
