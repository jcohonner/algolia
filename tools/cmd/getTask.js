const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class getTask extends AlgocliScript {
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
        const path = `/1/indexes/${this.index.indexName}/task/${this.options.taskID}`;
        try{
            let task = await this.client.customRequest({method:'GET', path});
            console.log({path,task});
        } catch (error) {
            console.log({path,error});
        }
    }
}