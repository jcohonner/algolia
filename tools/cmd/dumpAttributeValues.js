const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class dumpAttributeValues extends AlgocliScript {
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
        this.index.browseObjects({
            query:'',
            attributesToRetrieve:[this.options.attribute],
            batch: hits => {
                hits.forEach(hit => {
                    console.log(hit[this.options.attribute]);
                });
            }
        });
    }
}