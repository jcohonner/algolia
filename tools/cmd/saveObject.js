const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class saveObject extends AlgocliScript {
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
        //console.log('running saveObject', 'options =', this.options, 'index =', this.index);



        this.index.saveObject({objectID: '00000300', name: 'myName'}).then(({ taskID }) => {
            console.log(`taskID = ${taskID}`);
        });
    }
}