const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class renameIndex extends AlgocliScript {
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
        this.client.moveIndex(this.index.name, this.options.newName).then(() => console.log('Index renamed')).catch(err => {console.log(err)});
    }
}