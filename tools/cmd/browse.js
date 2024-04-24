const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class browse extends AlgocliScript {
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
     * returns the required key type (admin|search|usage) for this command
     */
    static get keyType() {
        return "admin";
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {
        const params= {
            filters: 'genres:Action',
        }
        let hits=[];

        this.index.browseObjects({
            ...params,
            batch: batch => {
                hits = hits.concat(batch);
            }
        }).then(() => {
            hits.slice(0,20).forEach(hit => {
                console.log(hit.objectID+' : '+hit.title);
            });
        });
    }
}