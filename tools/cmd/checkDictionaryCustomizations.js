const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class checkDictionaryCustomizations extends AlgocliScript {
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
      optionfilePath
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
    let results = await this.client.customGet({
      path: "/1/dictionaries/*/languages",
    });
    console.log("running checkDictionaryCustomizations", results);
  }
};
