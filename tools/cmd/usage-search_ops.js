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
        return "usage";
    }

    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {

        //From 7 days ago to now
        const startDate = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();
        const endDate = new Date().toISOString();


        const url = `https://usage.algolia.com/1/usage/search_operations,total_search_operations,total_search_requests?startDate=${startDate}&endDate=${endDate}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'X-Algolia-Application-Id': this.options.appid,
                'X-Algolia-API-Key': this.options.apikey
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            data.total_search_requests.map(item => {
               const date = new Date(item.t);
               console.log(`${this.options.appid} - ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} : ${item.v}`);
            } )
        }).catch(err => {
            console.log(err);
        })
    }
}