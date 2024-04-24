const AlgocliScript = require.main.require("./src/algocliScript");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

module.exports = class deleteIndicesWithPattern extends AlgocliScript {
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

  askQuestion(query) {
    return new Promise((resolve) =>
      readline.question(query, (ans) => {
        readline.close();
        resolve(ans);
      })
    );
  }

  /**
   * run function (mandatory)
   * available variables:
   * - this.options: contains your command options
   * - this.client: Algolia client instance
   * - this.index: Algolia Index instance
   */
  async run() {
    if (this.options.pattern === undefined) {
      console.error('pattern option is required like -o "pattern:^staging_.*"');
      process.exit(1);
    }

    const indices = await this.client.listIndices();
    const indicesToDelete = indices.items
      .filter((index) =>
        index.name.match(new RegExp(this.options.pattern, "g"))
      )
      .map((index) => index.name);

    console.log("Indices to detele:", indicesToDelete);

    this.askQuestion(
      `You are about to delete ${indicesToDelete.length} indices from ${this.options.appid}. Are you sure you want to proceed? (yes/no): `
    ).then((answer) => {
      if (answer.toLowerCase() === "yes") {
        console.log("Deleting indices...");
        // Continue your program here

        indicesToDelete.forEach((indexName) => {
          try {
            const index = this.client.initIndex(indexName);
            index.delete();
          } catch (error) {
            console.erlogror(`Error deleting index ${indexName}:`, error);
          }
        });
      } else {
        console.error("canceled by user");
        process.exit(0);
      }
    });
  }
};
