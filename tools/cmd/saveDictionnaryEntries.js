const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class saveDictionnaryEntries extends AlgocliScript {
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
    const language = 'en';
    const words = ['tshirt', 'tshirts', 't shirt', 't shirts', 't-shirt', 't-shirts'];

    await this.confirm(
      `Are you sure you want to ADD the plurals dictionary entry "${objectID}" (${language}) on app ${this.appid}?`
    );
    try {
      const res = await this.client.batchDictionaryEntries({
        dictionaryName: 'plurals',
        batchDictionaryEntriesParams: {
          requests: [{ action: 'addEntry', body: { objectID, language, words } }],
        },
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
};
