import React from 'react';
import AlgoliaContext from '../AlgoliaContext';
import CarouselHits from './CarouselHits';


class CarouselNewArrivals extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            hits: []
        };
    }

    componentDidMount() {
        this.context.initIndex('movies_distinct_director_release_date_desc').search('',
        {
            hitsPerPage: 3,
            filters: 'featured:true'
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
CarouselNewArrivals.contextType = AlgoliaContext;

export default CarouselNewArrivals;