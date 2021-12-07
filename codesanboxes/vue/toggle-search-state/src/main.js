import Vue from 'vue';
import App from './App.vue';
import InstantSearch from 'vue-instantsearch';

Vue.use(InstantSearch);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});

window.addEventListener('pagehide', event => {
  if (event.persisted === true) {
    console.log('This page *might* be entering the bfcache.');
  } else {
    console.log('This page will unload normally and be discarded.');
  }
});

window.addEventListener('pageshow', event => {
  if (event.persisted) {
    console.log('This page was restored from the bfcache.');
  } else {
    console.log('This page was loaded normally.');
  }
});
