const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class dumpAttributeValuesSearch extends AlgocliScript {
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
        return "search";
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {
        
        const queries = [''];
        const params = {
            hitsPerPage:500,
            attributesToRetrieve:["BrandNameEn","BrandNameAr"],
            filters: "",
            enableRules: true,
            distinct:true,
            //insideBoundingBox: [25.417204, 51.323518,25.117815, 51.746619]
        };

        
        for (const query of queries) {
             //first call results
            const referenceResults = await this.index.search(query,params).then(function ({hits}) {                
                return hits.map(hit => { return {BrandNameEn: hit.BrandNameEn, BrandNameAr: hit.BrandNameAr} });
            }).catch(e => { console.log(e) });


            //write to json file
            const fs = require('fs');
            fs.writeFileSync('output/snoonu-brandNames.json', JSON.stringify(referenceResults));

           /* for (let i = 0; i < 20; i++) {
                await this.index.search(query,params).then(function ({hits}) {
                    const nbValidHits = hits.filter(hit => referenceResults.indexOf(hit.objectID) !== -1).length;
                    console.log(`Iteration ${i} - ${nbValidHits} found in the ${referenceResults.length} reference results`);
                }.bind(this)).catch(e => { console.log(e) });
            }*/
        }



    }
}