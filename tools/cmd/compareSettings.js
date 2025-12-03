const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class compareSettings extends AlgocliScript {
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



    async getSettings(index) {
        const indexInstance = this.client.initIndex(index);
        return indexInstance.getSettings().then(settings => {
            
            return {index, settings};
        })
    }

    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {

        const indices = await this.getListOfIndicesByRegexp();
        if (indices.length === 0) {
            console.log('No indices found matching the provided regexp');
            return;
        }


        // init promise array
        const promises = [];
        const settings = {};


        // get settings for each index using promises
        for (const index of indices) {
            promises.push(this.getSettings(index));
        }
        // wait for all promises to resolve
        const results = await Promise.all(promises);
        // merge results into settings object
        for (const result of results) {
            settings[result.index] = result.settings;
        }


        // compare settings
        // first get merge all settings keys to get a list of all keys with the maximum number of values if arrays
        const allKeys = new Map();
        for (const index in settings) {
            const keys = Object.keys(settings[index]);
            for (const key of keys) {
                // if the key is not in the map, add it with the length of the value as value
                if (!allKeys.has(key)) {
                    allKeys.set(key, false);
                }

                // if the value is an array, add the length of the array to the map
                if (Array.isArray(settings[index][key])) {
                    allKeys.set(key, Math.max(allKeys.get(key), settings[index][key].length));
                } 
            }
        }


        // header for the output, one column for each index
        const header = ['"Settings Key"'];
        for (const index in settings) {
            header.push(`"${index}"`);
        }

        // now iterate over all keys and build one line for each key
        const output = [header];
        for (const key of allKeys.keys()) {
            const isArray = allKeys.get(key) !== false;

            if (isArray) {
                output.push([`"== ${key} =="`]);                
            }


            for (let i = 0; i < (isArray?allKeys.get(key):1); i++) {
                const line = [isArray?'':key];
                
                for (const index in settings) {
                    if (settings[index][key] !== undefined) {
                        if (isArray) {
                            // if the value is an array, join it with a comma
                            line.push(settings[index][key][i] !== undefined ? `"${settings[index][key][i]}"` : '');
                        } else {
                            // otherwise just add the value
                            line.push(`"${settings[index][key]}"`);
                        }
                    } else {
                        // if the key is not present in the index, add an empty string
                        line.push('');
                    }
                }

                output.push(line);
            }
            
        }

        
        // write to file
        if (this.options.outputFile) {
            const fs = require('fs');
            const outputFile = this.options.outputFile;
            const outputString = output.map(line => line.join(',')).join('\n');
            fs.writeFileSync(outputFile, outputString);
            console.log(`Output written to ${outputFile}`);
        }

    }
}