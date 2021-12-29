#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const cliProgress = require('cli-progress');
const fs = require('fs');
const outputFileBaseName = './output/movies';

const tmdb = require('themoviedb-api-client')(process.env.TMDB_API_KEY);
const languages = ['en-US', 'fr-FR', 'de-DE', 'it-IT', 'es-ES'];
const prices = require('./prices.json');
const includePrices = true;
const featuredMovies = require('./featured-movies.json');
const includeFeatured = true;
const maxPages = 500; //override for debug purposes API max value: 500

function getImageURL(path) {
    return `https://image.tmdb.org/t/p/w500${path}`;
}

function dateToTimestamp(date) {
    return (new Date(date).getTime())/1000;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function buildMovie(movie) {
    //Initial language
    const {body : movieDetails} = await tmdb.movieInfo({id: movie.id, language: languages[0], append_to_response: 'credits'});
    
    let movieData = {
        objectID: movieDetails.id,
        original_title: movieDetails.original_title,
        original_language: movieDetails.original_language,
        release_date: dateToTimestamp(movieDetails.release_date),
        vote_average: Math.floor(movieDetails.vote_average),
        vote_count: movieDetails.vote_count,
        popularity: movieDetails.popularity,
        year: parseInt(movieDetails.release_date?.substring(0, 4)),
        actors: movieDetails.credits?.cast?.map(a => a.name),
        backdrop: getImageURL(movieDetails.backdrop_path),
        title: {
            [languages[0]]: movieDetails.title,
        },
        overview: {
            [languages[0]]: movieDetails.overview,
        },
        genres: {
            [languages[0]]: movieDetails.genres?.map(g => g.name),
        },
        poster: {
            [languages[0]]: getImageURL(movieDetails.poster_path),
        },
        budget: movieDetails.budget,
        revenue: movieDetails.revenue
    }

    if (includePrices) {
        //10% of the time, we add an on sale price
        const priceMod = (Math.random() <= 0.1)?'sales':'standard';
        const priceData = prices[priceMod][getRandomInt(prices[priceMod].length)];
        movieData.price = priceData.price;
        movieData.original_price = priceData.original_price;
        movieData.on_sale  = priceData.on_sale;
        
    }

    if (includeFeatured) {
        movieData.featured = featuredMovies.includes(movieData.id);
    }
    

    await Promise.all(languages.slice(1).map(async (language) => {
        const {body : movieDetailLang} = await tmdb.movieInfo({id: movie.id, language: language});
        movieData.title[language] = movieDetailLang.title;
        movieData.overview[language] = movieDetailLang.overview;
        movieData.genres[language] = movieDetailLang.genres?.map(g => g.name);
        movieData.poster[language] = getImageURL(movieDetailLang.poster_path); 
    }));

    return movieData;
}



async function exportMovies() {

    //Get movie list without language (en-US per default)
    let page = 1;
    let {body: {results, total_pages} } = await tmdb.discoverMovie({page: page, include_adult:false });
    let movies = [];
    
    total_pages = Math.min(maxPages,total_pages);
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(total_pages, 0);


    while (results.length) {
        progressBar.update(page);

        movies.push(... await Promise.all(results.map(buildMovie)));

        if (page < total_pages) {
            page++;
            const response = await tmdb.discoverMovie({page: page, include_adult:false });
            results = response.body.results;
        } else {
            results = [];
        }
        
    };

    progressBar.stop();

    fs.writeFileSync(outputFileBaseName+'.json', JSON.stringify(movies,null,4) , 'utf-8');
    languageSpecificExport(movies);
    movieIDList(movies);

}

function languageSpecificExport(movies) {
    languages.forEach(language => {
        fs.writeFileSync(outputFileBaseName+'-'+language+'.json', JSON.stringify(movies.map(m => {
            const movie = {...m};
            movie.title = movie.title[language];
            movie.overview = movie.overview[language];
            movie.genres = movie.genres[language];
            movie.poster = movie.poster[language];
            return movie;
        }),null,4) , 'utf-8');
    });
}

/**
 * This list may be used to rebuild the dataset with the exact same list of movies
 * @param {*} movies 
 */
function movieIDList(movies) {
    fs.writeFileSync(outputFileBaseName+'-ids.json', JSON.stringify(movies.map(m => m.objectID),null,4) , 'utf-8');
}


exportMovies();