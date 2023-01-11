const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class appSize extends AlgocliScript {
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
        this.client.listIndices().then(({ items }) => {
            console.log(items.length);
            const size = items.reduce((acc, index) => {
                return acc + index.fileSize;
            }, 0);

            console.log(this.options.appid+','+ Math.round(size/1024/1024/1024),',',Math.round(size/1000/1000/1000));

        });
    }
}