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
      analytics: true,
      analyticsTags: ["search-curl"],
    };

    const requests = [
      {
        indexName: this.defaultOptionValues.indexName,

        query: "bruce willis",
        ...params,
      },
    ];

    console.log(JSON.stringify(requests, null, 2));

    const url = `https://${this.defaultOptionValues.appid}-dsn.algolia.net/1/indexes/*/queries`;

    console.log(url);

    try {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Algolia-API-Key": this.defaultOptionValues.apikey,
          "X-Algolia-Application-Id": this.defaultOptionValues.appid,
        },
        body: JSON.stringify({ requests }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(JSON.stringify(data, null, 2));
        });
    } catch (error) {
      console.log(error);
    }
  }
};
