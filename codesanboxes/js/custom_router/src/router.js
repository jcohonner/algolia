/* eslint-disable complexity */
const { algoliaConfig } = window;
const algoliaBundle = {'instantsearch':window.instantsearch}

/*

Le code ci-dessous est extrait de common.js
Seules les fonction parseURL et createULR ont été modifiée
pour correspondre au contexte ORECA avec cette URL /search/query?...

*/




// The url is now rendered as follows : http://website.com?q=searchquery&facet1=value&facet2=value1~value2
// "?" and "&" are used to be fetched easily inside Magento for the backend rendering
// Multivalued facets use "~" as separator
// Targeted index is defined by sortBy parameter
window.routing = {
  router: algoliaBundle.instantsearch.routers.history({
    parseURL(qsObject) {
      const location = qsObject.location;

      const qsModule = qsObject.qsModule;
      const queryString = location.hash ? location.hash : location.search;
      //return qsModule.parse(queryString.slice(1))
      let result =  qsModule.parse(queryString.slice(1));
      //Si l'URL correspond à la recherche on récupère le 2ème élément correspondant à la query
      if (location.pathname.startsWith('/search/')) {
        result.q=decodeURI(location.pathname.slice(1).split('/')[1]?.replaceAll(/\+/ig,' '));
      }
      
      return result;
    },
    createURL(qsObject) {
      var qsModule = qsObject.qsModule,
      routeState = qsObject.routeState,
      location = qsObject.location;
      const protocol = location.protocol,
        hostname = location.hostname,
        port = location.port ? location.port : '',
        //pathname = location.pathname,
        hash = location.hash;

      //On change l'URL pour pointer vers la recherche
      // lorsqu'on a un paramètre q
      // /!\ il faudra bien vérifier les effets de bords et en 
      // particulier si activation d'Algolia sur les page catégories
      let pathname = location.pathname;
      if (routeState && routeState.q) {
        //TO do URL encode
        pathname = '/search/'+routeState.q.replaceAll(/\s+/ig,'+');
        delete routeState.q;
      }
      const queryString = qsModule.stringify(routeState);
      const portWithPrefix = port === '' ? '' : `:${port}`;
      // IE <= 11 has no location.origin or buggy. Therefore we don't rely on it
      if (!routeState || Object.keys(routeState).length === 0)
        return `${protocol}//${hostname}${portWithPrefix}${pathname}`;
      else 
        return `${protocol}//${hostname}${portWithPrefix}${pathname}?${queryString}`;
    },
  }),
  stateMapping: {
    stateToRoute(uiState) {
      const productIndexName = `${algoliaConfig.indexName}_products`;
      const uiStateProductIndex = uiState[productIndexName] || {};
      const routeParameters = {};
      if (algoliaConfig.isCategoryPage) {
        routeParameters.q = uiState[productIndexName].query;
      } else {
        routeParameters.q = uiState[productIndexName].query || '__empty__';
      }
      if (algoliaConfig.facets) {
        for (let i = 0; i < algoliaConfig.facets.length; i++) {
          const currentFacet = algoliaConfig.facets[i];
          // Handle refinement facets
          if (
            currentFacet.attribute != 'categories' &&
            (currentFacet.type == 'conjunctive' ||
              currentFacet.type == 'disjunctive')
          ) {
            routeParameters[currentFacet.attribute] =
              uiStateProductIndex.refinementList &&
              uiStateProductIndex.refinementList[currentFacet.attribute] &&
              uiStateProductIndex.refinementList[currentFacet.attribute].join(
                '~'
              );
          }
          // Handle categories
          if (
            currentFacet.attribute == 'categories' &&
            !algoliaConfig.isCategoryPage
          ) {
            routeParameters[currentFacet.attribute] =
              uiStateProductIndex.hierarchicalMenu &&
              uiStateProductIndex.hierarchicalMenu[
                `${currentFacet.attribute}.level0`
              ] &&
              uiStateProductIndex.hierarchicalMenu[
                `${currentFacet.attribute}.level0`
              ].join('~');
          }
          // Handle sliders
          if (currentFacet.type == 'slider') {
            routeParameters[currentFacet.attribute] =
              uiStateProductIndex.range &&
              uiStateProductIndex.range[currentFacet.attribute] &&
              uiStateProductIndex.range[currentFacet.attribute];
          }
        }
      }
      routeParameters.sortBy = uiStateProductIndex.sortBy;
      routeParameters.page = uiStateProductIndex.page;

      return routeParameters;
    },
    routeToState(routeParameters) {
      const productIndexName = `${algoliaConfig.indexName}_products`;
      const uiStateProductIndex = {};

      uiStateProductIndex.query =
        routeParameters.q == '__empty__' ? '' : routeParameters.q;
      if (
        algoliaConfig.isLandingPage &&
        typeof uiStateProductIndex.query === 'undefined' &&
        algoliaConfig.landingPage.query != ''
      ) {
        uiStateProductIndex.query = algoliaConfig.landingPage.query;
      }

      const landingPageConfig =
        algoliaConfig.isLandingPage && algoliaConfig.landingPage.configuration
          ? JSON.parse(algoliaConfig.landingPage.configuration)
          : {};

      uiStateProductIndex.refinementList = {};
      uiStateProductIndex.hierarchicalMenu = {};
      uiStateProductIndex.range = {};
      if (algoliaConfig.facets) {
        for (let i = 0; i < algoliaConfig.facets.length; i++) {
          const currentFacet = algoliaConfig.facets[i];
          // Handle refinement facets
          if (
            currentFacet.attribute != 'categories' &&
            (currentFacet.type == 'conjunctive' ||
              currentFacet.type == 'disjunctive')
          ) {
            uiStateProductIndex.refinementList[currentFacet.attribute] =
              routeParameters[currentFacet.attribute] &&
              routeParameters[currentFacet.attribute].split('~');
            if (
              algoliaConfig.isLandingPage &&
              typeof uiStateProductIndex.refinementList[
                currentFacet.attribute
              ] === 'undefined' &&
              currentFacet.attribute in landingPageConfig
            ) {
              uiStateProductIndex.refinementList[
                currentFacet.attribute
              ] = landingPageConfig[currentFacet.attribute].split('~');
            }
          }
          // Handle categories facet
          if (
            currentFacet.attribute == 'categories' &&
            !algoliaConfig.isCategoryPage
          ) {
            uiStateProductIndex.hierarchicalMenu['categories.level0'] =
              routeParameters.categories &&
              routeParameters.categories.split('~');
            if (
              algoliaConfig.isLandingPage &&
              typeof uiStateProductIndex.hierarchicalMenu[
                'categories.level0'
              ] === 'undefined' &&
              'categories.level0' in landingPageConfig
            ) {
              uiStateProductIndex.hierarchicalMenu[
                'categories.level0'
              ] = landingPageConfig['categories.level0'].split(' /// ');
            }
          }
          if (
            currentFacet.attribute == 'categories' &&
            algoliaConfig.isCategoryPage
          ) {
            uiStateProductIndex.hierarchicalMenu['categories.level0'] = [
              algoliaConfig.request.path,
            ];
          }
          // Handle sliders
          if (currentFacet.type == 'slider') {
            let currentFacetAttribute = currentFacet.attribute;
            if (currentFacetAttribute.indexOf('price') !== -1) {
              currentFacetAttribute += algoliaConfig.priceKey;
            }
            uiStateProductIndex.range[currentFacetAttribute] =
              routeParameters[currentFacetAttribute] &&
              routeParameters[currentFacetAttribute];
            if (
              algoliaConfig.isLandingPage &&
              typeof uiStateProductIndex.range[currentFacetAttribute] ===
                'undefined' &&
              currentFacetAttribute in landingPageConfig
            ) {
              let facetValue = '';
              if (
                typeof landingPageConfig[currentFacetAttribute]['>='] !==
                'undefined'
              ) {
                facetValue = landingPageConfig[currentFacetAttribute]['>='][0];
              }
              facetValue += ':';
              if (
                typeof landingPageConfig[currentFacetAttribute]['<='] !==
                'undefined'
              ) {
                facetValue += landingPageConfig[currentFacetAttribute]['<='][0];
              }
              uiStateProductIndex.range[currentFacetAttribute] = facetValue;
            }
          }
        }
      }
      uiStateProductIndex.sortBy = routeParameters.sortBy;
      uiStateProductIndex.page = routeParameters.page;

      const uiState = {};
      uiState[productIndexName] = uiStateProductIndex;
      return uiState;
    },
  },
};
