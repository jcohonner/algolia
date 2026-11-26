const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class dumpAttributeValuesSearch extends AlgocliScript {
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
     * returns the required key type (admin|search|usage) for this command
     */
    static get keyType() {
        return "search";
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     */
    async run() {
    const queries = [""];
    const params = {
      hitsPerPage: 500,
      attributesToRetrieve: ["BrandNameEn", "BrandNameAr"],
      filters: "",
      enableRules: true,
      distinct: true,
      //insideBoundingBox: [[25.417204, 51.323518, 25.117815, 51.746619]]
    };

    for (const query of queries) {
      try {
        const { hits } = await this.client.searchSingleIndex({
          indexName: this.indexName,
          searchParams: { query, ...params },
        });
        const referenceResults = hits.map((hit) => ({
          BrandNameEn: hit.BrandNameEn,
          BrandNameAr: hit.BrandNameAr,
        }));

        //write to json file
        require("fs").writeFileSync(
          "output/snoonu-brandNames.json",
          JSON.stringify(referenceResults)
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
};
