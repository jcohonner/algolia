const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class saveObject extends AlgocliScript {
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
    const body = { objectID: '00000300', name: 'myName' };

    await this.confirm(
      `Are you sure you want to SAVE record ${body.objectID} in index ${this.indexName}?`
    );
    const { taskID } = await this.client.saveObject({ indexName: this.indexName, body });
    console.log(`taskID = ${taskID}`);
  }
};
