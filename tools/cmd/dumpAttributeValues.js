const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class dumpAttributeValues extends AlgocliScript {
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
    const brandNames = {};

    await this.client.browseObjects({
      indexName: this.indexName,
      browseParams: {
        query: "",
        attributesToRetrieve: ["BrandNameEn"],
      },
      aggregator: ({ hits }) => {
        console.log(".");
        hits.forEach((hit) => {
          brandNames[hit.BrandNameEn] = true;
        });
      },
    });

    console.log(Object.keys(brandNames).join("\n"));
  }
};
