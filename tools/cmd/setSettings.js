const AlgocliScript = require.main.require("./src/algocliScript");

module.exports = class setSettings extends AlgocliScript {
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
    const settings = {
      "neural-sku-fr-fr": {
        mode: "neuralSearch",
        semanticSearch: {
          _internal: {
            attributes: {
              detailedDescription: 0.21088274533779686,
              productDisplayName: 0.47043800260374713,
              "pdFunction.displayName": 0.5,
            },
            vectorModelId: "universal-sentence-encoder",
          },
        },
      },
      "neural-sku-en-gb": {
        mode: "neuralSearch",
        semanticSearch: {
          _internal: {
            attributes: {
              detailedDescription: 0.22675595067163212,
              displayName: 0.5457907215982336,
              shortDescription: 0.4918235596885137,
              "pdFunction.displayName": 0.5,
            },
            vectorModelId: "universal-sentence-encoder",
          },
        },
      },
      "neural-sku-ja-jp": {
        mode: "neuralSearch",
        semanticSearch: {
          _internal: {
            attributes: {
              displayName: 0.4,
              "pdFunction.displayName": 0.5,
              shortDescription: 0.2,
            },
            vectorModelId:
              "paraphrase-multilingual-MiniLM-L12-v2:20230622_finetuned_onnx",
          },
        },
      },
    };

    console.log(this.options);
    if (!settings[this.options.indexName]) {
      console.log("No settings found for this index");
      return;
    }

    this.index
      .setSettings(settings[this.options.indexName])
      .then(() => {
        console.log("Settings updated");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
