const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class deleteIndex extends AlgocliScript {
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
    await this.confirm(
      `Are you sure you want to DELETE index ${this.indexName} (this cannot be undone)?`
    );
    const response = await this.client.deleteIndex({ indexName: this.indexName });
    console.log("Index deleted", response);
  }
};
