const AlgocliScript = require.main.require('./src/algocliScript');
const fs = require('fs');

module.exports = class pushSettings extends AlgocliScript {
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
    //read settings file
    if (!this.options.file) {
      throw new Error('You must specify a filepath -o file:<filepath>');
    }

    try {
      const indexSettings = JSON.parse(fs.readFileSync(this.options.file, 'utf8'));
      await this.confirm(
        `Are you sure you want to APPLY SETTINGS from ${this.options.file} (${Object.keys(indexSettings).length} keys) to index ${this.indexName}?`
      );
      await this.client.setSettings({ indexName: this.indexName, indexSettings });
      console.log('Settings pushed');
    } catch (e) {
      console.error(e);
    }
  }
};
