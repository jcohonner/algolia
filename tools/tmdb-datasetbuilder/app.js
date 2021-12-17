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
        id: movieDetails.id,
        original_title: movieDetails.original_title,
        original_language: movieDetails.original_language,
        release_date: dateToTimestamp(movieDetails.release_date),
        vote_average: Math.floor(movieDetails.vote_average),
        vote_count: movieDetails.vote_count,
        popularity: movieDetails.popularity,
        year: movieDetails.release_date?.substring(0, 4),
        actors: movieDetails.credits?.cast?.map(a => a.name),
        backdrop_path: getImageURL(movieDetails.backdrop_path),
        genres: movieDetails.genres?.map(g => g.name),
        poster_path: getImageURL(movieDetails.poster_path),
        title: {
            [languages[0]]: movieDetails.title,
        },
        overview: {
            [languages[0]]: movieDetails.overview,
        },
        genre_translations: {
            [languages[0]]: movieDetails.genres?.map(g => g.name),
        },
        poster_path_translations: {
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
        movieData.genre_translations[language] = movieDetailLang.genres?.map(g => g.name);
        movieData.poster_path_translations[language] = getImageURL(movieDetailLang.poster_path); 
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

}

function languageSpecificExport(movies) {
    languages.forEach(language => {
        fs.writeFileSync(outputFileBaseName+'-'+language+'.json', JSON.stringify(movies.map(m => {
            return {
                id: m.id,
                original_title: m.original_title,
                original_language: m.original_language,
                release_date: m.release_date,
                vote_average: m.vote_average,
                vote_count: m.vote_count,
                popularity: m.popularity,
                year: m.year,
                actors: m.actors,
                backdrop_path: m.backdrop_path,
                poster_path: m.poster_path_translations[language],
                title: m.title[language],
                overview: m.overview[language],
                genres: m.genre_translations[language],
                price: m.price,
                original_price: m.original_price,
                on_sale: m.on_sale,
                featured: m.featured,
                budget: m.budget,
                revenue: m.revenue
            }
        }),null,4) , 'utf-8');
    });
}

exportMovies();