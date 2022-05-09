<template>
    <div v-if="state">
        <div v-show="state.hasResult"><slot></slot></div>
        <div v-show="!state.hasResult">

            <p>No results found for {{state.query}}. You may also like</p>

            <ais-index index-name="movies" index-id="noresult">
                <ais-configure :hits-per-page.camel="4" query="" />
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
                
            </ais-index>
        </div>
    </div>
</template>

<script>
import { createWidgetMixin } from 'vue-instantsearch/vue3/es';
import { provide, computed, ref } from 'vue';

/*
        <div v-show="state.hasResult"><slot></slot></div>
        <div v-show="!state.hasResult">Oups</div>
*/


const connector =
  (renderFn, unmountFn) =>
  (widgetParams = {}) => ({
    init({}) {
      renderFn({hasResult:true}, true);
    },

    render({ scopedResults, helper }) {
      const hasResult = scopedResults && scopedResults.some(indexResult => (indexResult.indexId!=="noresult" && indexResult.results.nbHits > 0));
        
      renderFn(
        {
          hasResult,
          query: helper.state.query,
        },
        false
      );
    },

    dispose() {
      unmountFn();
    },
  });

export default {
  props: {
  },
  data() {
    return {
    };
  },
  methods: {
  },

  mixins: [createWidgetMixin({ connector })],
};
</script>

