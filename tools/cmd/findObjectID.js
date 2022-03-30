const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class findObjectID extends AlgocliScript {
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
        //Looking for product_1200272
        //product_374491
        const searchForObjectID = 'MUPRD0002038';

        const query= 'bakery';
        let parameters = {
            hitsPerPage: 500,
            page:0,
            filters: '',
            distinct:false,
            attributesToRetrieve:['objectID']
        };
        let result = {};

        do {
            console.log('page: ' + parameters.page);

            result =  await this.index.search(query,parameters);

            if (parameters.page === 0) {
                console.log('total hits: ' + result.nbHits);
                console.log('total pages: ' + result.nbPages);
            }

            const found = result.hits.findIndex(hit => hit.objectID === searchForObjectID);
            if (found>=0) {
                console.log('found: ' + searchForObjectID + ' at position: ' + (parameters.page*500+found+1));
                return;
            }
            parameters.page++;
        } while (parameters.page <= result.nbPages);

        console.log('Object ID not found');
    }
}
