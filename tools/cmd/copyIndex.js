const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class copyindex extends AlgocliScript {
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
     */
    async run() {
               //get regexp for index name
                
        const indexNameRegexp = await this.promptForText("index name or regexp?");
        if (!indexNameRegexp) {
            console.log("No index name or regexp provided");
            return;
        }

        
        
        // get all indices
        const indices = await this.client.listIndices();
        
        // filter indices
        const filteredIndices = indices.items.filter(i => i.name.match(indexNameRegexp));

        // display indices
        console.log("About to dump the following indices:");
        filteredIndices.forEach(element => {
            console.log(element.name);
        });


        await this.confirm(`Confirm dump?`);

        // dump indices to files
        for (const indexInfo of filteredIndices) {
            const indexName = indexInfo.name;
            const indexFile = `./output/${indexName}.json`;
            console.log(`Dumping ${indexName} to ${indexFile}`);
            
            const hits = [];
            await this.client.browseObjects({
                indexName,
                aggregator: (response) => {
                    hits.push(...response.hits);
                },
            });
            require('fs').writeFileSync(indexFile, JSON.stringify(hits, null, 2));
        };
    }
}