const AlgocliScript = require.main.require('./src/algocliScript');

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
    const objectIDs = [];

    const { results } = await this.client.getObjects({
      requests: objectIDs.map((objectID) => ({
        indexName: this.indexName,
        objectID,
        attributesToRetrieve: [
          "attributes.category-l1",
          "attributes.category-l2",
          "attributes.category-l3",
        ],
      })),
    });

    results.forEach((hit) => {
      if (hit) {
        console.log(
          [
            hit.objectID,
            hit.attributes["category-l1"],
            hit.attributes["category-l2"],
            hit.attributes["category-l3"],
          ].join(",")
        );
      } else {
        console.log("not found");
      }
    });
  }
};
