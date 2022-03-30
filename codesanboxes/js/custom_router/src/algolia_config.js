window.algoliaConfig = {
  instant: {
    enabled: true,
    selector: '.columns',
    isAddToCartEnabled: true,
    addToCartParams: {

    },
    infiniteScrollEnabled: true,
    urlTrackedParameters: null,
  },
  autocomplete: {
    enabled: true,
    selector: '.algolia-search-input',
    sections: [
      { name: 'erp_marque_label', label: 'Marques', hitsPerPage: '5' },
    ],
    nbOfProductsSuggestions: 5,
    nbOfCategoriesSuggestions: 5,
    nbOfQueriesSuggestions: 0,
    isDebugEnabled: false,
  },
  landingPage: { query: '', configuration: '[]' },
  extensionVersion: '3.2.0',
  applicationId: '',
  indexName: '',
  apiKey:
    '',
  attributeFilter: [],
  facets: [
    {
      attribute: 'taille',
      type: 'conjunctive',
      label: 'Taille',
      searchable: '1',
      create_rule: '2',
    },
    {
      attribute: 'calcul_pastille_stock',
      type: 'disjunctive',
      label: 'Stock',
      searchable: '1',
      create_rule: '2',
    },
    {
      attribute: 'price',
      type: 'slider',
      label: 'Prix',
      searchable: '2',
      create_rule: '2',
    },
    {
      attribute: 'categories',
      type: 'conjunctive',
      label: 'Categories',
      searchable: '2',
      create_rule: '2',
    },
    {
      attribute: 'color',
      type: 'disjunctive',
      label: 'Couleur',
      searchable: '1',
      create_rule: '2',
    },
    {
      attribute: 'erp_marque_label',
      type: 'disjunctive',
      label: 'Marque',
      searchable: '1',
      create_rule: '2',
    },
    {
      attribute: 'diametre',
      type: 'conjunctive',
      label: 'Diam\u00e8tre',
      searchable: '1',
      create_rule: '2',
    },
    {
      attribute: 'collectionweb',
      type: 'conjunctive',
      label: 'Collection',
      searchable: '1',
      create_rule: '2',
    },
    {
      attribute: 'calcul_encart',
      type: 'conjunctive',
      label: 'Encart',
      searchable: '1',
      create_rule: '2',
    },
  ],
  areCategoriesInFacets: true,
  hitsPerPage: 9,
  sortingIndices: [
    {
      attribute: 'price',
      sort: 'asc',
      sortLabel: 'Lowest price',
      name: 'osv3preprod_fr_products_price_default_asc',
      label: 'Lowest price',
      ranking: [
        'asc(price.EUR.default)',
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
    },
    {
      attribute: 'price',
      sort: 'desc',
      sortLabel: 'Highest price',
      name: 'osv3preprod_fr_products_price_default_desc',
      label: 'Highest price',
      ranking: [
        'desc(price.EUR.default)',
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
    },
    {
      attribute: 'created_at',
      sort: 'desc',
      sortLabel: 'Newest first',
      name: 'osv3preprod_fr_products_created_at_desc',
      label: 'Newest first',
      ranking: [
        'desc(created_at)',
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
    },
    {
      attribute: 'calcul_remise',
      sort: 'desc',
      sortLabel: 'Remise',
      name: 'osv3preprod_fr_products_calcul_remise_desc',
      label: 'Remise',
      ranking: [
        'desc(calcul_remise)',
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
    },
  ],
  isSearchPage: false,
  isCategoryPage: false,
  isLandingPage: false,
  removeBranding: true,
  productId: null,
  priceKey: '.EUR.default',
  currencyCode: 'EUR',
  currencySymbol: '\u20ac',
  priceFormat: {
    pattern: '%s\u00a0\u20ac',
    precision: 2,
    requiredPrecision: 2,
    decimalSymbol: ',',
    groupSymbol: '\u202f',
    groupLength: 3,
    integerRequired: false,
  },
  maxValuesPerFacet: 10,
  autofocus: true,
  request: {
    query: '',
    refinementKey: '',
    refinementValue: '',
    categoryId: '',
    landingPageId: '',
    path: '',
    level: '',
  },
  showCatsNotIncludedInNavigation: false,
  showSuggestionsOnNoResultsPage: true,
  baseUrl: 'https://fr-preprod.oreca-store.com',
  popularQueries: [
    'Phare additionnel 100w-ford-laser_ _tools-category-store-ford-laser_ _',
    'silent bloc \u00e9chappement',
    'HUILE Boite de Vitesse',
    'durite silicone',
    'gulf',
    'table basse en ch\u00eane',
    'sprint rs 2',
    'casque',
    'volant',
    'RENAULT SPORT',
  ],
  useAdaptiveImage: true,
  urls: {
    logo:
      'https://fr-preprod.oreca-store.com/static/version1647611219/frontend/Oreca/Os/fr_FR/Algolia_AlgoliaSearch/images/search-by-algolia.svg',
  },
  ccAnalytics: {
    enabled: false,
    ISSelector: '.ais-Hits-item a.result, .ais-InfiniteHits-item a.result',
    conversionAnalyticsMode: 'add_to_cart',
    addToCartSelector: '.action.primary.tocart',
    orderedProductIds: null,
  },
  isPersonalizationEnabled: true,
  personalization: {
    enabled: true,
    viewedEvents: {
      viewProduct: {
        eventName: 'Viewed Product',
        enabled: true,
        method: 'viewedObjectIDs',
      },
    },
    clickedEvents: {
      productClicked: {
        eventName: 'Product Clicked',
        enabled: true,
        selector: '.ais-Hits-item a.result, .ais-InfiniteHits-item a.result',
        method: 'clickedObjectIDs',
      },
      productRecommended: {
        eventName: 'Recommended Product Clicked',
        enabled: true,
        selector: '.products-upsell .product-item',
        method: 'clickedObjectIDs',
      },
    },
    filterClicked: {
      eventName: 'Filter Clicked',
      enabled: true,
      method: 'clickedFilters',
    },
  },
  analytics: {
    enabled: true,
    delay: '3000',
    triggerOnUiInteraction: '1',
    pushInitialSearch: '0',
  },
  now: 1648166400,
  queue: {
    isEnabled: true,
    nbOfJobsToRun: 5,
    retryLimit: 3,
    nbOfElementsPerIndexingJob: 300,
  },
  isPreventBackendRenderingEnabled: false,
  areOutOfStockOptionsDisplayed: false,
  translations: {
    to: '\u00e0',
    or: 'ou',
    go: 'Go',
    popularQueries: 'Vous pouvez essayer une recherche parmi',
    seeAll: 'Voir tous les produits',
    allDepartments: 'All departments',
    seeIn: 'See products in',
    orIn: 'or in',
    noProducts: 'Pas de produits correspondants \u00e0',
    noResults: 'Aucun r\u00e9sultat',
    refine: 'Filtre',
    selectedFilters: 'Selected Filters',
    clearAll: 'Tout Supprimer',
    previousPage: 'Page pr\u00e9c\u00e9dente',
    nextPage: 'Page suivante',
    searchFor: 'Search for products',
    relevance: 'Pertinence',
    categories: 'Categories',
    products: 'Produits',
    searchBy: 'Search by',
    searchForFacetValuesPlaceholder: 'Search for other ...',
    showMore: 'Voir plus de produits',
    seeAllBrands: 'Voir toutes les marques',
    brandsUrl: '/nos-marques',
    promotion: 'promo',
    encart: { promotion: 'promo', new: 'new', best: 'best' },
    stock: {
      'En stock': 'En stock',
      En_stock: 'En stock',
      'In stock': 'En stock',
      Sur_commande: 'Sur commande',
      sur_commande: 'Sur commande',
      'Sur commande': 'Sur commande',
      'On order': 'Sur commande',
      Livrable: 'En stock fournisseur',
      Delivrable: 'En stock fournisseur',
      Partiellement_disponible: 'Partiellement dispo',
      'Partiellement disponible': 'Partiellement dispo',
      'Partially available': 'Partiellement dispo',
    },
  },
};
