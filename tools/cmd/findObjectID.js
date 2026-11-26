const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class findObjectID extends AlgocliScript {
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
    //Looking for product_1200272
    //product_374491
    const searchForObjectID = 'MUPRD0002038';
    const query = 'bakery';

    const searchParams = {
      query,
      hitsPerPage: 500,
      page: 0,
      filters: '',
      distinct: false,
      attributesToRetrieve: ['objectID'],
    };

    let result = {};
    do {
      console.log('page: ' + searchParams.page);
      result = await this.client.searchSingleIndex({
        indexName: this.indexName,
        searchParams,
      });
      if (searchParams.page === 0) {
        console.log('total hits: ' + result.nbHits);
        console.log('total pages: ' + result.nbPages);
      }

      const found = result.hits.findIndex((hit) => hit.objectID === searchForObjectID);
      if (found >= 0) {
        console.log('found: ' + searchForObjectID + ' at position: ' + (searchParams.page * 500 + found + 1));
        return;
      }
      searchParams.page++;
    } while (searchParams.page < result.nbPages);

    console.log('Object ID not found');
  }
};
