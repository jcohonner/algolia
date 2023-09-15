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
        const startDate = new Date('19 June 2023 00:00 UTC').toISOString();
        const endDate = new Date().toISOString();


        //const url = `https://usage.algolia.com/1/usage/search_operations,total_search_operations,total_search_requests?startDate=${startDate}&endDate=${endDate}`;
        const url = `https://usage.algolia.com/1/usage/file_size,records?startDate=${startDate}&endDate=${endDate}`;
        //const url = `https://usage.algolia.com/1/usage/records?startDate=${startDate}&endDate=${endDate}`;
        //const url = 'https://usage.algolia.com/1/agg_usage/api_clients/since/30/days';
        fetch(url, {
            method: 'GET',
            headers: {
                'X-Algolia-Application-Id': this.options.appid,
                'X-Algolia-API-Key': this.options.apikey
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            const sizeGB = Math.round(data.file_size[0].v/1000/1000/1000);            
            console.log([this.options.appid,this.options.name,sizeGB,data.records[0].v].join(','));

        
        }).catch(err => {
            console.log(err);
        })
    }
}