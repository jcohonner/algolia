import React from 'react';
import AlgoliaContext from '../AlgoliaContext';
import CarouselHits from './CarouselHits';

class CarouselMoreFrom extends React.Component {


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
                indexName: 'movies_cr_release_date_desc',
                query: '',
                params: {
                    hitsPerPage: 4,
                    filters: "on_sale:true AND director:'Quentin Tarantino'",
                    optionalFilters: ["genres:Comedy"]
                }
            },
            {
                indexName: 'movies_cr_release_date_desc',
                query: '',
                params: {
                    hitsPerPage: 4,
                    filters: "featured:true AND director:'Quentin Tarantino'",
                    optionalFilters: ["genres:Comedy"]
                }
            },
        ]).then(({results}) => {
            let hits = [],
                newArrivalIteration = 0,
                bestSellersIDs = results[0].hits.map(hit => hit.objectID);

            //Always add  2 from the first query
            hits = hits.concat(results[0].hits.slice(0,2));

            //Add query 2 while there are less than 4 (only the onces not in hits from Q1)
            while (hits.length<4 && newArrivalIteration<results[1].hits.length) {
                if (!bestSellersIDs.includes(results[1].hits[newArrivalIteration].objectID)) {
                    hits.push(results[1].hits[newArrivalIteration]);
                }
                newArrivalIteration++;
            }

            //If still not enough add from Q1
            if (hits.length<4) hits = hits.concat(results[0].hits.slice(2,4-hits.length));

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
CarouselMoreFrom.contextType = AlgoliaContext;

export default CarouselMoreFrom;