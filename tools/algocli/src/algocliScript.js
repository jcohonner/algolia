const { algoliasearch } = require("algoliasearch");
const keychain = require("keychain");
const aa = require("search-insights");
const prompts = require("prompts");
const path = require("path");

module.exports = class AlgocliScript {
  /**
   * constructor
   */
  constructor(
    appid,
    apikey,
    index,
    optionString,
    defaultOptionValues,
    optionfilePath
  ) {
    this.client = algoliasearch(appid, apikey);
    this.indexName = index;
    this.appid = appid;
    this.apikey = apikey;

    this.options = this.parseOptions(optionString, defaultOptionValues || {});

    if (optionfilePath) {
      this.options = {
        ...this.options,
        ...require(path.resolve(optionfilePath)),
      };
    }

    this.aa = aa;
  }

  /**
   * add here your default options values
   * it will be used when you use the command without options
   */
  parseOptions(optionString, defaultOptionValues) {
    let options = { ...defaultOptionValues };

    if (optionString) {
      optionString.split(",").forEach((option) => {
        const [key, value] = option.split(":");
        if (value === "true") {
          options[key] = true;
        } else if (value === "false") {
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
  static async getApiKey(appID, keyType) {
    const promise = new Promise((resolve, reject) => {
      keychain.getPassword(
        {
          account: `${keyType}`,
          service: `ALGOCLI_${appID}`,
        },
        function (err, pass) {
          if (err) {
            reject(err);
          } else {
            resolve(pass);
          }
        }
      );
    });
    return promise;
  }

  /**
   * proper console.log Json
   */
  logJson(json) {
    console.log(JSON.stringify(json, null, 2));
  }

  /**
   * run function (mandatory)
   */
  async run() {
    console.log(
      "running {{className}}",
      "options =",
      this.options,
      "index =",
      this.index
    );
  }

  /**
   * ask for confirmation using prompts
   * @param {*} message
   */
  async confirm(message) {
    const response = await prompts({
      type: "confirm",
      name: "value",
      message: message,
      initial: false,
    });

    if (!response.value) {
      process.exit(0);
    }
    return response.value;
  }

  async promptForText(message) {
    const response = await prompts({
      type: "text",
      name: "value",
      message: message,
    });

    return response.value;
  }

  async getListOfIndicesByRegexp() {
    const indexNameRegexp = await this.promptForText("index name or regexp?");
    if (!indexNameRegexp) {
      console.log("No index name or regexp provided");
      return [];
    }

    // get all indices
    const indices = await this.client.listIndices();

    // filter indices
    return indices.items
      .filter((i) => i.name.match(indexNameRegexp))
      .map((i) => i.name);
  }
};
