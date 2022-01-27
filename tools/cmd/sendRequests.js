const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class sendRequests extends AlgocliScript {
    /**
     * constructor
     */
    constructor(algoliaClient, optionString, index) {
        // add here your default options values
        // it will be used when you use the command without options
        let defaultOptionValues = { nbRequests : 1};
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
        //console.log('running sendRequests', 'options =', this.options, 'index =', this.index);
        try {
            for (var i=0; i<this.options.nbRequests; i++) {
                var result = await this.index.search('',{hitsPerPage:1, attributesToRetrieve:['*','-taxIncluded.AL'], attributesToHighlight:[]});
                console.log(result.hits[0]);
            }
        } catch (e) {
            console.log('error', e);
        }
    }
}