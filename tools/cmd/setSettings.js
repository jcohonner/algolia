const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class setSettings extends AlgocliScript {
  /**
   * constructor
   */
  constructor(appid, apikey, index, optionString, optionfilePath) {
    // add here your default options values
    // it will be used when you use the command without options
    let defaultOptionValues = {};
    super(appid, apikey, index, optionString, defaultOptionValues, optionfilePath);
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

    const settings = this.options[this.indexName];

    if (!settings) {
      console.log("No settings found for this index");
      return;
    }

    

    this.index
      .setSettings(settings)
      .then(() => {
        console.log("Settings updated");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
