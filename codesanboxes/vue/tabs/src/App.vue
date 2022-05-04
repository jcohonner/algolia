<template>
  <div>
    <header class="header">
      <h1 class="header-title">
        <a href="/">tabs</a>
      </h1>
      <p class="header-subtitle">
        using
        <a href="https://github.com/algolia/vue-instantsearch">
          Vue InstantSearch
        </a>
      </p>
    </header>

    <div class="container">
      <ais-instant-search :search-client="searchClient" index-name="movies">
        <ais-configure :hits-per-page.camel="1" />

        <ais-search-box
          :placeholder="'Search for movies, actors or directors'"
        />

        <search-tabs default-index="movies-full">
          <!-- Tab 1 -->
          <search-tab :title="'Movies'" :index-id="'movies-full'">
            <ais-index
              index-name="movies"
              index-id="movies-full"
              ref="indexMovies"
            >
              <ais-configure :hits-per-page.camel="8" />
              <div class="search-panel">
                <div class="search-panel__filters">
                  <ais-dynamic-widgets>
                    <ais-refinement-list attribute="actors" />
                    <ais-refinement-list attribute="genres" />
                    <ais-refinement-list attribute="on_sale" />
                    <ais-refinement-list attribute="director" />
                  </ais-dynamic-widgets>
                </div>

                <div class="search-panel__results">
                  <ais-hits>
                    <template v-slot:item="{ item }">
                      <article>
                        <img :src="item.poster" style="max-width: 100%" />
                        <h1>
                          <ais-highlight :hit="item" attribute="title" />
                        </h1>
                      </article>
                    </template>
                  </ais-hits>

                  <div class="pagination">
                    <ais-pagination />
                  </div>
                </div>
              </div>
            </ais-index>
          </search-tab>
          <!-- Tab 1 bis -->
          <search-tab :title="'Science Fiction only'" :index-id="'movies-sf'">
            <ais-index
              index-name="movies"
              index-id="movies-sf"
              ref="indexMovies"
            >
              <ais-configure :hits-per-page.camel="8" filters="genres:'Science Fiction'"/>

              <div class="search-panel">
                <div class="search-panel__filters">
                  <ais-dynamic-widgets>
                    <ais-refinement-list attribute="actors" />
                    <ais-refinement-list attribute="genres" />
                    <ais-refinement-list attribute="on_sale" />
                    <ais-refinement-list attribute="director" />
                  </ais-dynamic-widgets>
                </div>

                <div class="search-panel__results">
                  <ais-hits>
                    <template v-slot:item="{ item }">
                      <article>
                        <img :src="item.poster" style="max-width: 100%" />
                        <h1>
                          <ais-highlight :hit="item" attribute="title" />
                        </h1>
                      </article>
                    </template>
                  </ais-hits>

                  <div class="pagination">
                    <ais-pagination />
                  </div>
                </div>
              </div>
            </ais-index>
          </search-tab>
          <!-- Tab 2 -->
          <search-tab :title="'Actors'" :index-id="'actors'">
            <ais-index index-name="actors">
              <ais-configure :hits-per-page.camel="8" />
              <div class="search-panel">
                <div class="search-panel__filters"></div>

                <div class="search-panel__results">
                  <ais-hits>
                    <template v-slot:item="{ item }">
                      <article>
                        <img :src="item.picture" style="max-width: 100%" />
                        <h1>
                          <ais-highlight :hit="item" attribute="name" />
                        </h1>
                      </article>
                    </template>
                  </ais-hits>

                  <div class="pagination">
                    <ais-pagination />
                  </div>
                </div>
              </div>
            </ais-index>
          </search-tab>
          <!-- Tab 3 -->
          <search-tab :title="'Directors'" :index-id="'directors'">
            <ais-index index-name="directors">
              <ais-configure :hits-per-page.camel="8" />
              <div class="search-panel">
                <div class="search-panel__filters"></div>

                <div class="search-panel__results">
                  <ais-hits>
                    <template v-slot:item="{ item }">
                      <article>
                        <img :src="item.picture" style="max-width: 100%" />
                        <h1>
                          <ais-highlight :hit="item" attribute="name" />
                        </h1>
                      </article>
                    </template>
                  </ais-hits>

                  <div class="pagination">
                    <ais-pagination />
                  </div>
                </div>
              </div>
            </ais-index>
          </search-tab>
        </search-tabs>
      </ais-instant-search>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import SearchTabs from './components/SearchTabs.vue';
import SearchTab from './components/SearchTab.vue';

export default {
  components: { SearchTabs, SearchTab },
  data() {
    return {
      searchClient: algoliasearch(
        '3EA6KSSDGW',
        '23fef1254e41ec407b1fc80f852e4a40'
      ),
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

h1 {
  font-size: 1rem;
}

em {
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
