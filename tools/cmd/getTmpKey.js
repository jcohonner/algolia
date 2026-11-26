const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class getTmpKey extends AlgocliScript {
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
    return "search";
  }

  /**
   * run function (mandatory)
   * available variables:
   * - this.options: contains your command options
   * - this.client: Algolia client instance
   */
  async run() {
    // validUntil is a unix timestamp in seconds
    const validUntil = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const tmpKey = this.client.generateSecuredApiKey({
      parentApiKey: this.apikey,
      restrictions: { validUntil },
    });
    console.log("temporary key valid 1 week = ", tmpKey);
  }
};
