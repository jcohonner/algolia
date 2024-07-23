const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class copyRules extends AlgocliScript {
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
   * get all rules from index
   */
  async getAllRules(index) {
    let rules = [];
    return await index
      .browseRules({
        batch: (batch) => {
          rules = rules.concat(batch);
        },
      })
      .then(() => {
        return rules;
      });
  }

    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {
        if (!this.options.dest) {
            throw new Error('Missing -o "dest:index" option');
        }

        await this.confirm(`Are you sure you want to copy rules from ${this.indexName} to ${this.options.dest}?`);

        const destIndex = this.client.initIndex(this.options.dest);
        const rules = await this.getAllRules(this.index);
        await destIndex.saveRules(rules, { forwardToReplicas: false });   
    }
}