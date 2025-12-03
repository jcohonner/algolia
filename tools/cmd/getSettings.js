const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class getSettings extends AlgocliScript {
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
        console.log('running getSettings', 'options =', this.options, 'index =', this.index);
           
        const settings = await this.index.getSettings()

        //print the settings full object
        console.log('settings =', settings);
    }
}