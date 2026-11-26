const AlgocliScript = require.main.require("./src/algocliScript");

const fs = require("fs");

module.exports = class createRule extends AlgocliScript {
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
    if (!this.options.file) {
      throw new Error("You must specify a filepath -o file:<filepath>");
    }

    try {
      const rule = JSON.parse(fs.readFileSync(this.options.file, "utf8"));
      await this.confirm(
        `Are you sure you want to SAVE rule "${rule.objectID}" in index ${this.indexName}?`
      );
      const response = await this.client.saveRule({
        indexName: this.indexName,
        objectID: rule.objectID,
        rule,
      });
      console.log("Rule pushed", response);
    } catch (e) {
      console.error(e);
    }
  }
};
