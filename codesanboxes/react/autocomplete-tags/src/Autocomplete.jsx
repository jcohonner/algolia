// file: Autocomplete.jsx

import { autocomplete, getAlgoliaFacets } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

export function Autocomplete(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    function mapToAlgoliaNegativeFilters(tags, facetsToNegate, operator = 'AND') {
        return tags
          .map(({ label, facet }) => {
            const filter = `${facet}:"${label}"`
      
            return facetsToNegate.includes(facet) && `NOT ${filter}`
          })
          .filter(Boolean)
          .join(` ${operator} `)
    }

    const search = autocomplete({
      getSources({query, state}) {
        return [
          {
            sourceId: 'brands',
            getItems({ query, state }) {
              if (!query) return [];
              return getAlgoliaFacets({
                searchClient:props.searchClient,
                queries: [
                  {
                    indexName: 'instant_search',
                    facet: 'brand',
                    params: {
                      facetQuery: query,
                      maxFacetHits: 5,
                      filters: mapToAlgoliaNegativeFilters(
                        state.context.tagsPlugin.tags,
                        ['brand']
                      ),
                    },
                  },
                ],
                transformResponse({ facetHits }) {
                  return facetHits[0].map(hit => ({ ...hit, facet: 'brand' }));
                },
              });
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Brands</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({ item, components, html }) {
                return html`
                  <div className="aa-ItemWrapper">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">
                        <div className="aa-ItemContentTitle">
                          ${components.Highlight({
                            hit: item,
                            attribute: 'label',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="aa-ItemActions">
                      <button
                        className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                        type="button"
                        title="Filter"
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                `;
              },
            },
            onSelect({ item, setQuery }) {
                if (item.label.toLowerCase().includes(query.toLowerCase())) {
                setQuery('')
            }
            },

          },
          {
            sourceId: 'categories',
            getItems({ query, state }) {
              if (!query) return [];
              return getAlgoliaFacets({
                searchClient:props.searchClient,
                queries: [
                  {
                    indexName: 'instant_search',
                    facet: 'categories',
                    params: {
                      facetQuery: query,
                      maxFacetHits: 5,
                      filters: mapToAlgoliaNegativeFilters(
                        state.context.tagsPlugin.tags,
                        ['categories']
                      ),
                    },
                  },
                ],
                transformResponse({ facetHits }) {
                  return facetHits[0].map(hit => ({ ...hit, facet: 'categories' }));
                },
              });
            },
            templates: {
              header() {
                return (
                  <Fragment>
                    <span className="aa-SourceHeaderTitle">Categories</span>
                    <div className="aa-SourceHeaderLine" />
                  </Fragment>
                );
              },
              item({ item, components, html }) {
                return html`
                  <div className="aa-ItemWrapper">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">
                        <div className="aa-ItemContentTitle">
                          ${components.Highlight({
                            hit: item,
                            attribute: 'label',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="aa-ItemActions">
                      <button
                        className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                        type="button"
                        title="Filter"
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                `;
              },
            },
            onSelect({ item, setQuery }) {
                if (item.label.toLowerCase().includes(query.toLowerCase())) {
                setQuery('')
            }
            },
          },
        ];
      },
      container: containerRef.current,
      renderer: { createElement, Fragment, render },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}
