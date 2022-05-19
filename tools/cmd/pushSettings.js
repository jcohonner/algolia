const AlgocliScript = require.main.require('./src/algocliScript');
const fs = require('fs');

module.exports = class pushSettings extends AlgocliScript {
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
        //read sesstings files
        if (!this.options.file) {
            throw new Error('You must specify a filepath -o file:<filepath>');
        }
        try {
            const settingFileData = fs.readFileSync(this.options.file, 'utf8');
            const settings = JSON.parse(settingFileData);
            this.index.setSettings(settings).then(() => console.log('Settings pushed')).catch(err => {console.log(err)});
            
        } catch (e) {
            console.error(e);
        }
    }
}