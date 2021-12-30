const cliProgress = require('cli-progress');
const fs = require('fs');

const TMDB_API_PAGE_LIMIT = 500;
const EXPORT_FILENAME_PREFIX = 'movies';
const prices = require.main.require('./data/prices.json');
const featuredMovies = require.main.require('./data/featured-movies.json');
const {getImageURL,dateToTimestamp,getRandomInt} = require('./utils')

module.exports = class TMDBExport {
    constructor({apiKey, languages, price, featured, maxPages, outputFolder, movieList}) {
        this.tmdb = require('themoviedb-api-client')(apiKey);
        this.languages = languages;
        this.price = price;
        this.featured = featured;
        this.maxPages = Math.min(maxPages,TMDB_API_PAGE_LIMIT);
        this.outputFolder = outputFolder;
        this.movieListFile = movieList;
    }

    async run() {
        let movies=[];

        if (this.movieListFile) {
            movies = await this.getMoviesFromFile();
        } else {
            movies = await this.getMoviesFromDiscover();
        }


        if (!fs.existsSync(this.outputFolder)){
            fs.mkdirSync(this.outputFolder, { recursive: true });
        }

        //Export to files
        fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'.json', JSON.stringify(movies,null,4) , 'utf-8');
        fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'-ids.json', JSON.stringify(movies.map(m => m.objectID),null,4) , 'utf-8');
        this.languageSpecificExport(movies);
    }

    async getMoviesFromFile() {
        const movieIDs = require.main.require(this.movieListFile);
        //await this.exportMovies(movieList);
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(movieIDs.length, 0);

        //We group per 20 movies to avoid to send too many requests to the API
        let chunks = [],
            chunkSize = 20;
        for (let i = 0,j = movieIDs.length; i < j; i += chunkSize) {
            chunks.push(movieIDs.slice(i, i + chunkSize));
        }

        //Get Movie details
        let movies = []
        for (let i = 0,j = chunks.length; i < j; i += 1) {
            movies.push(... await Promise.all(chunks[i].map(movieID => this.getMovie(movieID))));
            progressBar.update(chunks[i].length);
        };

        progressBar.stop();

        return movies;
    }
 
    async getMoviesFromDiscover() {

        //Get movie list without language (en-US per default)
        let page = 1;
        let {body: {results, total_pages} } = await this.tmdb.discoverMovie({page: page, include_adult:false });
        let movies = [];
        
        total_pages = Math.min(this.maxPages,total_pages);
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(total_pages, 0);
    
        while (results.length) {
            progressBar.update(page);
    
            movies.push(... await Promise.all(results.map(movie => this.getMovie(movie.id))));
    
            if (page < total_pages) {
                page++;
                const response = await this.tmdb.discoverMovie({page: page, include_adult:false });
                results = response.body.results;
            } else {
                results = [];
            }
        };
    
        progressBar.stop();
    
        return movies;
    }


    async getMovie(movieID) {
        //Initial language
        const {body : movieDetails} = await this.tmdb.movieInfo({id: movieID, language: this.languages[0], append_to_response: 'credits'});
        
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
                [this.languages[0]]: movieDetails.title,
            },
            overview: {
                [this.languages[0]]: movieDetails.overview,
            },
            genres: {
                [this.languages[0]]: movieDetails.genres?.map(g => g.name),
            },
            poster: {
                [this.languages[0]]: getImageURL(movieDetails.poster_path),
            },
            budget: movieDetails.budget,
            revenue: movieDetails.revenue
        }
    
        if (this.price) {
            //10% of the time, we add an on sale price
            const priceMod = (Math.random() <= 0.1)?'sales':'standard';
            const priceData = prices[priceMod][getRandomInt(prices[priceMod].length)];
            movieData.price = priceData.price;
            movieData.original_price = priceData.original_price;
            movieData.on_sale  = priceData.on_sale;
        }
    
        if (this.featured) {
            movieData.featured = featuredMovies.includes(movieData.id);
        }
        
    
        await Promise.all(this.languages.slice(1).map(async (language) => {
            const {body : movieDetailLang} = await this.tmdb.movieInfo({id: movieID, language: language});
            movieData.title[language] = movieDetailLang.title;
            movieData.overview[language] = movieDetailLang.overview;
            movieData.genres[language] = movieDetailLang.genres?.map(g => g.name);
            movieData.poster[language] = getImageURL(movieDetailLang.poster_path); 
        }));
    
        return movieData;
    }

    languageSpecificExport(movies) {
        this.languages.forEach(language => {
            fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'-'+language+'.json', JSON.stringify(movies.map(m => {
                const movie = {...m};
                movie.title = movie.title[language];
                movie.overview = movie.overview[language];
                movie.genres = movie.genres[language];
                movie.poster = movie.poster[language];
                return movie;
            }),null,4) , 'utf-8');
        });
    }
}