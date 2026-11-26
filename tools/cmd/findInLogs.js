const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class findInLogs extends AlgocliScript {
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
    const result = await this.client.getLogs({ length: 100 });
    const matched = result.logs.filter((log) =>
      log.query_params ? log.query_params.indexOf('q') !== -1 : false
    );
    console.log(JSON.stringify(matched, null, 2));
  }
};
