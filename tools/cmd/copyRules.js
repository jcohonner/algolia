const { exit } = require("process");

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

        let destIndexName = this.options.dest;
        const clearExistingRules = this.options.clear || false;

        if (!destIndexName) {
            destIndexName = await this.promptForText("destination index?");
            if (!destIndexName) exit(0);
        }

        if (clearExistingRules) {
          await this.confirm(`Are you sure you want to REPLACE rules in ${destIndexName} by those in ${this.indexName}?`);
        } else {
          await this.confirm(`Are you sure you want to COPY rules from ${this.indexName} to ${destIndexName}?`);
        }


        const destIndex = this.client.initIndex(this.options.destIndexName);
        const rules = await this.getAllRules(this.index);
        console.log(rules);
        try {
          console.log(`Copying ${rules.length} rules from ${this.indexName} to ${destIndexName}`);
          const response = await  destIndex.saveRules(rules,);   
          console.log(response);
        } catch (e) { 
          console.error(`Error setting settings on destination index: ${e.message}`);
          exit(1);            
        }
    }
}