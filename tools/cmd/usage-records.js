const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class usage extends AlgocliScript {
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
    return "usage";
  }

  /**
   * run function (mandatory)
   * available variables:
   * - this.options: contains your command options
   * - this.client: Algolia client instance
   */
  async run() {
    //From 7 days ago to now
    const startDate = new Date(
      new Date().getTime() - 24 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const endDate = new Date().toISOString();

    const url = `https://usage.algolia.com/1/usage/records?startDate=${startDate}&endDate=${endDate}`;
    fetch(url, {
      method: "GET",
      headers: {
        "X-Algolia-Application-Id": this.appid,
        "X-Algolia-API-Key": this.apikey,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.records.map((item) => {
          const date = new Date(item.t);
          console.log(
            `${this.appid},${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()},${item.v}`,
          );
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
