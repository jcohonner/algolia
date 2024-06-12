const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class listIndices extends AlgocliScript {
    /**
     * constructor
     */
    constructor(appid, apikey, index, optionString, optionfilePath) {
        // add here your default options values
        // it will be used when you use the command without options
        let defaultOptionValues = {};
        super(appid, apikey, index, optionString, defaultOptionValues, optionfilePath);
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {
        try {
            this.client.listIndices().then(({ items }) => {
               
               console.log(["index", "entries", "dataSize", "fileSize", "primary", "createdAt", "updatedAt"].join(","));
               items.forEach(element => {
                    console.log([element.name, element.entries, element.dataSize, element.fileSize, element.primary||"", element.createdAt, element.updatedAt].join(','));
                });
            });
            
        } catch (error) {
         console.log(
            error
         )   
        }

        
    }
}