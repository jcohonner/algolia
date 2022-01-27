#!/usr/bin/env node
const { program, Option  } = require('commander');
const algoliasearch = require('algoliasearch');
const path = require("path");

program.version('0.0.1');

program
  .command('create <className>')
  .description('create a module based on template in the current folder')
  .action((className,options) => {
      
    const generator = require('./src/generator');
    const g = new generator(className);
    g.generate();
  });

program
    .command('run <script>')
    .description('initialize Algolia client and run the script')
    .addOption(new Option('-a, --appid <appid>', 'Algolia APP ID').env('ALGOLIA_APPID'))    
    .addOption(new Option('-k, --apikey <api-key>', 'Algolia API Key').env('ALGOLIA_ADMIN_APIKEY'))
    .option("-i, --index <index>", "index name")
    .option("-o, --options <options>", "comma separated list of key:value options to pass to the script")
    .action((script, options) => {
        const commandClass = require(path.resolve(script));
        const command = new commandClass(algoliasearch(options.appid, options.apikey), options.options, options.index);
        command.setAPIKey(options.apikey);
        command.setAPPID(options.appid);
        command.run();
    });



program.parse(process.argv);