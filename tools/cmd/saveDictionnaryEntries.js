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
     * - this.index: Algolia Index instance
     */
    async run() {
        const objectID = 'tshirt';
        const language = 'en';
        const words = ['tshirt', 'tshirts', 't shirt', 't shirts', 't-shirt', 't-shirts']

        this.client.saveDictionaryEntries('plurals',
            [{
                objectID,
                language,
                words
            }]
        ).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }
}