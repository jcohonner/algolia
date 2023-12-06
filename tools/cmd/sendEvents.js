const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class sendEvents extends AlgocliScript {
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
        return "admin";
    }


    /**
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     * - this.index: Algolia Index instance
     */
    async run() {
        //console.log('running sendEvents', 'options =', this.options, 'index =', this.index);
        
        const events= [
            {
                "eventType": "conversion",
                "eventName": "add_to_cart",
                "eventSubtype": "addToCart",
                "index": "products_v2",
                "objectIDs": [
                  "1722753570"
                ],
                "objectData": [
                  {
                    "queryID": "bccb0bd29b1e57566268d1ec4dc1deec",
                    "price": "70.04"
                  }
                ],
                "userToken": "165905584",
                "queryID": "bccb0bd29b1e57566268d1ec4dc1deec",
                "timestamp": 1701846401606,
                "currency": "SAR"
              }
              
        ]


        this.aa("init",{appId: this.defaultOptionValues.appid, apiKey:this.defaultOptionValues.apikey});
        this.aa("sendEvents",events);


    }
}