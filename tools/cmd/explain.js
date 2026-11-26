const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class explain extends AlgocliScript {
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
    const results = await this.client.searchSingleIndex({
      indexName: this.indexName,
      searchParams: {
        query: "****",
        analytics: false,
        attributesToRetrieve: ["*"],
        // ruleContexts: ["reranking-search"],
        attributesToSnippet: [],
        attributesToHighlight: [],
        enableABTest: false,
        explain: ["*"],
        facets: ["*"],
        getRankingInfo: true,
        hitsPerPage: 10,
        maxValuesPerFacet: 100,
        page: 0,
        responseFields: ["*"],
      },
    });

    console.log(JSON.stringify(results, null, 2));
  }
};
