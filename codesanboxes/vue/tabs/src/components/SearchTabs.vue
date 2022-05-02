<template>
  <div>
    <ul  class="searchTabs">
      <li v-for="tab in tabs" :key="tab.title" @click="setActive(tab.indexId)" v-bind:class="{active:tab.isActive}">{{ tab.title }} <span v-if="state">({{state.searchResultHits[tab.indexId]}})</span></li>  
    </ul>
    <slot></slot>
  </div>
</template>

<script>
  import { createWidgetMixin } from 'vue-instantsearch/vue3/es';
  import { provide, computed, ref } from "vue";

  const connector = (renderFn, unmountFn) => (widgetParams = {}) => ({
    init({  }) {
      renderFn(
        {
        },
        true
      );
    },

    render({scopedResults}) {
      let searchResultHits = {};

      scopedResults.forEach(indexResult => {        
        searchResultHits[indexResult.indexId] = indexResult.results.nbHits;
      });

      renderFn(
        {
          searchResultHits
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
      modelValue: {
          type: [String, Number],
      },
  }, 
  data () {
    return {
      selectedIndex: 'movies-full',
      tabs: [],
    }
  },
  provide() {
    return {
      $_searchTabs_getTabs: () => this.tabs,
      selectedIndex: () => this.selectedIndex,
    }
  },
  methods: {
    setActive(tab) {
      this.selectedIndex = tab;
      console.log(this.selectedIndex);
    }
  },


  mixins: [createWidgetMixin({connector})]
};

</script>

<style>

  ul.searchTabs {
    list-style: none;
    margin: 0;
    padding: 10px;
  }

  ul.searchTabs li {
    cursor: pointer;
    padding: 10px;
    
    display: inline-block;
  }

  ul.searchTabs li.active {
    border-bottom: 1px solid #ccc;
  }
</style>