const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class sendRequests extends AlgocliScript {
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
    try {
      for (let i = 0; i < this.options.nbRequests; i++) {
        const result = await this.client.searchSingleIndex({
          indexName: this.indexName,
          searchParams: {
            query: '',
            hitsPerPage: 1,
            attributesToRetrieve: ['*', '-taxIncluded', 'taxIncluded.AL'],
            attributesToHighlight: [],
          },
        });
        console.log(result.hits[0]);
      }
    } catch (e) {
      console.log('error', e);
    }
  }
};
