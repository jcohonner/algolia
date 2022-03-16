#!/usr/bin/env node
const { program, Option  } = require('commander');
const TMDBMovieExport = require('./src/TMDBMovieExport');
const TMDBPeopleExport = require('./src/TMDBPeopleExport');

program.version('0.1.0');


program
  .command('movies')
  .description('export movies from the Movie Database')
  .addOption(new Option('-k, --api-key <api-key>', 'TMDB API key').env('TMDB_API_KEY'))    
  .option('-l, --languages <languages...>', 'list of language codes', ['en-US']) 
  .option('-m, --max-pages <max>', 'max pages to fetch (up to 500)', 10)
  .option('-o, --output-folder <path>', 'output folder', './output/')
  .option('-p, --price <path>', 'JSON file with an array of prices', false)    
  .option('-f, --featured <path>', 'JSON file with an array of movie IDs to mark as featured', false)
  .option('-i, --movie-list <path>','JSON file with an array of movie IDs to export', false)
  .option('-e, --exclusion-list <path>','JSON file with an array of movie IDs to exclude', false)
  .action((options) => {
    const tmbExport = new TMDBMovieExport(options);
    tmbExport.run();
  });


  program
  .command('people')
  .description('export actors and directors from the Movie Database')
  .addOption(new Option('-k, --api-key <api-key>', 'TMDB API key').env('TMDB_API_KEY'))    
  .option('-l, --languages <languages...>', 'list of language codes', ['en-US']) 
  .option('-m, --max-pages <max>', 'max pages to fetch (up to 500)', 10)
  .option('-o, --output-folder <path>', 'output folder', './output/')
  .option('-e, --exclusion-list <path>','JSON file with an array of movie IDs to exclude', false)
  .action((options) => {
    const tmbExport = new TMDBPeopleExport(options);
    tmbExport.run();
  });



program.parse(process.argv);