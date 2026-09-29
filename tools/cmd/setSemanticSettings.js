const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class setSettings extends AlgocliScript {
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
   * - this.index: Algolia Index instance
   */
  async run() {
    const indexSettings = this.options[this.indexName];

    if (!indexSettings) {
      console.log("No settings found for this index");
      return;
    }
    this.client
      .customPut({
        path: `1/indexes/${this.indexName}/semanticSearch/settings`,
        body: indexSettings,
      })
      .then(() => {
        console.log(
          `Semantic Settings applied successfully to index: ${this.indexName}`,
        );
      })
      .catch((err) => {
        console.error(
          `Error applying semantic settings to index: ${this.indexName}`,
          err,
        );
      });
  }
};
