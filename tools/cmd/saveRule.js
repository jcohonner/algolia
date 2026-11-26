const AlgocliScript = require.main.require('./src/algocliScript');

module.exports = class saveObject extends AlgocliScript {
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
     * run function (mandatory)
     * available variables:
     * - this.options: contains your command options
     * - this.client: Algolia client instance
     */
    async run() {
    const rule = {
      objectID: "magento-category-1",
      conditions: [
        {
          pattern: "",
          anchoring: "is",
          context: "category-1",
        },
      ],
      consequence: {
        filterPromotes: true,
      },
      description: "Catégorie Vêtements > Homme > T-shirts",
      enabled: true,
      tags: ["visual-editor"],
    };

    await this.confirm(
      `Are you sure you want to SAVE rule "${rule.objectID}" in index ${this.indexName}?`
    );
    try {
      const { taskID } = await this.client.saveRule({
        indexName: this.indexName,
        objectID: rule.objectID,
        rule,
      });
      console.log(`taskID = ${taskID}`);
    } catch (err) {
      console.log(err);
    }
  }
};
