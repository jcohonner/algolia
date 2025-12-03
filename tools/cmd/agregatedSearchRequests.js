const AlgocliScript = require.main.require('./src/algocliScript');






module.exports = class agregatedSearchRequests extends AlgocliScript {
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



    async getSearchRequests(index,periods) {
        const yearResults = [];
        
        
        //for each period of time
        for (const period of periods) {

            //const url = `https://usage.algolia.com/1/usage/total_search_requests,querysuggestions,total_search_requests/${index}?startDate=${period.startDateISO}&endDate=${period.endDateISO}&granularity=daily`;
            //const url = `https://usage.algolia.com/1/usage/total_search_requests,querysuggestions_total_search_requests?startDate=${period.startDateISO}&endDate=${period.endDateISO}&granularity=daily`;
            const url = `https://usage.algolia.com/1/usage/total_search_operations?startDate=${period.startDateISO}&endDate=${period.endDateISO}&granularity=daily`;

            
            const results =  await fetch(url, {
                    method: 'GET',
                    headers: {
                        'X-Algolia-Application-Id': this.appid,
                        'X-Algolia-API-Key': this.apikey
                    }
                }).then(response => {
                    return response.json();
                }).then(data => {
                    
                    
                    /*const monthSR = data.total_search_requests.reduce((acc, item) => {
                        return acc + item.v;
                    },0);

                    const monthQSR = data.querysuggestions_total_search_requests.reduce((acc, item) => {
                        return acc + item.v;
                    },0);*/

                    const monthSOP = data.total_search_operations.reduce((acc, item) => {
                        return acc + item.v;
                    },0);

                    return monthSOP;

                    return monthSR-monthQSR;
                }).catch(err => {
                    console.log(err);
                })

            yearResults.push(results);
        }

        return Promise.resolve(yearResults);
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {

        const periods = [];
        const initialDate = new Date('2023-09-01 00:00 UTC').toISOString();
        for (let month = 0; month < 12; month++) {
            const startDate = new Date(new Date(initialDate).setMonth(new Date(initialDate).getMonth() + month));
            const endDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1));
            const startDateISO = startDate.toISOString();
            const endDateISO = endDate.toISOString();            
            periods.push({startDate,startDateISO,endDateISO});
        }


        //Get indices and brands
        
        /*const indices = await this.client.listIndices().then(({items}) => {
            return items.map(item => {
                const extract = item.name.match(/_(.*?)_/);                
                const brand = (extract && extract.length > 1) ?extract[1]:item.name;
                return {brand,name:item.name};
            })
        });*/


        const indices = [{brand:'all',name:''}];

        //header
        const header = ['brand','index',...periods.map(p => p.startDate.toISOString().slice(0,7))];
        console.log(header.join(','));

        //loop over indices
        for (const index of indices) {
            const indexresults = await this.getSearchRequests(index.name,periods);
            console.log(`${index.brand},${index.name},${indexresults.join(',')}`);
        }

    }
}