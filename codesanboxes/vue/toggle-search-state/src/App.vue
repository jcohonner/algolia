<template>
  <div>
    <header class="header">
      <h1 class="header-title"><a href="/">Vue InstantSearch</a></h1>
      <p class="header-subtitle">Toggle search and state</p>
    </header>

    <div class="container">
      <p v-on:click="showSearch = !showSearch">Toggle Search</p>
      <ais-instant-search
        :search-client="searchClient"
        index-name="demo_ecommerce"
        v-if="showSearch"
      >
        <ais-configure :hits-per-page.camel="4" />
        <div class="search-panel">
          <div class="search-panel__filters">
            <ais-refinement-list attribute="categories" searchable />
          </div>

          <div class="search-panel__results">
            <ais-search-box placeholder="Search here…" class="searchbox" />
            <ais-infinite-hits :cache="cache">
              <template slot="item" slot-scope="{ item }">
                <h1>
                  <a href="/product.html">
                    <ais-highlight :hit="item" attribute="name" />
                  </a>
                </h1>
                <p><ais-highlight :hit="item" attribute="description" /></p>
              </template>
            </ais-infinite-hits>
          </div>
        </div>
      </ais-instant-search>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/algolia-min.css';

import { createInfiniteHitsSessionStorageCache } from 'instantsearch.js/es/lib/infiniteHitsCache';
import { history } from 'instantsearch.js/es/lib/routers';
import { simple } from 'instantsearch.js/es/lib/stateMappings';

export default {
  data() {
    return {
      searchClient: algoliasearch(
        'B1G2GM9NG0',
        'aadef574be1f9252bb48d4ea09b5cfe5'
      ),
      cache: createInfiniteHitsSessionStorageCache(),
      routing: {
        router: history(),
        stateMapping: simple(),
      },
      showSearch: false,
    };
  },
};
</script>

<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

.ais-Highlight-highlighted {
  background: cyan;
  font-style: normal;
}

.header {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.5rem 1rem;
  background-image: linear-gradient(to right, #4dba87, #2f9088);
  color: #fff;
  margin-bottom: 1rem;
}

.header a {
  color: #fff;
  text-decoration: none;
}

.header-title {
  font-size: 1.2rem;
  font-weight: normal;
}

.header-title::after {
  content: ' ▸ ';
  padding: 0 0.5rem;
}

.header-subtitle {
  font-size: 1.2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-panel {
  display: flex;
}

.search-panel__filters {
  flex: 1;
  margin-right: 1em;
}

.search-panel__results {
  flex: 3;
}

.searchbox {
  margin-bottom: 2rem;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
