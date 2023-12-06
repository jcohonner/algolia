const algoliasearch = require('algoliasearch');
const keychain = require('keychain');
const aa = require('search-insights');

module.exports = class AlgocliScript {
    /**
     * constructor
     */
    constructor(appid, apikey, index, optionString, defaultOptionValues) {
        this.client = algoliasearch(appid,apikey);
        this.index = index ? this.client.initIndex(index):null;
        this.defaultOptionValues = {indexName:index, appid, apikey, ...defaultOptionValues};
        this.options = this.parseOptions(optionString);
        this.aa = aa;
    }

    /**
     * add here your default options values
     * it will be used when you use the command without options
     */
    parseOptions(optionString) {
        let options = this.defaultOptionValues;

        if (optionString) {
            optionString.split(',').forEach(option =>  {
            const [key, value] = option.split(':');
            if (value==='true') {
                options[key] = true;
            } else if (value==='false') {
                options[key] = false;
            } else {
                options[key] = parseFloat(value) || value;
            }
            });
        }

        return options;
    }

    /**
     * returns the required key from MacOS keychain
     * @todo fallback on admin key if no usage or search key is found
     */
    static async getApiKey(appID,keyType) {
        const promise = new Promise((resolve, reject) => {
            keychain.getPassword({
                account: `${keyType}`,
                service: `ALGOCLI_${appID}`,
            }, function(err,pass) {
                if (err) {
                    reject(err);
                } else {
                    resolve(pass);
                }
            });
        });
        return promise;
    }

    /**
     * run function (mandatory)
     */
    async run() {
        console.log('running {{className}}', 'options =', this.options, 'index =', this.index);
    }
}