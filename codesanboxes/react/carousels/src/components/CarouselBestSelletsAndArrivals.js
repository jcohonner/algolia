import React from 'react';
import AlgoliaContext from '../AlgoliaContext';
import CarouselHits from './CarouselHits';

class CarouselBestSelletsAndArrivals extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            hits: []
        };
    }

    componentDidMount() {

        //Use the multipleQuery API to get 2 queries, dedupe and sort
        this.context.multipleQueries([
            {
                indexName: 'movies_distinct_director_release_date_desc',
                query: '',
                params: {
                    hitsPerPage: 4,
                    filters: "on_sale:true AND genres:'Comedy'",
                }
            },
            {
                indexName: 'movies_distinct_director_release_date_desc',
                query: '',
                params: {
                    hitsPerPage: 4,
                    filters: "featured:true AND genres:'Comedy'",
                }
            },
        ]).then(({results}) => {
            let hits = [],
                newArrivalIteration = 0,
                bestSellersIDs = results[0].hits.map(hit => hit.objectID);

            //Always add the new arrivals
            hits = hits.concat(results[0].hits.slice(0,2));

            //Add the best sellers if there are less than 3 (only the onces not in Best Sellers)
            while (hits.length<4 && newArrivalIteration<results[1].hits.length) {
                if (!bestSellersIDs.includes(results[1].hits[newArrivalIteration].objectID)) {
                    hits.push(results[1].hits[newArrivalIteration]);
                }
                newArrivalIteration++;
            }

            //Sort by release date
            hits = hits.sort((a,b) => { return a.release_date < b.release_date ? 1 : -1; });
            
            this.setState({hits: hits});

        }).catch(function (err) { console.error(err); });
    }

    render() {
        return (
            <CarouselHits hits={this.state.hits} />
        )
    }
}

CarouselBestSelletsAndArrivals.contextType = AlgoliaContext;

export default CarouselBestSelletsAndArrivals;