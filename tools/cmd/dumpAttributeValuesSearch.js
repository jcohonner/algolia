const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class dumpAttributeValuesSearch extends AlgocliScript {
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
        

        this.index.search('bruce willis',{
            hitsPerPage:500,
            attributesToRetrieve:[this.options.attribute],
        }).then(function ({hits}) {
            hits.forEach(hit => {
                console.log(hit[this.options.attribute]);
            });
        }.bind(this)).catch(e => { console.log(e) });
    }
}