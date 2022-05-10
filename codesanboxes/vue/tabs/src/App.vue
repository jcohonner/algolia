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
      <ais-instant-search
        :search-client="searchClient"
        index-name="movies"
        ref="aisIS"
      >
        <ais-configure :hits-per-page.camel="1" />

        <ais-search-box
          :placeholder="'Search for movies, actors or directors'"
          v-show="asYouType"
        />

        <form action="" role="search" novalidate="" class="ais-SearchBox-form" v-on:submit="manualSearch" v-show="!asYouType">
          <input
            ref="searchBox"
            type="search"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            required=""
            maxlength="512"
            aria-label="Search"
            placeholder="Search for movies, actors or directors"
            class="ais-SearchBox-input"
          /><button type="submit" title="Search" class="ais-SearchBox-submit">
            <svg
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 40 40"
              class="ais-SearchBox-submitIcon"
            >
              <path
                d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"
                fillRule="evenodd"
              ></path>
            </svg></button
          >
        </form>

        <div class="qs">
          <ais-index index-name="movies_query_suggestions" index-id="movies-qs">
            <ais-configure :hits-per-page.camel="4" />
            <ais-hits :transform-items="removeExactQueryQuerySuggestion">
              <template v-slot:item="{ item }">
                <ais-highlight
                  :hit="item"
                  attribute="query"
                  @click="search(item.query)"
                />
              </template>
            </ais-hits>
          </ais-index>
        </div>

        <all-results>
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
                <ais-configure
                  :hits-per-page.camel="8"
                  filters="genres:'Science Fiction'"
                />

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
        </all-results>
      </ais-instant-search>
    </div>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import SearchTabs from './components/SearchTabs.vue';
import SearchTab from './components/SearchTab.vue';
import AllResults from './components/AllResults.vue';

const algoliaClient = algoliasearch(
    '3EA6KSSDGW',
    '23fef1254e41ec407b1fc80f852e4a40'
  );


const searchClient = {
  ...algoliaClient,
  search(requests) {
    //set to false to disable emty query
    const allowEmptyQuery = true;
    if (!allowEmptyQuery && requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};

export default {
  components: { SearchTabs, SearchTab, AllResults },
  data() {


    return {
      searchClient,
      asYouType:true
    };
  },
  methods: {
    manualSearch(e) {
      e.preventDefault();
      this.$refs.aisIS.instantSearchInstance.helper.setQuery(this.$refs.searchBox.value).search();
    },
    search(query) {
      this.$refs.searchBox.value = query;
      this.$refs.aisIS.instantSearchInstance.helper.setQuery(query).search();
    },
    removeExactQueryQuerySuggestion(items) {
      const currentQuery =
        this.$refs.aisIS.instantSearchInstance.helper.state.query.toLowerCase();
      return items.filter((item) => item.query.toLowerCase() !== currentQuery);
    }
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

.qs {
  margin: 10px 0 10px 0;
}

.qs ol {
  display: flex;
}

.qs ol li.ais-Hits-item {
  padding: 0.5rem;
  cursor: pointer;
}
</style>
