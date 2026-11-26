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
   */
  async run() {
    const indexSettings = this.options[this.indexName];

    if (!indexSettings) {
      console.log("No settings found for this index");
      return;
    }

    await this.confirm(
      `Are you sure you want to APPLY SETTINGS (${Object.keys(indexSettings).join(", ")}) to index ${this.indexName}?`
    );
    try {
      await this.client.setSettings({ indexName: this.indexName, indexSettings });
      console.log("Settings updated");
    } catch (err) {
      console.log(err);
    }
  }
};
