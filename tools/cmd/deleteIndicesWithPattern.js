const AlgocliScript = require.main.require("./src/algocliScript");
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

  /**
   * run function (mandatory)
   * available variables:
   * - this.options: contains your command options
   * - this.client: Algolia client instance
   */
  async run() {
    if (this.options.pattern === undefined) {
      console.error('pattern option is required like -o "pattern:^staging_.*"');
      process.exit(1);
    }

    const indices = await this.client.listIndices();
    const indicesToDelete = indices.items
      .filter((index) => index.name.match(new RegExp(this.options.pattern)))
      .map((index) => index.name);

    console.log("Indices to delete:", indicesToDelete);
    if (indicesToDelete.length === 0) return;

    await this.confirm(
      `Are you sure you want to DELETE ${indicesToDelete.length} indices matching /${this.options.pattern}/ from app ${this.options.appid || this.appid} (this cannot be undone)?`
    );

    console.log("Deleting indices...");
    for (const indexName of indicesToDelete) {
      try {
        await this.client.deleteIndex({ indexName });
        console.log(`Deleted ${indexName}`);
      } catch (error) {
        console.error(`Error deleting index ${indexName}:`, error);
      }
    }
  }
};
