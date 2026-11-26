const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class saveSynonym extends AlgocliScript {
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
    const objectID = 'tshirt';
    const synonyms = ['tshirt', 'tshirts', 't shirt', 't shirts'];

    await this.confirm(
      `Are you sure you want to SAVE synonym "${objectID}" in index ${this.indexName}?`
    );
    try {
      const res = await this.client.saveSynonym({
        indexName: this.indexName,
        objectID,
        synonymHit: { objectID, type: 'synonym', synonyms },
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
};
