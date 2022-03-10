import React from 'react';
import AlgoliaContext from '../AlgoliaContext';
import CarouselHits from './CarouselHits';


class CarouselWeightedFilters extends React.Component {
    static contextType = AlgoliaContext;
    constructor(props) {
        super(props);
        this.state = {
            hits: []
        };
    }

    componentDidMount() {
        this.context.initIndex('movies_distinct_director_release_date_desc').search('',
        {
            "filters":"director:'Lana Wachowski'<score=4> OR genres:'Science Fiction'<score=2> OR genres:'Adventure'<score=1>",
            hitsPerPage: 4
        }
        ).then(({hits})=> {
            this.setState({hits});
        }).catch(err => { console.error(err); });
    }

    render() {
        return (
            <CarouselHits hits={this.state.hits} />
        )
    }
}

export default CarouselWeightedFilters;