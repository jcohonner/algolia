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
   * - this.index: Algolia Index instance
   */
  async run() {
    const query = "bruce willis";
    const params = {
      hitsPerPage: 10,

      rulesAtQueryTime: [
        {
          objectID: "reranking_search",
          consequence: {
            filterPromotes: true,
            promote: [
              {
                objectIDs: ["410554"],
                position: 0,
              },
            ],
            userData: {
              "promoted-by-searchML-count": 292,
            },
          },
          description: "search reranking for query : perceuse makita 18v",
        },
      ],

      attributesToRetrieve: ["objectID", "name"],
    };

    this.index
      .search(query, params)
      .then(function (result) {
        console.log(JSON.stringify(result, null, 2));
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
