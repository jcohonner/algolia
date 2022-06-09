import { checkPropTypes } from 'prop-types';
import React from 'react';
import {
  connectRefinementList,
  connectStateResults,
} from 'react-instantsearch-core';

const indexList = ['movies', 'movies2006'];
const primary = indexList[0];

const UnifiedRefinementListWithStateResult = connectStateResults(
  ({ allSearchResults, attribute }) => (
    <UnifiedRefinementList
      attribute={attribute}
      allSearchResults={allSearchResults}
    />
  )
);

const UnifiedRefinementList = connectRefinementList(
  ({ allSearchResults, refine, attribute }) => {
    if (!allSearchResults) return <></>;


    // Build data for Items from allSearchResults
    const itemMap = {};
    const refined = [];

    indexList.forEach(indexId => {
      const index = allSearchResults[indexId];
      if (
        !index ||
        !index.disjunctiveFacets ||
        index.disjunctiveFacets.length === 0
      )
        return;

      const facetValues = index.disjunctiveFacets
        .filter(facet => facet.name === attribute)
        .shift();
      if (!facetValues) return;

      // merge Data
      Object.keys(facetValues.data).forEach(key => {
        if (!itemMap[key]) {
          itemMap[key] = facetValues.data[key];
        } else {
          itemMap[key] += facetValues.data[key];
        }
      });

      (
        index._state.disjunctiveFacetsRefinements[attribute] || []
      ).forEach(refinement => refined.push(refinement));
    });

    const uniqueRefined = [...new Set(refined)];

    // create final Item list
    const items = [];
    Object.keys(itemMap).forEach(key => {
      items.push({
        label: key,
        value: uniqueRefined.includes(key)
          ? uniqueRefined.filter(refinedKey => refinedKey !== key)
          : uniqueRefined.concat(key),
        count: itemMap[key],
        isRefined: refined.includes(key),
      });
    });

    // Todo Sort items if needed

    // console.log(allSearchResults); //allSearchResults
    return (
      <div className="ais-RefinementList">
        <ul className="ais-RefinementList-list">
          {items.map(item => (
            <li
              key={item.label}
              className={`ais-RefinementList-item ${item.isRefined ? 'ais-RefinementList-item--selected' : ''
                }`}
            >
              <label className="ais-RefinementList-label">
                <input
                  className="ais-RefinementList-checkbox"
                  type="checkbox"
                  onChange={event => {
                    refine(item.value);
                  }}
                  checked={item.isRefined}
                />
                <span className="ais-RefinementList-labelText">
                  {item.label}
                </span>{' '}
                <span className="ais-RefinementList-count">{item.count}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default UnifiedRefinementListWithStateResult;
