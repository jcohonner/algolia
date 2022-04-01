const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class dumpIndexList extends AlgocliScript {
    /**
     * constructor
     */
    constructor(algoliaClient, optionString, index) {
        // add here your default options values
        // it will be used when you use the command without options
        let defaultOptionValues = {};
        super(algoliaClient,index,defaultOptionValues,optionString);
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {
        //console.log('running dumpIndexList', 'options =', this.options, 'index =', this.index);

        this.client.listIndices().then(function(result) {
            //write list to csv file
            const fs = require('fs');
            
            
            const csv = result.items.map(function(item) {
                return `"${item.name}","${item.createdAt}","${item.updatedAt}",${item.entries},${item.dataSize},${item.fileSize},${item.lastBuildTimeS},${item.numberOfPendingTasks},${item.pendingTask},"${item.primary||''}","${item.replicas?item.replicas.join(','):''}"`;
            }).join('\n');
            
            const header = `"name","createdAt","updatedAt","entries","dataSize","fileSize","lastBuildTimeS","numberOfPendingTasks","pendingTask","primary","replicas"\n`;
            fs.writeFileSync('indices.csv', header+csv);


        });


        
    }
}