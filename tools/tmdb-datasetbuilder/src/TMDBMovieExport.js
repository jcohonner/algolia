const cliProgress = require('cli-progress');
const fs = require('fs');

const TMDB_API_PAGE_LIMIT = 500;
const EXPORT_FILENAME_PREFIX = 'movies';


const {getImageURL,dateToTimestamp,getRandomInt} = require('./utils')

module.exports = class TMDBMovieExport {
    constructor({apiKey, languages, price, featured, maxPages, outputFolder, movieList, exclusionList}) {
        this.tmdb = require('themoviedb-api-client')(apiKey);
        this.languages = languages;
        this.maxPages = Math.min(maxPages,TMDB_API_PAGE_LIMIT);
        this.outputFolder = outputFolder;
        this.featuredMovies = featured?require.main.require(featured):[];
        this.prices = price?require.main.require(price):false;
        this.exclusionList = exclusionList?require.main.require(exclusionList):[];
        this.movieList = movieList?require.main.require(movieList):false;
    }

    async run() {
        let movies=[];

        if (this.movieList.length > 0) {
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
        //await this.exportMovies(movieList);
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(this.movieList.length, 0);

        //We group per 20 movies to avoid to send too many requests to the API
        let chunks = [],
            chunkSize = 20;
        for (let i = 0,j = this.movieList.length; i < j; i += chunkSize) {
            chunks.push(this.movieList.slice(i, i + chunkSize));
        }

        //Get Movie details
        let movies = []
        for (let i = 0,j = chunks.length; i < j; i += 1) {
            movies.push(... await Promise.all(chunks[i].map(movieID => this.getMovie(movieID))));
            progressBar.increment(chunks[i].length);
        };

        progressBar.stop();

        //return non null movies (filtered by exclusion list or errors)
        return movies.filter(movie => movie);
    }
 
    async getMoviesFromDiscover() {

        //Get movie list without language (en-US per default)
        let page = 1;
        const filters = { include_adult:false, release_date_lte: new Date().toISOString().split('T')[0] };
        let {body: {results, total_pages} } = await this.tmdb.discoverMovie({page: page, ...filters});
        let movies = [];
        
        total_pages = Math.min(this.maxPages,total_pages);
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(total_pages, 0);
    
        while (results.length) {
            progressBar.update(page);
    
            movies.push(... await Promise.all(results.map(movie => this.getMovie(movie.id))));
    
            if (page < total_pages) {
                page++;
                const response = await this.tmdb.discoverMovie({page: page, ...filters});
                results = response.body.results;
            } else {
                results = [];
            }
        };
    
        progressBar.stop();
    
        //return non null movies (filtered by exclusion list or errors)
        return movies.filter(movie => movie);
    }


    async getMovie(movieID) {
        //check exclusion list
        if (this.exclusionList.includes(movieID)) return null;

        //Initial language
        try {
            const {body : movieDetails} = await this.tmdb.movieInfo({id: movieID, language: this.languages[0], append_to_response: 'credits'});
            
            //remove if not yet released
            if (movieDetails.status !== 'Released') return null;

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
                director: movieDetails.credits?.crew?.find(c => c.job === 'Director')?.name,
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
        
            if (this.prices) {
                //10% of the time, we add an on sale price
                const priceMod = (Math.random() <= 0.1)?'sales':'standard';
                const priceData = this.prices[priceMod][getRandomInt(this.prices[priceMod].length)];
                movieData.price = priceData.price;
                movieData.original_price = priceData.original_price;
                movieData.on_sale  = priceData.on_sale;
            }
        
            movieData.featured = this.featuredMovies.includes(movieDetails.id);
            
        
            await Promise.all(this.languages.slice(1).map(async (language) => {            
                const {body : movieDetailLang} = await this.tmdb.movieInfo({id: movieID, language: language});
                movieData.title[language] = movieDetailLang.title;
                movieData.overview[language] = movieDetailLang.overview;
                movieData.genres[language] = movieDetailLang.genres?.map(g => g.name);
                movieData.poster[language] = getImageURL(movieDetailLang.poster_path); 
            }));

            //Add categories & categoryPageIdentifiers
            // [Genre] > [Decade]
            
            //Decade 80s, 90s, 2000s, 2010s
            let decade = Math.floor(movieData.year/10)*10+'s';

            if (movieData.year<2000) {
                //remove century
                decade = decade.substring(2);
            }
            
            
            movieData.categories = {};
            movieData.categoryPageIdentifiers = {};

            this.languages.forEach(language => {
                movieData.genres[language].forEach(genre => {
                    movieData.categories[language] = {
                        "lvl0": [genre],
                        "lvl1": [genre+' > '+decade],
                        "lvl2": [genre+' > '+decade+' > ' + movieData.year]
                    } 
                    movieData.categoryPageIdentifiers[language] = [
                        genre,
                        genre+' > '+decade,
                        genre+' > '+decade+' > ' + movieData.year
                    ]

                    if (movieData.featured) {
                        movieData.categoryPageIdentifiers[language].push('featured');
                    }

                    if (movieData.on_sale) {
                        movieData.categoryPageIdentifiers[language].push('on_sale');
                    }
                });
            });
        
            return movieData;
        } catch {
            return null;
        }
    }

    languageSpecificExport(movies) {
        this.languages.forEach(language => {
            fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'-'+language+'.json', JSON.stringify(movies.map(m => {
                const movie = {...m};
                movie.title = movie.title[language];
                movie.overview = movie.overview[language];
                movie.genres = movie.genres[language];
                movie.poster = movie.poster[language];
                movie.categories = movie.categories[language];
                movie.categoryPageIdentifiers = movie.categoryPageIdentifiers[language];
                return movie;
            }),null,4) , 'utf-8');
        });

        //build list of categories
        let categories = {};
        movies.forEach(movie => {
            this.languages.forEach(language => {
                movie.categories[language].lvl0.forEach(category => {
                    if (!categories[language]) {
                        categories[language] = [];
                    }
                    if (!categories[language].includes(category)) {
                        categories[language].push(category);
                    }
                });
                movie.categories[language].lvl1.forEach(category => {
                    if (!categories[language]) {
                        categories[language] = [];
                    }
                    if (!categories[language].includes(category)) {
                        categories[language].push(category);
                    }
                });
            });
        });

        //write categories for each language
        this.languages.forEach(language => {
            let categoriesData = [];
            categories[language].forEach(category => {
                categoriesData.push({
                    objectID: category,
                    name: category,
                    slug: category.replace(/ > /g, '/')
                });
            });

            fs.writeFileSync(this.outputFolder+'categories-'+language+'.json', JSON.stringify(categoriesData,null,4) , 'utf-8');
        });

    }
}