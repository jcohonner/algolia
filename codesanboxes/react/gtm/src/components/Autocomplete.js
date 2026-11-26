import { autocomplete } from "@algolia/autocomplete-js";
import React, { createElement, Fragment, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { algoliaClient } from "../services/algoliaClient";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";
import { useNavigate } from "react-router-dom";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import config from "../config";

export default function Autocomplete() {
  const navigate = useNavigate();
  const sources = [
    {
      sourceId: "movies",
      getItems({ query }) {
        return getAlgoliaResults({
          searchClient: algoliaClient,
          queries: [
            {
              indexName: config.moviesIndexName,
              params: {
                query,
                hitsPerPage: 5,
              },
            },
          ],
        });
      },
      templates: {
        item({ item, components }) {
          return (
            <div onClick={() => navigate(`/movie/${item.objectID}`)}>
              {item.title}
            </div>
          );
        },
        header() {
          return "movies";
        },
        noResults() {
          return "No movies";
        },
      },
      getItemUrl({ item }) {
        return `/movie/${item.objectID}`;
      },
    },
    {
      sourceId: "categories",
      getItems({ query }) {
        return getAlgoliaResults({
          searchClient: algoliaClient,
          queries: [
            {
              indexName: config.categoriesIndexName,
              params: {
                query,
                hitsPerPage: 3,
              },
            },
          ],
        });
      },
      templates: {
        item({ item, components }) {
          return (
            <div onClick={() => navigate(`/category/${item.objectID}`)}>
              {item.name}
            </div>
          );
        },
        header() {
          return "Categories";
        },
        noResults() {
          return "No categories";
        },
      },
      getItemUrl({ item }) {
        return `/category/${item.objectID}`;
      },
    },
  ];

  const onSubmit = ({ state }) => {
    navigate(`/search?query=${state.query}`);
    navigate(0); //force refresh as we may be on the search already
  };

  const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: "RECENT_SEARCH",
    limit: 5,
    transformSource({ source }) {
      return {
        ...source,
        getItemUrl({ item }) {
          return `/search?query=${item.label}`;
        },
        templates: {
          ...source.templates,
          item(params) {
            const { item, html } = params;

            return html`<a
              className="aa-ItemLink"
              href="/search?query=${item.label}"
            >
              ${source.templates.item(params).props.children}
            </a>`;
          },
        },
      };
    },
  });

  const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    algoliaClient,
    indexName: config.querySuggestionsIndexName,
  });

  return (
    <div className="w-full">
      <AlgoliaAutocomplete
        getSources={({ query }) => (query === "" ? [] : sources)}
        plugins={[recentSearchesPlugin]}
        openOnFocus={true}
        placeholder="Search for movies"
        onSubmit={onSubmit}
      />
    </div>
  );
}

function AlgoliaAutocomplete({ className, ...autocompleteProps }) {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
      ...autocompleteProps,
    });

    return () => {
      search.destroy();
    };
  }, [autocompleteProps]);

  return <div ref={containerRef} className={className} />;
}
