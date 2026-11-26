const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class recordCount extends AlgocliScript {
  /**
   * constructor
   */
  constructor(appid, apikey, index, optionString, optionfilePath) {
    // add here your default options values
    // it will be used when you use the command without options
    let defaultOptionValues = {};
    super(
      appid,
      apikey,
      index,
      optionString,
      defaultOptionValues,
      optionfilePath,
    );
  }

  /**
   * run function (mandatory)
   * available variables:
   * - this.options: contains your command options
   * - this.client: Algolia client instance
   */
  async run() {
    try {
      this.client.listIndices().then(({ items }) => {
        const entries = items.reduce((acc, item) => {
          if (item.virtual !== true) {
            acc += item.entries;
          }
          return acc;
        }, 0);

        console.log(`${this.appid},${entries}`);
      });
    } catch (error) {
      console.log(error);
    }
  }
};
