const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class browse extends AlgocliScript {
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
    return "admin";
  }

  /**
   * run function (mandatory)
   * available variables:
   * - this.options: contains your command options
   * - this.client: Algolia client instance
   */
  async run() {
    const browseParams = {
      filters: "",
      hitsPerPage: 10,
    };
    let allHits = [];

    await this.client.browseObjects({
      indexName: this.indexName,
      browseParams,
      aggregator: ({ hits }) => {
        allHits.push(...hits);
      },
    });

    allHits.forEach((hit) => {
      console.log(hit.objectID);
    });

    -(
      // print the response
      console.log(JSON.stringify(allHits, null, 2))
    );
  }
};
