module.exports = class AlgocliScript {
    /**
     * constructor
     */
    constructor(algoliaClient, index, defaultOptionValues, optionString) {
        this.client = algoliaClient;
        this.index = index ? this.client.initIndex(index):null;
        this.defaultOptionValues = defaultOptionValues;
        this.options = this.parseOptions(optionString);
    }



    /**
     * add here your default options values
     * it will be used when you use the command without options
     */
    parseOptions(optionString) {
        let options = this.defaultOptionValues;

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

        return options;
    }

    /**
     * run function (mandatory)
     */
    async run() {
        console.log('running {{className}}', 'options =', this.options, 'index =', this.index);
    }
}