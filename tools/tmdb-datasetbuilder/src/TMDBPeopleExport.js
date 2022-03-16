const cliProgress = require('cli-progress');
const fs = require('fs');

const TMDB_API_PAGE_LIMIT = 500;
const EXPORT_FILENAME_PREFIX = 'people';


const {getImageURL,dateToTimestamp,getRandomInt} = require('./utils')

module.exports = class TMDBPeopleExport {
    constructor({apiKey, maxPages, outputFolder, languages, exclusionList}) {
        this.tmdb = require('themoviedb-api-client')(apiKey);
        this.maxPages = Math.min(maxPages,TMDB_API_PAGE_LIMIT);
        this.languages = languages;
        this.outputFolder = outputFolder;
        this.exclusionList = exclusionList?require.main.require(exclusionList):[];
    }

    async run() {
        let people = await this.getPeopleFromPopular();


        if (!fs.existsSync(this.outputFolder)){
            fs.mkdirSync(this.outputFolder, { recursive: true });
        }

        //Export to files
        fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'.json', JSON.stringify(people,null,4) , 'utf-8');
        fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'-actors.json', JSON.stringify(people.filter(p=>p.know_for_department==="Acting"),null,4) , 'utf-8');
        fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'-directors.json', JSON.stringify(people.filter(p=>p.know_for_department==="Directing"),null,4) , 'utf-8');
        fs.writeFileSync(this.outputFolder+EXPORT_FILENAME_PREFIX+'-ids.json', JSON.stringify(people.map(m => m.objectID),null,4) , 'utf-8');
    }

 
    async getPeopleFromPopular() {

        //Get movie list without language (en-US per default)
        let page = 1;
        let {body: {results, total_pages} } = await this.tmdb.personPopular({page: page });
        let people = [];
        
        total_pages = Math.min(this.maxPages,total_pages);
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(total_pages, 0);
    
        while (results.length) {
            progressBar.update(page);
    
            people.push(... await Promise.all(results.filter(p => !p.adult).map(p => this.getPerson(p.id))));
    
            if (page < total_pages) {
                page++;
                const response = await this.tmdb.personPopular({page: page });
                results = response.body.results;
            } else {
                results = [];
            }
        };
    
        progressBar.stop();
    
        //return non null movies (filtered by exclusion list or errors)
        return people.filter(p => p);
    }


    async getPerson(personID) {
        //check exclusion list
        if (this.exclusionList.includes(personID)) return null;

        //Initial language
        try {
            const {body : personDetails} = await this.tmdb.personInfo({id: personID, language: this.languages[0]});
            
            let personData = {
                objectID: personDetails.id,
                name: personDetails.name,
                birthday: dateToTimestamp(personDetails.birthday),
                also_known_as: personDetails.also_known_as,
                biography: personDetails.biography,
                know_for_department: personDetails.known_for_department,
                picture: getImageURL(personDetails.profile_path),
                popularity: personDetails.popularity,
            }
        
            return personData;
        } catch {
            return null;
        }
    }
}