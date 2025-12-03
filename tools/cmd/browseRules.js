const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class browseRules extends AlgocliScript {
    /**
     * constructor
     */
    constructor(appid, apikey, index, optionString) {
        // add here your default options valuesTFBD3C48AO
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
        const logOutput = [];
        const rules=[];

        
        this.index.browseRules({
            batch: batch => rules.push(...batch.filter(rule => 
                 rule.conditions?.some( condition => (condition.context && condition.context.startsWith('rayon'))) 
                 && rule.consequence?.params?.filters  
                 && rule.consequence.params.filters.includes('product.')))
          }).then(() => {
            // done


            logOutput.push('objectID,rayon,description,condition,consequence');
            const regexp = /"\/g,"\\""/g;


            rules.forEach(rule => {
                logOutput.push(`${rule.objectID},${rule.conditions?.filter(condition => condition.context?.startsWith('rayon')).map(condition => condition.context).join(" ")},${rule.description},"${rule.consequence.params.filters.replace( /"/g, '')}"`);
            });


            // save new rules to file
            const fs = require('fs');
            fs.writeFileSync(`output/${this.indexName}-rules-products.csv`, logOutput.join('\n'));
        });
    }
}