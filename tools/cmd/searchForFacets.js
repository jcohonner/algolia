const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class search extends AlgocliScript {
  /**
   * constructor
   */
  constructor(appid, apikey, index, optionString) {
    // add here your default options values
    // it will be used when you use the command without options
    let defaultOptionValues = {};
    super(appid, apikey, index, optionString, defaultOptionValues);
  }

  /**
   * run function (mandatory)
   * available variables:
   * - this.options: contains your command options
   * - this.client: Algolia client instance
   */
  async run() {
    const params = {
      indexName: this.indexName,
      facetName: "fabricant_libelle_logo",
      query: "",
      enableABTest: false,
    };

    try {
      const facetValues = await this.client.searchForFacetValues({
        indexName: params.indexName,
        facetName: params.facetName,
        searchForFacetValuesRequest: { facetQuery: params.query },
      });
      console.log(JSON.stringify(facetValues, null, 2));

      const result = await this.client.search({
        requests: [
          {
            indexName: params.indexName,
            type: "facet",
            facet: params.facetName,
            facetQuery: params.query,
          },
        ],
      });
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.log(e);
    }
  }
};
