const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class compareAttributes extends AlgocliScript {
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
   * - this.index: Algolia Index instance
   */
  async run() {
    let sameValue = 0;
    let totalCount = 0;

    try {
      await this.client.browseObjects({
        indexName: this.indexName,
        browseParams,
        aggregator: ({ hits }) => {
          hits.forEach((hit) => {
            totalCount++;
            if (hit.image_url === hit.thumbnail_url) {
              sameValue++;
            }
          });
        },
      });

      console.log(`Total count: ${totalCount}`);
      console.log(`Same value: ${sameValue}`);
    } catch (error) {
      console.log(error);
    }
  }
};
