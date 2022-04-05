const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class findInLogs extends AlgocliScript {
    /**
     * constructor
     */
    constructor(algoliaClient, optionString, index) {
        // add here your default options values
        // it will be used when you use the command without options
        let defaultOptionValues = {};
        super(algoliaClient,index,defaultOptionValues,optionString);
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {
        this.client.getLogs({length:100}).then(result => {
        
            const matched = result.logs.filter(log => {
                return log.query_params?log.query_params.indexOf('XXXX') !== -1:false;
            })

            console.log(matched);
        
        });
    }
}