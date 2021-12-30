
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


module.exports = {
    getImageURL: (path) => {
        return `${TMDB_IMAGE_BASE_URL}${path}`;
    },
    dateToTimestamp: (date) => {
        return (new Date(date).getTime()) / 1000;
    },
    getRandomInt: (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    }
}