const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class usage extends AlgocliScript {
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
        return "monitoring";
    }

    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {

        const url = `https://status.algolia.com/1/infrastructure/avg_build_time/period/year?X-Algolia-API-Key=${this.options.apikey}&X-Algolia-Application-Id=${this.options.appid}`;
        fetch(url, {
            method: 'GET'
        }).then(response => {
            return response.json();
        }).then(data => {
            data.metrics.avg_build_time['d19-in-1'].forEach(element => {
                const date = new Date(element.t);
                console.log(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()},${element.v}`);
            });
        
        }).catch(err => {
            console.log(err);
        })
    }
}