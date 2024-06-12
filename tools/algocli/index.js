#!/usr/bin/env node
const { program, Option  } = require('commander');
const path = require("path");
const keychain = require('keychain');


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
    .option("-i, --index <index>", "index name")
    .option("-o, --options <options>", "comma separated list of key:value options to pass to the script")
    .option("-f, --file <filepath>", "path to an option json file")
    .action((script, options) => {
        const commandClass = require(path.resolve(script));
        const keyType = commandClass.keyType || 'admin';

        commandClass.getApiKey(options.appid,keyType).then(apiKey => {
          try { 
            const command = new commandClass(options.appid, apiKey, options.index, options.options, options.file);
            command.run();
          } catch (e) {
            console.log(e);
          }
        }).catch(err => {
            console.log(`No ${keyType} key found for ${options.appid}`);
        });
    });

program
    .command('addkey <appID> <keyType> <apiKey>')
    .description('Add API Key for APPID to keychain') 
    .action((appID,keyType,apiKey) => {

        if (keyType !== 'admin' && keyType !== 'search' && keyType !== 'usage' && keyType !== 'monitoring') {
            console.log("keyType must be admin, search, usage or monitoring");
            return;
        }

        keychain.setPassword({
            account: `${keyType}`,
            service: `ALGOCLI_${appID}`,
            password: apiKey,
        }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Key added");
            }
        });
    });

program
    .command('getkey <appID> <keyType>')
    .description('Get API Key for APPID and type from keychain') 
    .action((appID,keyType) => {

        if (keyType !== 'admin' && keyType !== 'search' && keyType !== 'usage' && keyType !== 'monitoring') {
            console.log("keyType must be admin, search, usage or monitoring");
            return;
        }

        const scriptClass = require(`./src/algocliScript`);

        scriptClass.getApiKey(appID,keyType).then(apiKey => {
            console.log(`${appID} key for ${keyType} is ${apiKey}`);
        }).catch(err => {
            console.log(`No ${keyType} key found for ${options.appid}`);
        });
    });

program.parse(process.argv);