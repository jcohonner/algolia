const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class renameIndex extends AlgocliScript {
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
    if (!this.options.newName) {
      throw new Error('You must specify a new name -o newName:<name>');
    }

    await this.confirm(
      `Are you sure you want to RENAME (move) index ${this.indexName} to ${this.options.newName}? The destination index will be overwritten and the source removed.`
    );
    try {
      await this.client.operationIndex({
        indexName: this.indexName,
        operationIndexParams: {
          operation: 'move',
          destination: this.options.newName,
        },
      });
      console.log('Index renamed');
    } catch (err) {
      console.log(err);
    }
  }
};
