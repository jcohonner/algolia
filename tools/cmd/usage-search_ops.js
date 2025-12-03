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

        
        const startDate = new Date("5/1/2024").toISOString();
        const endDate = new Date().toISOString();


        const url = `https://usage.algolia.com/1/usage/total_search_requests,querysuggestions_total_search_requests?startDate=${startDate}&endDate=${endDate}&granularity=daily`;
        fetch(url, {
            method: 'GET',
            headers: {
                'X-Algolia-Application-Id': this.appid,
                'X-Algolia-API-Key': this.apikey
            }
        }).then(response => {
            return response.json();
        }).then(data => {

            const billed_search_requests_per_day = {}

            data.total_search_requests.map(item => {
                const date = new Date(item.t);
                billed_search_requests_per_day[`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`] = item.v;
            } );

            //substract the querysuggestions_total_search_requests from the total_search_requests
            data.querysuggestions_total_search_requests.map(item => {
                const date = new Date(item.t);
                billed_search_requests_per_day[`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`] -= item.v;
            });

            //output for CSV
            console.log('Date,Search Requests');
            for (const [key, value] of Object.entries(billed_search_requests_per_day)) {
                console.log(`${key},${value}`);
            }

        }).catch(err => {
            console.log(err);
        })
    }
}