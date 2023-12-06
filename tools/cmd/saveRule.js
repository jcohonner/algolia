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

        const rule = {
            "objectID": "magento-category-1",
            "condition": {
                "pattern": "",
                "anchoring": "is",
                "context": "category-1",
            },
            "consequence": {
                "filterPromotes": true
            },
            "description": "Catégorie Vêtements > Homme > T-shirts",
            "enabled": true,
            "tags": [
                "visual-editor"
            ],
        };


        this.index.saveRule(rule).then(({ taskID }) => {
            console.log(`taskID = ${taskID}`);
        }).catch(err => {
            console.log(err);
        });
    }
}