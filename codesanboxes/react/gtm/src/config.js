const APPID = "DPSO8Y4P4F";
const API_KEY = "1e27d150ddaca332b604f871b7e2d595";
const INDEX_PREFIX = "DEMO";
const chatAgentId = "";

const config = {
  APPID,
  API_KEY,
  chatAgentId,
  moviesIndexName: `${INDEX_PREFIX}_movies`,
  categoriesIndexName: `${INDEX_PREFIX}_categories`,
  actorsIndexName: `${INDEX_PREFIX}_actors`,
  querySuggestionsIndexName: `${INDEX_PREFIX}_movies_query_suggestions`,
  algoliaDemo: {
    APPID: "DPSO8Y4P4F",
    API_KEY: "1e27d150ddaca332b604f871b7e2d595",
    moviesIndexName: `DEMO_movies`,
    categoriesIndexName: `DEMO_categories`,
    actorsIndexName: `DEMO_actors`,
    querySuggestionsIndexName: `DEMO_movies_query_suggestions`,
  },
};

export default config;
